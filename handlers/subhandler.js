module.exports = { readsubs, writesubs, addsub, addrep, remsub };
const fs = require("fs");
const {updatefullTemplate} =require("./templatehandler.js");
/*<subreddit>:{
    reps:[<representativeID1>,<representativeID2>,<representativeID3>],
    template:"./templates/<subreddit>.png " //without the r/ prefix
    },
    allreps:[<representativeID1>,<representativeID2>,<representativeID3>]
    */
   
function readsubs(filelocation){
    var fileName = filelocation;
    return JSON.parse(fs.readFileSync(fileName, 'utf-8'));
  }

function writesubs(subs,filelocation){
    const fileName = filelocation;
    fs.writeFile(fileName, JSON.stringify(subs), (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Subs saved!");
    });
}

function addsub(subs,sub,template){
    subs.subs[sub] ={"reps":[],"template":template};
}

//remove subs, firt remove reps to avoid duplicates in allreps
async function remsub(subs,sub){
    reps=subs.subs[sub].reps;
    for (i in reps){
        remrep(subs,sub,reps[i]);
    }
    fs.unlinkSync("./templates/"+sub+".png");
    delete subs.subs[sub];
    await delay(500)
    updatefullTemplate(settings,settings.updatechannelbot,msg,"./templatebot.png","./toggledbot.csv");
    await delay(500)
    updatefullTemplate(settings,settings.updatechannel,msg,"./template.png","./toggled.csv",true);
  

}
//pushes rep to sub.reps and sub.allreps arrays
function addrep(subs,sub,rep){
    subs.subs[sub].reps.push(rep);  
    subs.allreps.push(rep);
}
//removes rep from all arrays to strip privileges
function remrep(subs,sub,rep){
    subs.subs[sub].reps.splice(subs.subs[sub].reps.indexOf(rep),1);
    subs.allreps.splice(subs.subs.allreps.indexOf(rep),1);
}
