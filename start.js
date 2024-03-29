const templateHandler = require("./handlers/templatehandler.js");
const Discord = require("discord.js");
const settingsHandler= require("./handlers/settingshandler.js");
const subHandler= require("./handlers/subhandler.js");
const fs = require("fs");
var settings,subs;

const TOKEN = ""; //tokenhere


const Intents = new Discord.IntentsBitField();
for(e in Discord.IntentsBitField.Flags){
 Intents.add(e);
}

const bot = new Discord.Client({intents: Intents});
async function main() {
  settings=await settingsHandler.loadsettings("./settings.json");
  subs= await subHandler.readsubs("./subs.json");
  bot.login(TOKEN);
}
main();

bot.on('ready', c => {
    console.log(`Logged in as ${c.user.tag}!`);
      bot.user.setActivity("Put your templates in the designated channel");
      
  });
  
bot.on('messageCreate', msg =>{
  if(msg.author.bot) return;

var command=msg.content.split(" ");
  //Border to Admin commands
  if(settings.AdminIDs.includes(msg.author.id)){
    switch(command[0]){
      
    case settings.prefix+"setprefix":
      settings.prefix=command[1];
      settingsHandler.writesettings(settings,"./settings.json");
      msg.channel.send("Prefix set to: "+settings.prefix);
      break;

    //changes canvas size, on the next generating of the main template this will be applied
    case settings.prefix+"setcanvas":
      settings.canvasSize_x=command[1];
      settings.canvasSize_y=command[2];
      settingsHandler.writesettings(settings,"./settings.json");
      msg.reply("Canvas size set to: "+settings.canvasSize_x+"x"+settings.canvasSize_y);
      break;
      case settings.prefix+"addadmin":
        mention = msg.mentions.users.first().id;
        if(settings.AdminIDs.includes(mention)){
          msg.channel.send("Admin already exists");
        }
        else{
          settings.AdminIDs.push(mention);
          settingsHandler.writesettings(settings,"./settings.json");
          msg.channel.send("Admin added")
        }
        break;
    //addmanager command, adds a discordID to the settings.ManIDs array
    case settings.prefix+"addmanager":
      mention = msg.mentions.users.first().id;
    if (settings.ManIDs.includes(mention)){
      msg.channel.send("Manager already exists");
    }
    else{
      settingsHandler.addmanager(settings,mention);
      settingsHandler.writesettings(settings,"./settings.json");
      msg.channel.send("Manager added: " +msg.mentions.users.first().username);
    }
    case settings.prefix+"bye":
      msg.channel.send("**I'll be back**")
    break;
    //remmanager command, removes a discordID from the settings.ManIDs array
    case settings.prefix+"remmanager":
      mention = msg.mentions.users.first().id;
      if (settings.ManIDs.includes(mention)){
        settingsHandler.remmanager(settings,mention);
        settingsHandler.writesettings(settings,"./settings.json");
      }
    }
  }

      //border to manager commands
      if(settings.ManIDs.includes(msg.author.id) || settings.AdminIDs.includes(msg.author.id)){
      switch(command[0]){
        case settings.prefix+"gist":
          if(typeof command[1] !== 'undefined' && typeof command[2] !== 'undefined'){
          x=command[1];
          y=command[2];
          templateHandler.gisty(msg,settings,x,y).then(()=>{msg.reply("Gist updated!")})
          }
          else{
            msg.reply("Please provide x and y coordinates")
          }
        break;
        case settings.prefix+"OverlayOff":
          if(command[1] in subs.subs){
            msg.channel.send("Disabling "+command[1]+" for user Overlay")
            templateHandler.toggleTemplate(msg,settings,command[1]);
          }
        else{
          msg.channel.send("Subreddit not found, please add it first");
        }
        break;
        case settings.prefix+"OverlayOn":
          if(command[1] in subs.subs){
            msg.channel.send("Enabling "+command[1]+" for user Overlay")
            templateHandler.untoggleTemplate(msg,settings,command[1]);
          }
        else{
          msg.channel.send("Subreddit not found, please add it first");
        }
          break;

          case settings.prefix+"BotOff":
            if(command[1] in subs.subs){
              msg.channel.send("Disabling "+command[1]+" for bot Overlay")
              templateHandler.togglebot(msg,settings,command[1]);
            }
          else{
            msg.channel.send("Subreddit not found, please add it first");
          }
          break;
          case settings.prefix+"BotOn":
            if(command[1] in subs.subs){
              msg.channel.send("Enabling "+command[1]+" for bot Overlay")
              templateHandler.untogglebot(msg,settings,command[1]);
            }
          else{
            msg.channel.send("Subreddit not found, please add it first");
          }
            break;
        //addrep command, adds a discordID of an representative to the sub.reps array
      case settings.prefix+"AddRep":
        if(typeof msg.mentions.users.first() !== 'undefined'){
          console.log(typeof msg.mentions.users)
        mention = msg.mentions.users.first().id;
        }
        else{
          msg.reply("please provide a user per @mention")
        }
        if (command[1] in subs.subs){
          if (!subs.subs[command[1]].reps.includes(mention)){
          newrep = msg.mentions.users.first();
          subHandler.addrep(subs,command[1],mention);
          subHandler.writesubs(subs,"./subs.json");
          msg.channel.send("Rep added: "+msg.mentions.users.first().username);
      }
      else{
        msg.channel.send("Rep already exists");

      }
      	}
      else{
        msg.channel.send("Subreddit not found, please add a template first");
      }
      break;

      case settings.prefix+"RemRep":
        mention = msg.mentions.users.first().id;
        if (command[1] in subs.subs){
          if (subs.subs[command[1]].reps.includes(mention)){
          subHandler.remrep(subs,command[1],mention);
          subHandler.writesubs(subs,"./subs.json");
          msg.channel.send("Rep removed: "+msg.mentions.users.first().username);
          }
          else{
            msg.channel.send("Rep not found");
          }
        }
        else{
          msg.channel.send("Subreddit not found, please add a template first");
        }
      break;  

      case settings.prefix+"updateTemplate":
      if(command[1] in subs.subs){
        msg.channel.send("checking template \n please wait...")
        file = msg.attachments.first();
        if (!file) {
          msg.reply("**ERROR!** No Template File given")
          return;
        
        }
        if (file.width != settings.canvasSize_x || file.height != settings.canvasSize_y){
          msg.reply("**ERROR!** Template size does not equal the current size of the r/place canvas!")
          return false;
        }
        templateHandler.testTemplate(msg,settings,command[1]).then(result => {
          isvalid = result;
        if(isvalid=="false"){
          msg.reply("This template will overwrite the current templates **SIZE** or **NUMBER OF ALOCATED PIXELS**, please confirm with yes");
          let filter = message => message.author.id === msg.author.id
          msg.channel.awaitMessages({
            filter,
            max: 1,
            time: 600000,
            errors: ['time']
          }).then(collected=>{
            msgreply=collected.first()
            if(msgreply.content.split()[0]=="yes"){
              msg.reply("Updating...")
              templateHandler.updateTemplate(msg,settings,command[1]).then(() =>msg.reply("Template force-updated!"));
              return;
            }
            else{
              msg.reply("Template not updated");
              return;
            }
          }).catch((error)=>{
            msg.channel.send("No response, update aborted")
          console.log(error)
          }
          );
        }
        else{
        templateHandler.updateTemplate(msg,settings,command[1]).then(msg.reply("Template updated!"));
      }
      });
      }
      else{
        msg.reply("Subreddit not found, please add a template first");
      }
    break;
      
  //addsub command, adds a template slot and afterwards adds the sub with template
  //since this is a admin command this will force the template to be added
    case settings.prefix+"AddSub":
      if (command[1] in subs.subs){
        msg.reply("Subreddit already exists");
      }
      else{
        templateHandler.addslot(msg,settings).then(result => {
          if(result){
        subHandler.addsub(subs,command[1],command[2]);
        subHandler.writesubs(subs,"./subs.json");
          }
          else{
            msg.reply("Subreddit not added");
          }
      }
      );
    }
      break;
    //removes a sub from the subs array
    case settings.prefix+"RemSub":
      if (command[1] in subs.subs){
        subHandler.remsub(subs,command[1]);
        subHandler.writesubs(subs,"./subs.json");
        msg.reply("Subreddit removed");
      }
    }
  }
  //border to rep commands
  if(subs.allreps.includes(msg.author.id)){
    switch(command[0]){
      case settings.prefix+"updateTemplate":

        if(command[1] in subs.subs){
          if(subs.subs[command[1]].reps.includes(msg.author.id)){
          templateHandler.testTemplate(msg,settings,command[1]).then(result => {
         if(result=="false"){
            msg.reply("This template would overwrite the current templates **SIZE** or **NUMBER OF ALOCATED PIXELS**, please ask a manager to make this change")
         }
        else{
          templateHandler.updateTemplate(msg,settings,command[1]).then(msg.reply("Template updated!"));
        }
      });
      }
      else{
        msg.reply("You are not a representative of this subreddit");
      }
        }
        else{
          msg.reply("Subreddit not found, please ask a manager to register your subreddit first");
        }
      break;
      case settings.prefix+"OverlayOff":
        if(command[1] in subs.subs){
          if(subs.subs[command[1]].reps.includes(msg.author.id)){
          msg.reply("Disabling "+command[1]+" for user Overlay")
          templateHandler.toggleTemplate(msg,settings,command[1]);
        }
        else{
          msg.reply("You are not a representative of this subreddit");
        }
      }
      else{
        msg.reply("Subreddit not found, please ask a manager to register your subreddit first");
      }
      break;
      case settings.prefix+"OverlayOn":
        if(command[1] in subs.subs){
          if(subs.subs[command[1]].reps.includes(msg.author.id)){
          msg.reply("Enabling "+command[1]+" for user Overlay")
          templateHandler.untoggleTemplate(msg,settings,command[1]);
        }
        else{
          msg.reply("You are not a representative of this subreddit");
        }
      }
      else{
        msg.reply("Subreddit not found, please ask a manager to register your subreddit first");
      }
        break;
        case settings.prefix+"BotOff":
          if(command[1] in subs.subs){
            if(subs.subs[command[1]].reps.includes(msg.author.id)){
            msg.reply("Disabling "+command[1]+" for bot Overlay")
            templateHandler.togglebot(msg,settings,command[1]);
          }
          else{
            msg.reply("You are not a representative of this subreddit");
          }
        }
        else{
          msg.reply("Subreddit not found, please ask a manager to register your subreddit first");
        }
        break;
        case settings.prefix+"BotOn":
          if(command[1] in subs.subs){
            if(subs.subs[command[1]].reps.includes(msg.author.id)){
            msg.reply("Enabling "+command[1]+" for bot Overlay")
            templateHandler.untogglebot(msg,settings,command[1]);
          }
          else{
            msg.reply("You are not a representative of this subreddit");
          }
        }
        else{
          msg.reply("Subreddit not found, please ask a manager to register your subreddit first");
        }
          break;
    }
  }

  //general public comands
  switch(command[0]){
    case settings.prefix+"getToggled":
      toggled=fs.readFileSync("./toggled.csv").toString().replace("\n"," ")
      toggledbot=fs.readFileSync("./toggledbot.csv").toString().replace("\n"," ")
      msg.reply("Currently the following subreddits are being toggled for the overlay: "+toggled +"\n for the bot: "+toggledbot)
    break;
    case settings.prefix+"getSubs":
      var subis=""
      for(sub in subs.subs){
        subis +=sub+", "
        
      }
      msg.reply("Currently the following subreddits are being represented: \n" +subis)
      break;
    case settings.prefix+"getTemplate":
      if(command[1] in subs.subs){
        msg.reply("fetching template...")
        templateHandler.returnTemplate(msg,command[1]);
      }
      else{
        msg.reply("Subreddit not found, please add a template first");
      }
    break;
  }
});
