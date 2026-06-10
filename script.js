const calendar = document.getElementById("calendar");
const monthEl = document.getElementById("month");

const type = document.getElementById("type");
const rider = document.getElementById("rider");
const horse = document.getElementById("horse");
const raceName = document.getElementById("raceName");
const from = document.getElementById("from");
const to = document.getElementById("to");
const note = document.getElementById("note");
const raceBox = document.getElementById("raceBox");

const horseFilter = document.getElementById("horseFilter");
const workCount = document.getElementById("workCount");
const raceDaysCount = document.getElementById("raceDaysCount");

let date = new Date();
let selectedDate = null;
let editId = null;

let events = JSON.parse(localStorage.getItem("events")) || [];


const months = [
  "Január","Február","Marec","Apríl","Máj","Jún",
  "Júl","August","September","Október","November","December"
];

type.addEventListener("change", () => {
  raceBox.classList.toggle("hidden", type.value !== "Preteky");
});

/* SAVE */
function save(){
  localStorage.setItem("events", JSON.stringify(events));
}

/* CLEAN */
function norm(v){
  return (v || "").trim().toLowerCase();
}

/* DATE FIX (DÔLEŽITÉ) */
function parseDate(str){
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function isSameDay(a,b){
  return a.getTime() === b.getTime();
}

/* LOAD HORSES */


function loadHorses(){
  const horses = [...new Set(
    events.map(e => e.horse).filter(h => h && h.trim() !== "")
  )];

  horseFilter.innerHTML = `<option value="">všetky kone</option>`;
  horses.forEach(h=>{
    horseFilter.innerHTML += `<option value="${h}">${h}</option>`;
  });
}

/* RENDER */
function render(){

  calendar.innerHTML = "";

  const y = date.getFullYear();
  const m = date.getMonth();

  monthEl.textContent = `${months[m]} ${y}`;

  const first = new Date(y,m,1);
  const last = new Date(y,m+1,0);
  const start = (first.getDay()+6)%7;

  for(let i=0;i<start;i++){
    calendar.innerHTML += `<div></div>`;
  }

  const horseF = norm(horseFilter.value);

  for(let d=1; d<=last.getDate(); d++){

    const dateKey = `${y}-${m+1}-${d}`;
    const currentDay = parseDate(dateKey);

    const dayEvents = events.filter(e => {

      const h = norm(e.horse);
      if(horseF && h !== horseF) return false;

      if(e.type !== "Preteky"){
        return e.date === dateKey;
      }

      const fromD = parseDate(e.from);
      const toD = parseDate(e.to);

      return currentDay >= fromD && currentDay <= toD;
    });

    let html = `<div class="day" onclick="openNew('${dateKey}')">
      <b>${d}</b>`;

    dayEvents.forEach(e => {

      if(e.type === "Preteky"){

        const fromD = parseDate(e.from);
        const toD = parseDate(e.to);

        let cls = "race-bar";
        if(isSameDay(currentDay, fromD)) cls += " race-start";
        else if(isSameDay(currentDay, toD)) cls += " race-end";
        else cls += " race-mid";

        html += `
          <div class="${cls}" onclick="openEdit(event, ${e.id})">
             ${e.raceName}
          </div>
        `;

      } else {

        html += `
          <div class="training" onclick="openEdit(event, ${e.id})">
            ${e.horse || "?"} - ${e.type}
          </div>
        `;
      }
    });

    html += `</div>`;
    calendar.innerHTML += html;
  }

  updateStats();
  loadHorses();
}

/* OPEN NEW */
function openNew(dateKey){
  selectedDate = dateKey;
  editId = null;

  rider.value = "";
  horse.value = "";
  note.value = "";
  raceName.value = "";
  from.value = "";
  to.value = "";

  type.value = "Trening";
  raceBox.classList.add("hidden");

  document.getElementById("delete").style.display = "none";
  document.getElementById("modal").classList.remove("hidden");
}

/* EDIT */
function openEdit(ev, id){
  ev.stopPropagation();

  const e = events.find(x => x.id === id);
  if(!e) return;

  editId = id;
  selectedDate = e.date || null;

  type.value = e.type;
  rider.value = e.rider || "";
  horse.value = e.horse || "";
  note.value = e.note || "";

  if(e.type === "Preteky"){
    raceBox.classList.remove("hidden");
    raceName.value = e.raceName || "";
    from.value = e.from || "";
    to.value = e.to || "";
  } else {
    raceBox.classList.add("hidden");
  }

  document.getElementById("delete").style.display = "block";
  document.getElementById("modal").classList.remove("hidden");
}

/* STATS */
function updateStats(){

  const y = date.getFullYear();
  const m = date.getMonth();

  const startM = new Date(y,m,1);
  const endM = new Date(y,m+1,0);

  const horseF = norm(horseFilter.value);

  const filtered = events.filter(e => {

    const h = norm(e.horse);
    if(horseF && h !== horseF) return false;

    if(e.date){
      const d = parseDate(e.date);
      return d>=startM && d<=endM;
    }

    if(e.type === "Preteky"){
      return parseDate(e.to) >= startM &&
             parseDate(e.from) <= endM;
    }

    return false;
  });

  const work = filtered.filter(e =>
    ["Trening","Jazdenie","Lonž"].includes(e.type)
  ).length;

  let raceDays = 0;

  filtered.forEach(e=>{
    if(e.type==="Preteky"){
      raceDays += (parseDate(e.to)-parseDate(e.from))
        /(1000*60*60*24)+1;
    }
  });

  workCount.textContent = work;
  raceDaysCount.textContent = raceDays;
}

/* SAVE */
document.getElementById("save").onclick = () => {

  const isRace = type.value === "Preteky";

  const e = {
    id: editId || Date.now(),
    type: type.value,
    rider: rider.value,
    horse: horse.value.trim(),
    note: note.value
  };

  if(isRace){
    e.raceName = raceName.value;
    e.from = from.value;
    e.to = to.value;
  } else {
    e.date = selectedDate;
  }

  if(editId){
    const index = events.findIndex(x => x.id === editId);
    if(index !== -1) events[index] = e;
  } else {
    events.push(e);
  }

  save();
  document.getElementById("modal").classList.add("hidden");
  editId = null;
  render();
};

/* DELETE */
document.getElementById("delete").onclick = () => {
  if(!editId) return;
  events = events.filter(e => e.id !== editId);
  save();
  document.getElementById("modal").classList.add("hidden");
  editId = null;
  render();
};

/* CLOSE */
document.getElementById("close").onclick = () => {
  document.getElementById("modal").classList.add("hidden");
};

/* NAV */
document.getElementById("prev").onclick = () => {
  date.setMonth(date.getMonth()-1);
  render();
};

document.getElementById("next").onclick = () => {
  date.setMonth(date.getMonth()+1);
  render();
};

let robotoFont = null;

/* LOAD FONT (Roboto Base64) */
async function loadFont(){
  const url = "./Noto_Sans/static/NotoSans-Regular.ttf";

  const res = await fetch(url);
  const buffer = await res.arrayBuffer();

  const binary = new Uint8Array(buffer);
  let binaryString = "";

  binary.forEach(byte => binaryString += String.fromCharCode(byte));

  robotoFont = btoa(binaryString);
}

loadFont();

/* PDF */
document.getElementById("pdfMonthHorse").onclick = () => {

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const horseF = norm(horseFilter.value);
  if(!horseF) return alert("Vyber koňa!");

  // FONT SETUP
  if(robotoFont){
    doc.addFileToVFS("Roboto.ttf", robotoFont);
    doc.addFont("Roboto.ttf", "Roboto", "normal");
    doc.setFont("Roboto");
  }

  const y = date.getFullYear();
  const m = date.getMonth();

  const startM = new Date(y,m,1);
  const endM = new Date(y,m+1,0);

  const filtered = events.filter(e => {

    const h = norm(e.horse);
    if(h !== horseF) return false;

    if(e.date){
      const d = parseDate(e.date);
      return d >= startM && d <= endM;
    }

    if(e.type === "Preteky"){
      return parseDate(e.to) >= startM &&
             parseDate(e.from) <= endM;
    }

    return false;
  });

  doc.setFontSize(14);
  doc.text(`🐴 ${horseFilter.value} - ${months[m]} ${y}`, 20, 20);

  let yPos = 40;

  filtered.forEach(e => {

    const text = e.type === "Preteky"
      ? ` ${e.raceName} ${e.from} - ${e.to}`
      : `${e.date} ${e.type} ${e.rider}`;

    doc.text(text, 20, yPos);
    yPos += 10;
  });

  doc.save(`${horseFilter.value}.pdf`);
};
/* INIT */
render();