module.exports = { writesettings, loadsettings, addadmin,remadmin,addmanager,remmanager };
const fs = require("fs");
//uses JSON to store settings
function writesettings(settings,filelocation){
    const fileName = filelocation;
    fs.writeFile(fileName, JSON.stringify(settings), (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Settings saved!");
    });
}
//uses JSON to load settings
async function loadsettings(filelocation){
  var fileName = filelocation;
  return JSON.parse(fs.readFileSync(fileName, "utf-8"));
}

function addadmin(settings,admin){
    settings.admins.push(admin);
}
function remadmin(settings,admin){
    settings.admins.splice(settings.admins.indexOf(admin),1);
}

function addmanager(settings,manager){
    settings.ManIDs.push(manager);
}
function remmanager(settings,manager){
    settings.ManIDs.splice(settings.managers.indexOf(manager),1);
}

