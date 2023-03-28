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
function loadsettings(filelocation){
  const fileName = filelocation;
  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    else{
      return JSON.parse(data);
    }
});
}
function addadmin(settings,admin){
    settings.admins.push(admin);
}

