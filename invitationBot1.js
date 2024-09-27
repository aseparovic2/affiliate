const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const fs = require('fs');
// const delay = require('delay');

// Telegram API credentials and bot token
const botToken = '7556025832:AAGBv0d4suRlVrkFfEzQiZpglSEWDmlDaaM'; // Replace with your bot token
const apiId = 21494693; // Replace with your API ID
const apiHash = 'cf0043a85c2da80cd38f9f4fcd97a6f0'; // Replace with your API Hash
const stringSession = new StringSession(''); // Empty string session for bot

// Path to the file containing usernames
const usernamesFile = 'balkan_casino_users.txt';

// Replace with your channel link
const channelLink = 'https://t.me/kingsbetcroatia'; // Replace with your actual channel link

// Personalized message template
const invitationMessage = (username) => `
Hi ${username}! 🎲

We invite you to join our exclusive gambling community! 🔥

Get daily tips, bonuses, and insider tricks to boost your chances at the casino! 💰

Join us here: ${channelLink}

Looking forward to seeing you in the group! 🎰
`;

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

    // Send a personalized message with the invitation link
    try {
      console.log(`Sending invite to ${username}...`);

      // Get the user entity first
      const user = await client.getEntity(username);

      // Send the personalized message
      await client.sendMessage(user, {
        message: invitationMessage(username),
      });

      console.log(`Invitation sent to ${username} successfully!`);

      // Delay between messages to avoid rate limits (e.g., 30 seconds)
      // await delay(30000);
    } catch (error) {
      console.error(
        `Error sending invitation to ${username}:`,
        error
      );
    }
  }

  await client.disconnect();
  console.log('Bot finished sending invitations!');
}

// Start the bot and begin sending messages
setupBot();
