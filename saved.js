const listDiv = document.getElementById("list")

function display(){

  let saved = JSON.parse(localStorage.getItem("stops")) || []
  let stopList = JSON.parse(localStorage.getItem("allStops")) || []

  listDiv.innerHTML = ""

  saved.forEach((item, i)=>{

    const container = document.createElement("div")
    container.className = "saved-card"

    const info = document.createElement("div")
    info.innerHTML = `
      <b>Stop Name:</b> ${item.stopName}<br>
      <b>Stop ID:</b> ${item.stopID}<br>
      <b>Saved Time:</b> ${item.time}<br>
      <b>Average Waiting:</b> ${item.avgWait} minutes<br>
    `

    const updateBtn = document.createElement("button")
    updateBtn.textContent = "Update"

    const deleteBtn = document.createElement("button")
    deleteBtn.textContent = "Delete"

    const dropdown = document.createElement("select")
    dropdown.style.display = "none"

    stopList.slice(0,15).forEach(s=>{
      const opt = document.createElement("option")
      opt.value = s.stop
      opt.textContent = s.name_en
      dropdown.appendChild(opt)
    })

    const saveBtn = document.createElement("button")
    saveBtn.textContent = "Save"
    saveBtn.style.display = "none"

    updateBtn.onclick = ()=>{
      dropdown.style.display = "inline"
      saveBtn.style.display = "inline"
    }

    saveBtn.onclick = ()=>{

      const selectedOption = dropdown.options[dropdown.selectedIndex]

      saved[i] = {
        stopID: dropdown.value,
        stopName: selectedOption.textContent,
        time: new Date().toLocaleTimeString(),
        avgWait: item.avgWait
      }

      localStorage.setItem("stops", JSON.stringify(saved))

      alert("Prediction updated successfully!")

      display()
    }

    deleteBtn.onclick = ()=>{
      if(confirm("Delete this prediction?")){
        saved.splice(i,1)
        localStorage.setItem("stops", JSON.stringify(saved))
        alert("Deleted successfully!")
        display()
      }
    }

    container.appendChild(info)
    container.appendChild(updateBtn)
    container.appendChild(deleteBtn)
    container.appendChild(document.createElement("br"))
    container.appendChild(dropdown)
    container.appendChild(saveBtn)
    container.appendChild(document.createElement("hr"))

    listDiv.appendChild(container)
  })
}

window.onload = display

document.getElementById("goHome").onclick = () => {
  window.location.href = "index.html"
}

const goSavedBtn = document.getElementById("goSaved")

if(goSavedBtn){
  goSavedBtn.addEventListener("click", () => {
    window.location.href = "saved.html"
  })
}

const goHomeBtn = document.getElementById("goHome")

if (goHomeBtn) {
  goHomeBtn.addEventListener("click", () => {
    window.location.href = "index.html"
  })
}