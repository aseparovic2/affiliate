const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const schedule = require('node-schedule');

// Telegram API credentials and bot token
const botToken = '7556025832:AAGBv0d4suRlVrkFfEzQiZpglSEWDmlDaaM'; // Replace with your bot token
const chatId = '-1002393999691'; // Replace with your Telegram group/channel ID

const apiId = 21494693; // Replace with your API ID
const apiHash = 'cf0043a85c2da80cd38f9f4fcd97a6f0'; // Replace with your API Hash
const stringSession = new StringSession(''); // Empty session for bot

// Define daily content for the first two weeks
const dailyContent = [
  '🎰 Welcome to KingsBet! Join us for daily tips and exclusive bonuses!',
  '🔥 Tip of the Day: Always check wagering requirements before using bonuses!',
  '🎲 Did you know? Slot machines with higher RTP (Return to Player) are more favorable!',
  '💡 Strategy Tip: Blackjack players should always split aces and 8s!',
  '🔥 Exclusive Offer: Get 50 free spins at [CasinoLink]!',
  '💰 Reminder: Don’t forget to check out today’s exclusive bonus offers on KingsBet!',
  '🎯 Tip: Manage your bankroll! Always set a budget before you start playing!',
  '🎰 Free Spin Alert: Get 100 free spins today at [CasinoLink]!',
  '🎲 Roulette Tip: Stick to outside bets like Red/Black for better odds!',
  '🔥 Casino Secret: Always play games with low house edges like Blackjack and Poker!',
  '💡 Tip: Sign up for loyalty programs at your favorite online casinos to earn rewards!',
  '🎲 Exclusive Offer: Double your first deposit with [CasinoLink]!',
  '🎰 Free Tip: Always choose slot machines with bonus rounds for higher chances to win!',
  '🎯 Get the most out of your game! Keep track of all your wins and losses.',
];

// Function to post messages to the group
async function postMessage(client, content) {
  try {
    await client.sendMessage(chatId, { message: content });
    console.log(`Posted: ${content}`);
  } catch (error) {
    console.error('Error posting message:', error);
  }
}

// Set up the Telegram bot client
async function setupBot() {
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({ botAuthToken: botToken });
  console.log('Bot is now running and ready to post content!');

  // Post the first message immediately
  await postMessage(client, dailyContent[0]);

  // Schedule the remaining posts starting from the next day
  dailyContent.slice(1).forEach((content, index) => {
    const postDate = new Date();
    postDate.setDate(postDate.getDate() + (index + 1)); // Schedule each post for the next day

    schedule.scheduleJob(postDate, () => {
      postMessage(client, content);
    });
  });
}

// Start the bot and begin scheduling
setupBot();
