const fs = require("fs");
const png = require("png-js");
const https =require("https");


//addslot for "admins/template managers" this will add a new subreddit to the template
//warning: this will overwrite the current full template and should be done with care
//as to not overwrite other subs templates without explicit consent 
async function addslot(msg,settings){
    command= msg.content.split(" ");
    const file = message.attachments.first();
    
    if (!file) {
        msg.reply("**ERROR!** No Template File given")
        return;
    }
    if (file.width != settings.canvasSize_x || file.height != settings.canvasSize_y){
        msg.reply("**ERROR!** Template size does not equal the current size of the r/place canvas!")
        return;
    }
    try {
        message.channel.send('Reading the file! This will take some time...');
    
        // download the file, save it to the rawtemplates folder without the subreddit prefix r/
        downloadImage(file.url, "./rawtemplates/"+command[1] +".png");
    

        
        //TODO: -> Color-Correct Template
        colorcorrect("./rawtemplates/"+command[1]+".png");
        //TODO: -> ADD to complete Template(With specific community name)
        combineall()
        one_by_one_to_three_by_three(".full/template1x1.png");
        //maybe additionally update complete 3x3 and 1x1 template on bots (can also be done manually when in a time crunch)
        //this could also be done by command
        }

          catch{
            console.log("Error failed Fetching file");
            msg.reply("**ERROR!** failed to read file")
          }
}

function colorcorrect(image){
  const python= exec('python', ['./pymodules/color_correct.py', image]);
  python.on('close', (code) => {
    if (code !== 0) {
      console.error(`child process exited with code ${code}`);
      return;
    }
    
  });
}
function one_by_one_to_three_by_three(image){
  const python= exec('python', ['./pymodules/normal_to_dotted.py', image]);
  python.on('close', (code) => {
    if (code !== 0) {
      console.error(`child process exited with code ${code}`);
      return;
    }
    
  });

}
function combineall(){
  const python= exec('python', ['./pymodules/combine_all.py']);
  python.on('close', (code) => {
    if (code !== 0) {
      console.error(`child process exited with code ${code}`);
      return;
    }
    
  });
}
function returntemplateall(image){

}
//function to return a template for a specific subreddit.
function returntemplate(msg,sub){
  	fs.readFile("./templates/"+sub+".png", function(err, data) {
    if (err) throw err; // Fail if the file can't be read.
    msg.channel.send({files: [{attachment: data, name: sub+".png"}]});
});
}
//function to test two templates against each other,
//this will be used to check if any changes to the templates size have been made
//a python script with pillow should analyze the templates and return a 2d array of true/false values
//where true means that the pixel is filled and false means that the pixel is empty
//if a pixel does not match the templates form has been changed and will either be denied or in case
//of a template manager/admin will be questioned
function testtemplate(sub,tobe){
  var datasub,datatemplate;
  //execute python script to get the 2d array of true/false values
  const python= exec('python', ['./pymodules/template_to_truefalse.py', "./templates/"+sub+".png"]);
  python.stdout.on('data', (data) => {
    //maybe some more error handling
    datasub=data
  });
  python= exec('python', ['./pymodules/template_to_truefalse.py', "./templatestobe/"+tobe+".png"]);
  python.stdout.on('data', (data) => {
    //maybe some more error handling
    datatemplate=data
  });
  for(x=0;x<datasub.length;x++){
    for(y=0;y<datasub[x].length;y++){
      if(datasub[x][y]!=datatemplate[x][y]){
        return false; //return false if the templates do not match
        //this will only happen when an alphachannel pixel on the new template is filled while it isnt on the original template 
      }
    }
}
return true;
}
function downloadImage(url, filepath) {
  https.get(url, (res) => {
    if (!res.ok){
      console.log("Encountered error: " + res.status);
      return
    }
      res.pipe(fs.createWriteStream(filepath));
  });
  
}