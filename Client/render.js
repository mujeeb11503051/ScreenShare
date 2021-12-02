const ipcRenderer = require('electron').ipcRenderer;
window.onload = function() {
  ipcRenderer.on("uuid", (event, data) => {
      document.getElementById("code").innerHTML = data;
      console.log(data);
  })
}

const startBtn = document.getElementById('startBtn');
startBtn.onclick = e => {
  console.log('start button pressed');
  ipcRenderer.send("start-share", {});
  document.getElementById("start").style.display = "none";
  document.getElementById("stop").style.display = "block";
};

const stopBtn = document.getElementById('stopBtn');

stopBtn.onclick = e => {
  ipcRenderer.send("stop-share", {});
  document.getElementById("stop").style.display = "none";
  document.getElementById("start").style.display = "block";
};
