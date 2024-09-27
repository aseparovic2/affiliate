const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const input = require('input'); // For getting user input (API ID, Hash, Phone)
const fs = require('fs');

// Replace these with your credentials
const apiId = 21494693; // Your API ID
const apiHash = 'cf0043a85c2da80cd38f9f4fcd97a6f0'; // Your API Hash
const stringSession = new StringSession(''); // Empty string for new session

(async () => {
  console.log('Loading interactive example...');

  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () =>
      await input.text('Please enter your phone number: '),
    password: async () =>
      await input.text('Please enter your password: '),
    phoneCode: async () =>
      await input.text('Please enter the code you received: '),
    onError: (err) => console.log(err),
  });

  console.log('You are now logged in!');
  console.log('Session string:', client.session.save()); // Save this string for future logins without the code.

  const groupLink = 'remotejobss'; // Replace with your target group link or username

  try {
    // Get the group entity by link
    const group = await client.getEntity(groupLink);

    // Fetch all participants from the group
    const participants = await client.getParticipants(group);

    // Extract and store usernames
    const users = participants
      //   .filter((participant) => participant.username) // Only take participants with public usernames
      .map((participant) => participant.username);

    // Write the usernames to a file
    fs.writeFileSync('balkan_casino_users.txt', users.join('\n'));
    console.log(`Scraped ${users.length} users from ${groupLink}`);
  } catch (error) {
    console.error('Error scraping users:', error);
  }

  await client.disconnect();
})();
