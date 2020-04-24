const Discord = require('discord.js').Client;
const auth = require('./auth.json');
const Tail = require('tail').Tail;

const client = new Discord();
const logs = new Tail('/mnt/minecraft/logs/latest.log', {
  useWatchFile: true,
});

logs.on('line', (data) => {
  let regex = /\[\d{2}:\d{2}:\d{2}\] \[Server thread\/.*?\]: (.*?) fell from a high place/;
  let message = data.match(regex);
  if (message !== null) {
    console.log('Death logged: ' + message[1]);
    let channel = client.channels.cache.get('703376261271126037');
    channel.send('We are here to celebrate the life of ' + message[1] + ' who unfortunately fell from a high place');
  } else {
    console.log('Not a death: ' + data);
  }
});

logs.on('error', () => {
  console.error(error);
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login(auth.token);