const Axios = require('axios');
module.exports = { addslot, returnTemplate, testTemplate,updateTemplate, toggleTemplate, untoggleTemplate, togglebot, untogglebot, gisty};
const fs = require("fs");
const https =require("https");
var {execSync} = require('child_process');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const clientsecret=""
const gitoken=""
const { Octokit, App } = require("octokit");
const fetch= require("node-fetch")
const octokit = new Octokit({
  auth: gitoken,
  request:{
    fetch: fetch
  }
})
var jsonup={

  "contact": "",

  "templates": [

    {

      "name": "Furry_irl",

      "sources": [
            ""

      ],

      "x": 0,

      "y": 0

    }

  ],

  "whitelist": [],

  "blacklist": []

}


async function gisty(msg,settings,x,y){
  console.log("gitsied")
  sendchannel= await msg.guild.channels.cache.find(channel => channel.id === settings.updatechannel);
  sendchannelbot = await msg.guild.channels.cache.find(channel => channel.id === settings.updatechannelbot)
  if (sendchannel) { // make sure that the targeted channel exists, if it exists then fetch its last message
      foundmessage =await sendchannel.messages.fetch({ limit: 1 })
      foundmessagebot = await sendchannelbot.messages.fetch({limit: 1})
      console.log(foundmessage);
      var file
      var filebot
      try{
      file = foundmessage.first().attachments.first()
      filebot = foundmessagebot.first().attachments.first() 
      }
      catch(error){
        console.log(error)
        msg.reply("error, make sure the Overlay channels ONLY have images \n other errors will be handled by us")
      }
      jsonup.templates[0].sources= [file.url];
      jsonup.templates[0].x=parseInt(x);
      jsonup.templates[0].y=parseInt(y);
      await octokit.request('PATCH /gists/09ce4195fada18db6dc5e32e30a8e34b', {
        gist_id: '09ce4195fada18db6dc5e32e30a8e34b',
        description: 'Snyc Json',
        files: {
          'furaliance.json': {
            content: JSON.stringify(jsonup)
          }
        },
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
      jsonup.templates[0].sources= [filebot.url];
      await octokit.request('PATCH /gists/a2fca3b664e951a6e7b9ef8062f03511',{
        gist_id: 'a2fca3b664e951a6e7b9ef8062f03511',
        description: 'Sync Json',
        files: {
          'furaliancebots.json': {
            content: JSON.stringify(jsonup)
          }
        },
        headers:{
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
  } else { //if target doesn't exist, send an error
    console.log("Target for overlay does not exist!");
  }

}

async function addtobe(msg,settings){
  var command=msg.content.split(" ");
  const file = msg.attachments.first();
  if (!file) {
    msg.reply("**ERROR!** No Template File given")
    return false;
}
  if (file.width != settings.canvasSize_x || file.height != settings.canvasSize_y){
    msg.reply("**ERROR!** Template size does not equal the current size of the r/place canvas!")
    return false;
  }
   await downloadImage(file.url, "./templatestobe/"+command[1] +".png");
  return true;
}
//addslot for "admins/template managers" this will add a new subreddit to the template
//warning: this will overwrite the current full template and should be done with care
//as to not overwrite other subs templates without explicit consent 
async function addslot(msg,settings){
    command= msg.content.split(" ");
    const file = msg.attachments.first();
    msg.reply('Reading the file! This will take some time...');
    if (!file) {
        msg.reply("**ERROR!** No Template File given")
        return false;
    }
    if (file.width != settings.canvasSize_x || file.height != settings.canvasSize_y){
        msg.reply("**ERROR!** Template size does not equal the current size of the r/place canvas!")
        return false;
    }
    try {
    
        // download the file, save it to the rawtemplates folder without the subreddit prefix r/
        await downloadImage(file.url, "./templatesraw/"+command[1] +".png");
    

        
        //TODO: -> Color-Correct Template
        colorcorrect(command[1]);
        await delay(500)
        updatefullTemplate(settings,settings.updatechannel,msg,"./template.png","./toggled.csv");
        await delay(500)
        updatefullTemplate(settings,settings.updatechannelbot,msg,"./templatebot.png","./toggledbot.csv",true);
        msg.reply("Template has been added to the canvas!")
        }

          catch(err){
            console.log("Error failed Fetching file \n" +err);
            msg.reply("**ERROR!** failed to read file");
            return false;
          }
          return true;
}

function colorcorrect(sub){
  result = execSync("python3 ./handlers/pymodules/colour_correct.py ./templatesraw/"+sub+".png ./templates/"+sub+".png").toString();
  console.log(result);
  
}
function one_by_one_to_three_by_three(image){
  var python= execSync('python3', ['./pymodules/normal_to_dotted.py', image]);
  python.on('close', (code) => {
    if (code !== 0) {
      console.error(`child process exited with code ${code}`);
      return;
    }
    
  });

}

//function to return a template for a specific subreddit.
function returnTemplate(msg,sub){
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
async function testTemplate(msg,settings,sub){
  await addtobe(msg,settings);
  //execute python script to get the 2d array of true/false values
  ressubs=  execSync("python3 ./handlers/pymodules/template_to_truefalse.py ./templates/"+sub+".png ./templatestobe/"+sub+".png").toString();
return ressubs;
}

async function downloadImage(url, filepath) {
  const response = await Axios({
      url: url,
      method: 'GET',
      responseType: 'stream'
  });
  return new Promise((resolve, reject) => {
      response.data.pipe(fs.createWriteStream(filepath))
          .on('error', reject)
          .once('close', () => resolve(filepath)); 
  });
}
function updatefullTemplate(settings,updatechannel,msg,dest,toggled,bot=false){
  templatereturn= execSync("python3 ./handlers/pymodules/templatemerge.py ./templates/ " +settings.canvasSize_x +" " +settings.canvasSize_y +" "+toggled +" " +dest).toString();
  sendchannel=msg.guild.channels.cache.find(channel => channel.id === updatechannel);
  /*if(bot==false){
  templatedottet= execSync("python3 ./handlers/pymodules/normal_to_dotted.py "+"./template.png").toString();
  fs.readFile("./dottet.png", function(err, data) {
    if (err) throw err; // Fail if the file can't be read.
    sendchannel.send({files: [{attachment: data, name: "template.png"}]}).then(()=>{return;});
  });
  }
  */
  fs.readFile(dest, function(err, data) {
    if (err) throw err; // Fail if the file can't be read.
    sendchannel.send({files: [{attachment: data, name: "template.png"}]}).then(()=>{return;});
});
  
}
function toggleTemplate(msg,settings,sub){
  fs.writeFileSync("./toggled.csv",fs.readFileSync("./toggled.csv").toString()+sub+"\n");
  updatefullTemplate(settings,settings.updatechannel,msg,"./template.png","./toggled.csv");
}
function untoggleTemplate(msg,settings,sub){
  fs.writeFileSync("./toggled.csv",fs.readFileSync("./toggled.csv").toString().replace(sub+"\n",""));
  updatefullTemplate(settings,settings.updatechannel,msg,"./template.png","./toggled.csv");
}
function togglebot(msg,settings,sub){
  fs.writeFileSync("./toggledbot.csv",fs.readFileSync("./toggledbot.csv").toString()+sub+"\n");
  updatefullTemplate(settings,settings.updatechannelbot,msg,"./templatebot.png","./toggledbot.csv",true);
}
function untogglebot(msg,settings,sub){
  fs.writeFileSync("./toggledbot.csv",fs.readFileSync("./toggledbot.csv").toString().replace(sub+"\n",""));
  updatefullTemplate(settings,settings.updatechannelbot,msg,"./templatebot.png","./toggledbot.csv",true);
}
async function updateTemplate(msg,settings,sub){
    fs.writeFileSync("./templatesraw/"+sub+".png",fs.readFileSync("./templatestobe/"+sub+".png"));
    colorcorrect(sub);
    await delay(500);
    updatefullTemplate(settings,settings.updatechannel,msg,"./template.png","./toggled.csv")
    await delay(500);
    updatefullTemplate(settings,settings.updatechannelbot,msg,"./templatebot.png","./toggledbot.csv",true)
  return;
}