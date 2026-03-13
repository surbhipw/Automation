const axios = require('axios');

/**
 * Sends a job alert to your Telegram instead of WhatsApp.
 * This works perfectly in the cloud (GitHub Actions) without QR codes.
 */
const sendNotification = async (message) => {
    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    if (!token || !chatId) {
        console.error("❌ Missing Telegram credentials in Environment Variables.");
        return;
    }

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    try {
        await axios.post(url, {
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown' // Allows bold text and links
        });
        console.log("✅ Telegram notification sent successfully!");
    } catch (err) {
        console.error("❌ Telegram Notification Failed:", err.response?.data || err.message);
    }
};

module.exports = { sendNotification };