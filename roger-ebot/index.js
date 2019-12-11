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

  var args = getArgs(messageContent);

  if (args === 'help') {
    var megathreads = getAllSpoilerMegathreads(client);
    var reply = megathreads !== '' ? 'Available megathreads:' + megathreads : 'There are no available megathreads :thumbsdown:';
    msg.reply(reply);
    return;
  }

  var channel = args.startsWith('<#') && args.endsWith('>') ? getChannelById(client, args) : getChannelByName(client, args);

  if (channel) {
    addUserToChannel(channel, msg.member.user.id)
      .then(msg.reply('You have been added to ' + channel + ' :thumbsup:'))
      .catch(err => {
        console.error(err);
        msg.reply('Sorry, there was an error adding you to the channel :thumbsdown:');
      });
  } else {
    msg.reply('That channel does not exist :thumbsdown:');
  }
});

client.on('error', console.error);

client.login(auth.token);

function getArgs (messageContent) {
  return messageContent.slice(prefix.length).trim();
}

function getSpoilerMegathreadsCategory (client) {
  return client.channels.find(channel => channel.name === 'Spoiler megathreads' && channel.type === 'category');
}

function getChannelByName (client, args) {
  return client.channels.find(channel => channel.name === args);
}

function getChannelById (client, args) {
  var extractedId = extractId(args);
  return client.channels.get(extractedId);
}

function extractId (args) {
  return args.substring(2, args.length - 1);
}

function addUserToChannel (channel, userId) {
  return channel.overwritePermissions(userId, { VIEW_CHANNEL: true });
}

function getAllSpoilerMegathreads (client) {
  var spoilerMegathreadsCategory = getSpoilerMegathreadsCategory(client);

  if (spoilerMegathreadsCategory) {
    var threadList = '';

    spoilerMegathreadsCategory.children.forEach(child => {
      if (child.name !== 'list') {
        threadList += '\n' + child;
      }
    });
  }

  return threadList;
}
