const templateHandler = require("./handlers/templatehandler.js");
const Discord = require("discord.js");
const settingsHandler= require("./handlers/settingshandler.js");
const subHandler= require("./handlers/subhandler.js");
var settings,subs;

const TOKEN = ""; //tokenhere


const intentions = new Discord.Intents();
for(e in Discord.Intents.FLAGS){
 intentions.add(e);
}

const bot = new Discord.Client({intents: intentions});


bot.on('ready', c => {
    console.log(`Logged in as ${c.user.tag}!`);
      settings=settingsHandler.readsettings("./settings.json");
      subs=subHandler.readsubs("./subs.json");
      bot.user.setActivity("Put your templates in the designated channel");
  });
  
bot.on('messageCreate', msg =>{
var command=msg.content.split("");

  //Border to Admin commands
  if(msg.author.id in settings.AdminIDs){
    switch(command[0]){
      
    case settings.prefix+"setprefix":
      settings.prefix=command[1];
      settingsHandler.writesettings(settings,"./settings.json");
      break;
    //changes canvas size, on the next generating of the main template this will be applied
    case settings.prefix+"setcanvas":
      settings.canvasSize_x=x;
      settings.canvasSize_y=y;
      settingsHandler.writesettings(settings,"./settings.json");
      break;
      
    case settings.prefix+"updateTemplate":
      if(subs.includes(command[1])){
        if(templateHandler.testTemplate()==false){
          msg.channel.reply("This template will overwrite the current templates SIZE, please confirn with yes")
          bot.on('messageCreate', msg =>{
            if(msg.content=="yes"){
              templateHandler.updateTemplate(msg,settings);
            }
          });
        }
        }
      else{

      }
      break;
    case settings.prefix+"addadmin":
      if(settings.AdminIDs.includes(command[1])){
        msg.channel.send("Admin already exists");
      }
      else{
        settings.AdminIDs.push(command[1]);
        settingsHandler.writesettings(settings,"./settings.json");
      }
    //addrep command, adds a discordID of an representative to the sub.reps array
    case settings.prefix+"addrep":
      if (subs.includes(command[1])){
        subHandler.addrep(subs,command[1],command[2]);
        writesubs(subs,"./subs.json");
    }
    else{
      msg.channel.send("Subreddit not found, please add a template first");
    }
    break;
  //addsub command, adds a template slot and afterwards adds the sub with template
  //since this is a admin command this will force the template to be added
    case settings.prefix+"addsub":
      if (subs.includes(command[1])){
        msg.channel.send("Subreddit already exists");
      }
      else{
        templateHandler.addslot(msg,settings);
        subHandler.addsub(subs,command[1],command[2]);
        writesubs(subs,"./subs.json");
      }
      break;
    }
    
  }
  //border to user/rep commands
  else{
    switch(command[0]){

    }
  }
 
});