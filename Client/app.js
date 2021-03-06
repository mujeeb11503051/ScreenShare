const { app, BrowserWindow,ipcMain } = require('electron');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const screenshot = require('screenshot-desktop');
var robot = require("robotjs");


const socket = require('socket.io-client')('http://70e5-2a02-908-1b51-ee60-6469-1443-e696-928c.ngrok.io');
let interval;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  socket.on("mouse-move", function(data){
    var obj = JSON.parse(data);
    var x = obj.x;
    var y = obj.y;

    robot.moveMouse(x, y);
  })

  socket.on("mouse-click", function(data){
    robot.mouseClick();
  })

  socket.on("type", function(data){
    var obj = JSON.parse(data);
    var key = obj.key;

    robot.keyTap(key);
  })


  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on("start-share", function(event, arg) {
  var uuid = uuidv4();
  socket.emit("join-message", uuid);
  event.reply("uuid", uuid);

 interval = setInterval(function() {
    screenshot().then((img) => {
        var imgStr = new Buffer(img).toString('base64');

        var obj = {};
        obj.room = uuid;
        obj.image = imgStr;

        socket.emit("screen-data", JSON.stringify(obj));
    })
}, 100)


})

ipcMain.on("stop-share", function(event, arg) {
  clearInterval(interval);
})
