const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

	var fs=require('fs');
	var xml2js=require('xml2js');
	var parser = new xml2js.Parser();

	// parser XML chtch data--------------------------------
	var Cadence_Array = [];
	var Speen_Array = [];
	var Watts_Array = [];
	fs.readFile("data/activity.tcx",'utf-8',function(err,data){

		// ":" transfer "_"
		data =  data.replace(/:/g, "_");
		
		//parser XML
		parser.parseString(data, function (err, result) {
			var data_path = result.TrainingCenterDatabase.Activities[0].Activity[0].Lap[0].Track[0];
			for (i=0; i<data_path.Trackpoint.length; i++){
				//catch data
				Cadence_Array[i] = data_path.Trackpoint[i].Cadence[0];
				Speen_Array[i] = data_path.Trackpoint[i].Extensions[0].ns3_TPX[0].ns3_Speed[0];
				Watts_Array[i] = data_path.Trackpoint[i].Extensions[0].ns3_TPX[0].ns3_Watts[0];
			}
		});

		// expore data.txt
		var Cadence_Array_print = "Cadence:\r\n"+Cadence_Array+"\r\n\r\n";
		var Speen_Array_print = "Speen:\r\n"+Speen_Array+"\r\n\r\n";
		var Watts_Array_print = "Watts:\r\n"+Watts_Array;
		var exportText = Cadence_Array_print+Speen_Array_print+Watts_Array_print;
		fs.writeFile('./data/data_'+Math.floor(Date.now()/1000)+'.txt',exportText, 'utf-8',(err)=>{});  // write data.txt

	})
