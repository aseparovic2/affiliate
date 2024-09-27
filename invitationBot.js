const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const { Api } = require('telegram');
const fs = require('fs');
// const delay = require('delay'); // For adding a delay between invites

// Telegram API credentials and bot token
const botToken = '7556025832:AAGBv0d4suRlVrkFfEzQiZpglSEWDmlDaaM'; // Replace with your bot token
const apiId = 21494693; // Replace with your API ID
const apiHash = 'cf0043a85c2da80cd38f9f4fcd97a6f0'; // Replace with your API Hash
const groupId = '-1002393999691'; // Replace with your group/channel ID
const stringSession = new StringSession(''); // Empty session for bot

// Path to the file containing usernames
const usernamesFile = 'balkan_casino_users.txt';

// Set up the Telegram bot client
async function setupBot() {
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({ botAuthToken: botToken });
  console.log('Bot started successfully!');

  // Read usernames from file
  const usernames = fs
    .readFileSync(usernamesFile, 'utf-8')
    .split('\n')
    .filter(Boolean);

  for (let i = 0; i < usernames.length; i++) {
    const username = usernames[i].trim();

    // Invite user to the group
    try {
      console.log(`Inviting ${username} to the group...`);

      // Get the user entity first
      const user = await client.getEntity(username);

      // Then invite the user to the group using Api.channels.InviteToChannel request
      await client.invoke(
        new Api.channels.InviteToChannel({
          channel: await client.getEntity(groupId),
          users: [user],
        })
      );

      console.log(`${username} invited successfully!`);

      // Delay between invites to avoid rate limits (e.g., 30 seconds)
      // await delay(30000);
    } catch (error) {
      console.error(`Error inviting ${username}:`, error);
    }
  }

  await client.disconnect();
  console.log('Bot finished inviting users!');
}

// Start the bot and begin inviting users
setupBot();
