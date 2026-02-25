const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

let mainWindow

app.whenReady().then(() => {

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  mainWindow.loadFile("index.html")
})

ipcMain.handle("getStops", async () => {
  try {
    const res = await fetch("https://data.etabus.gov.hk/v1/transport/kmb/stop")
    const data = await res.json()
    return data.data
  } catch (err) {
    console.log("API error:", err)
    return []
  }
})