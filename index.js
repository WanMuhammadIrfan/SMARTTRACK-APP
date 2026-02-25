// ================= CLOCK =================
setInterval(() => {
  const now = new Date()
  const clock = document.getElementById("clock")
  if (clock) {
    clock.innerText = "Current time: " + now.toLocaleTimeString()
  }
}, 1000)

const checkBtn = document.getElementById("checkBtn")
const resultDiv = document.getElementById("result")
const saveBtn = document.getElementById("saveBtn")
const dropdown = document.getElementById("stopDropdown")

let currentStop = ""
let currentStopName = ""
let avgWaitGlobal = 0


const { ipcRenderer } = require("electron")

async function getStops(){
  const stops = await ipcRenderer.invoke("getStops")
  return stops || []
}


// ================= LOAD DROPDOWN =================
async function loadStops(){

  const stops = await getStops()

  // Save stops for saved page
  localStorage.setItem("allStops", JSON.stringify(stops))

  dropdown.innerHTML = '<option value="">Select Bus Stop</option>'

  stops.slice(0,15).forEach(stop=>{
    const option = document.createElement("option")
    option.value = stop.stop
    option.textContent = stop.name_en
    dropdown.appendChild(option)
  })
}


// ================= CHECK ARRIVAL =================
checkBtn.addEventListener("click", async ()=>{

  const stopID = dropdown.value

  if(!stopID){
    alert("Please select a bus stop")
    return
  }

  const stops = await getStops()

  if(stops.length === 0){
    resultDiv.innerHTML = "Unable to load stop data. Please try again."
    return
  }

  const stop = stops.find(s => s.stop === stopID)

  if(!stop){
    resultDiv.innerHTML = "Stop not found"
    return
  }

  const now = new Date()

  let html = `
    <h3>Stop Found</h3>
    <b>Stop Name:</b> ${stop.name_en}<br><br>
    <h3>Arrival Predictions</h3>
  `

  let totalWait = 0

  // Generate 3 upcoming vehicles
  for(let i = 1; i <= 3; i++){

    const arrival = new Date(now.getTime() + i*5*60000)
    const wait = Math.floor((arrival - now)/60000)

    totalWait += wait

    html += `
      <div class="bus-card">
        <b>${i === 1 ? "🟢 NEXT VEHICLE" : "Vehicle " + i}</b><br>
        Arrival Time: ${arrival.toLocaleTimeString()}<br>
        Waiting Time: ${wait} minutes
      </div>
    `
  }

  html += `
    <h4 style="color:#1f7ae0;">
      Next arriving vehicle in 5 minutes
    </h4>
  `

  const avgWait = Math.floor(totalWait / 3)
  avgWaitGlobal = avgWait

  html += `
    <p><b>Average waiting time:</b> ${avgWait} minutes</p>
  `

  resultDiv.innerHTML = html

  currentStop = stopID
  currentStopName = stop.name_en

  saveBtn.style.display = "block"
})


// ================= SAVE PREDICTION =================
saveBtn.addEventListener("click", ()=>{

  let saved = JSON.parse(localStorage.getItem("stops")) || []

  saved.push({
    stopID: currentStop,
    stopName: currentStopName,
    time: new Date().toLocaleTimeString(),
    avgWait: avgWaitGlobal
  })

  localStorage.setItem("stops", JSON.stringify(saved))

  alert("Prediction saved!")
})


// ================= NAVIGATION =================
const goSavedBtn = document.getElementById("goSaved")

if(goSavedBtn){
  goSavedBtn.addEventListener("click", () => {
    window.location.href = "saved.html"
  })
}


// ================= INITIAL LOAD =================
window.addEventListener("load", async () => {
  await loadStops()
})