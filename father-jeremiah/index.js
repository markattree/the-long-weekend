const Discord = require('discord.js').Client;
const Tail = require('tail').Tail;
require('dotenv').config();
const auth = require('./auth.json');
const util = require('./util');

const filename = process.env.FILENAME || '/mnt/minecraft/logs/latest.log';
const channelID = process.env.CHANNEL_ID || '703376261271126037';

console.log(`Filename: ${filename}`);
console.log(`Channel ID: ${channelID}`);

const client = new Discord();
const logs = new Tail(filename, {
  useWatchFile: true,
});

logs.on('line', (logMessage) => {
  let deathInfo = util.getDeathInfo(logMessage);

  if (containsDeath(deathInfo)) {
    let channel = client.channels.cache.get(channelID);
    console.log(`Death logged: ${logMessage}`);
    channel.send(`We are gathered here today to celebrate the life of ${deathInfo.playerName}, who unfortunately ${deathInfo.causeOfDeath} today at ${deathInfo.timestamp}`);
  } else {
    console.log(`Not a death: ${logMessage}`);
  }
});

logs.on('error', (error) => {
  console.error(error);
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('error', (error) => {
  console.error(error);
});

function containsDeath(deathInfo) {
  return Object.keys(deathInfo).length > 0;
}

client.login(auth.token);