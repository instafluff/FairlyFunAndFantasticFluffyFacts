require("dotenv").config();
const fetch = require("node-fetch");

const Discord = require('discord.js');
const client = new Discord.Client();

const cron = require("node-cron");
cron.schedule("* * 23 * *", async function() {
  console.log("---------------------");
  console.log("Retrieving Cat Fact");
  let catFact = await getCatFact();
  const discordChannel = discord.channels.find(ch => ch.name.endsWith("fun-facts") );
  if( !discordChannel ) return;
  const attachment = new Discord.Attachment( catFact.photo, "cat.jpg" );
  discordChannel.send( "**Today's Cat Fact:** " + catFact.fact, attachment );
  // discordChannel.send( "**Cat Fact:** " + catFact.fact, {files: [ catFact.photo ] } );
});

function getCatFact() {
  return new Promise( async (res, rej) => {
    try {
      let fact = await fetch( "https://cat-fact.herokuapp.com/facts/random" ).then( res => res.json() );
      console.log( fact );
      // let photo = await fetch( "https://aws.random.cat/meow" ).then( res => res.json() );
      // console.log( photo );
      // res( { fact: fact.text, photo: photo.file } );
      res( { fact: fact.text, photo: "https://cataas.com/cat/cute" } );
    }
    catch( ex ) {
      rej( ex );
    }
  });
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
  try {
    if( msg.content === "!catfact" ) {
      let catFact = await getCatFact();
      console.log( catFact );
      const attachment = new Discord.Attachment( catFact.photo, "cat.jpg" );
      msg.channel.send( "**Cat Fact:** " + catFact.fact, attachment );
      // msg.channel.send("**Cat Fact:** " + catFact.fact, {files: [ catFact.photo ] });
    }
  }
  catch( ex ) {
    console.log( ex );
  }
});

client.login( process.env.DISCORD_TOKEN );
