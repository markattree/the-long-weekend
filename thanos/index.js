const Discord = require('discord.js');
const auth = require('./auth.json');
const replies = require('./replies.json');

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content in replies) {
    msg.channel.send(replies[msg]);
  }
});

client.on('error', console.error);

client.login(auth.token);
