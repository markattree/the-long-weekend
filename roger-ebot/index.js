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

  if (args === 'help') {
    var category = client.channels.find(channel => channel.name === 'Spoiler megathreads' && channel.type === 'category');

    if (category) {
      var reply = 'Available channels: \n';
      category.children.forEach(child => {
        if (child.name !== 'list') {
          reply += child + '\n';
        }
      });

      msg.reply(reply);
    }
    return;
  }

  if (args.startsWith('#')) {
    args = args.substring(1);
  }
  
  var channel = client.channels.find(channel => channel.name === args);

  console.log(channel);

  if (channel != null) {
    msg.reply('Adding you to ' + channel);
    channel.overwritePermissions(msg.member.user.id, { VIEW_CHANNEL: true });
  } else {
    msg.channel.send('That channel does not exist');
  }
});

client.on('error', console.error);

client.login(auth.token);
