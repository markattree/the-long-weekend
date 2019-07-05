const Discord = require('discord.js');
const auth = require('./auth.json');

const prefix = '!roger';

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  var messageContent = msg.content.toLowerCase();

  if (!messageContent.startsWith(prefix) || msg.author.bot) return;

  var args = messageContent.slice(prefix.length + 1).split(/ +/).shift();
  var channel = client.channels.find('name', args);

  if (channel != null) {
    msg.channel.send('That channel exists');
    channel.overwritePermissions(msg.member.user.id, { VIEW_CHANNEL: true });
  } else {
    msg.channel.send('That channel does not exist');
  }
});

client.on('error', console.error);

client.login(auth.token);
