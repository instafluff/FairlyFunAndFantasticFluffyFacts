require("dotenv").config();
const fetch = require("node-fetch");
var fs = require('fs');
var batfacts = fs.readFileSync('batfact.txt').toString().replace(/\r/g,"").split("\n");
var batimages = undefined;
var wolffacts = fs.readFileSync('wolffact.txt').toString().replace(/\r/g,"").split("\n");
var wolfimages = undefined;
var monsfacts = fs.readFileSync('monsfact.txt').toString().replace(/\r/g,"").split("\n");
var monsimages = undefined;

function getRandomInt( number ) {
  return Math.floor( number * Math.random() );
}

const ComfyWeb = require( "webwebweb" );
ComfyWeb.APIs[ "/catfact" ] = async ( qs ) => {
  return await getCatFact();
};
ComfyWeb.APIs[ "/pokefact" ] = async ( qs ) => {
  return await getPokemonFact();
};
ComfyWeb.APIs[ "/batfact" ] = async ( qs ) => {
  if( !batimages ) {
    let images = await fetch( "https://unsplash.com/napi/search/photos?query=bat&per_page=50" ).then( res => res.json() );
    batimages = images.results.map( x => x.urls.regular );
    // console.log( batimages );
  }
  return {
    fact: batfacts[ getRandomInt( batfacts.length ) ],
    photo: batimages[ getRandomInt( batimages.length ) ]
  };
};
ComfyWeb.APIs[ "/wolffact" ] = async ( qs ) => {
  if( !wolfimages ) {
    let images = await fetch( "https://unsplash.com/napi/search/photos?query=wolf&per_page=50" ).then( res => res.json() );
    wolfimages = images.results.map( x => x.urls.regular );
  }
  return {
    fact: wolffacts[ getRandomInt( wolffacts.length ) ],
    photo: wolfimages[ getRandomInt( wolfimages.length ) ]
  };
};
ComfyWeb.APIs[ "/monsfact" ] = async ( qs ) => {
  if( !monsimages ) {
    let images = await fetch( "https://unsplash.com/napi/search/photos?query=mars&per_page=50" ).then( res => res.json() );
    monsimages = images.results.map( x => x.urls.regular );
  }
  return {
    fact: monsfacts[ getRandomInt( monsfacts.length ) ],
    photo: monsimages[ getRandomInt( monsimages.length ) ]
  };
};
ComfyWeb.Run( 8999 );

const Discord = require('discord.js');
const client = new Discord.Client();

const ComfyClock = require("comfyclock");
ComfyClock.Every[ "1d" ] = async function( date ) {
  console.log("---------------------");
  console.log("Retrieving Cat Fact");
  let catFact = await getCatFact();
  const discordChannel = client.channels.find(ch => ch.name.endsWith("general") );
  if( !discordChannel ) return;
  const attachment = new Discord.Attachment( catFact.photo, "cat.jpg" );
  discordChannel.send( "**Today's Cat Fact:** " + catFact.fact, attachment );
  // discordChannel.send( "**Cat Fact:** " + catFact.fact, {files: [ catFact.photo ] } );
};

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

function getPokemonFact() {
  return new Promise( async (res, rej) => {
    try {
      var pokeId = getRandomInt( 807 ) + 1;
      let fact = await fetch( "https://pokeapi.co/api/v2/pokemon-species/" + pokeId ).then( res => res.json() );
      // console.log( fact );
      let entry = fact.flavor_text_entries.find( x => x.language.name === "en" );
      res( { name: fact.name, fact: entry.flavor_text.replace( /\n/g, " " ), photo: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + pokeId + ".png" } );
    }
    catch( ex ) {
      rej( ex );
    }
  });
}

function getFact( type ) {
  return new Promise( async (res, rej) => {
    try {
      let fact = await fetch( "http://localhost:8999/" + type ).then( res => res.json() );
      res( fact );
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
    if( msg.content === "!pokefact" ) {
      let pokeFact = await getPokemonFact();
      console.log( pokeFact );
      const attachment = new Discord.Attachment( pokeFact.photo, "pokemon.jpg" );
      msg.channel.send( "**Pokémon Fact:** " + pokeFact.name + " - " + pokeFact.fact, attachment );
    }
    if( msg.content === "!batfact" ) {
      let fact = await getFact( "batfact" );
      console.log( fact );
      const attachment = new Discord.Attachment( fact.photo, "fact.jpg" );
      msg.channel.send( "**Fun Fact:** " + fact.fact, attachment );
      // msg.channel.send("**Cat Fact:** " + catFact.fact, {files: [ catFact.photo ] });
    }
    if( msg.content === "!wolffact" ) {
      let fact = await getFact( "wolffact" );
      console.log( fact );
      const attachment = new Discord.Attachment( fact.photo, "fact.jpg" );
      msg.channel.send( "**Fun Fact:** " + fact.fact, attachment );
      // msg.channel.send("**Cat Fact:** " + catFact.fact, {files: [ catFact.photo ] });
    }
    if( msg.content === "!monsfact" ||
        msg.content === "!marsfact" ) {
      let fact = await getFact( "monsfact" );
      console.log( fact );
      const attachment = new Discord.Attachment( fact.photo, "fact.jpg" );
      msg.channel.send( "**Fun Fact:** " + fact.fact, attachment );
      // msg.channel.send("**Cat Fact:** " + catFact.fact, {files: [ catFact.photo ] });
    }
  }
  catch( ex ) {
    console.log( ex );
  }
});

client.on( "error", console.error );

client.login( process.env.DISCORD_TOKEN );
