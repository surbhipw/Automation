const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth() // Saves your login session
});

// Generate QR code in terminal for first-time login
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp Notifier is ready!');
});

client.initialize();

const sendNotification = async (message) => {
    const myNumber = "917028260011@c.us"; // Your number with country code
    try {
        await client.sendMessage(myNumber, message);
    } catch (err) {
        console.error("Failed to send WhatsApp:", err);
    }
};

module.exports = { sendNotification };