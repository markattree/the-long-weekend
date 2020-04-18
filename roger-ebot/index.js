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
    var movieMegathreads = getMovieSpoilerMegathreads(client);
    var tvMegathreads = getTVSpoilerMegathreads(client);
    var reply = movieMegathreads !== '' ? 'here are the available film megathreads:' + movieMegathreads + '\n' : 'There are no available film megathreads :thumbsdown:\n';
    reply += tvMegathreads !== '' ? 'Here are the available TV megathreads: ' + tvMegathreads : 'There are no available TV megathreads :thumbsdown:';
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

function getMovieSpoilerMegathreadsCategory (client) {
  return client.channels.find(channel => channel.name === 'Spoiler megathreads (film)' && channel.type === 'category');
}

function getTVSpoilerMegathreadsCategory (client) {
  return client.channels.find(channel => channel.name === 'Spoiler megathreads (TV)' && channel.type === 'category');
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

function getMovieSpoilerMegathreads (client) {
  var category = getMovieSpoilerMegathreadsCategory(client);
  return getMegathreadsForCategory(client, category);
}

function getTVSpoilerMegathreads (client) {
  var category = getTVSpoilerMegathreadsCategory(client);
  return getMegathreadsForCategory(client, category);
}

function getMegathreadsForCategory (client, category) {
  if (category) {
    var threadList = '';

    category.children.forEach(child => {
      if (child.name !== 'list') {
        threadList += '\n' + child;
      }
    });
  }

  return threadList;
}
