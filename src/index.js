require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const connectDB = require('./config/db');
const Job = require('./models/Job');
const { sendNotification } = require('./services/notifier');

const scrapeAndNotify = async () => {
    try {
        await connectDB();
        
        const apiKey = process.env.SCRAPER_API_KEY;
        const roles = process.env.SEARCH_ROLES ? process.env.SEARCH_ROLES.split(',') : ['MERN Stack Developer'];
        
        for (const role of roles) {
            console.log(`Searching for: ${role.trim()}`);
            const targetUrl = `https://www.indeed.com/jobs?q=${encodeURIComponent(role.trim())}&l=Remote`;
            const scraperUrl = `http://api.scraperapi.com?api_key=${apiKey}&url=${encodeURIComponent(targetUrl)}&render=true`;

            const response = await axios.get(scraperUrl);
            const $ = cheerio.load(response.data);
            const jobElements = $('.job_seen_beacon').toArray();

            for (const el of jobElements) {
                const title = $(el).find('h2').text().trim();
                const rawLink = $(el).find('a').attr('href');
                const link = rawLink.startsWith('http') ? rawLink : `https://www.indeed.com${rawLink}`;
                const company = $(el).find('[data-testid="company-name"]').text().trim();

                // Check MongoDB to avoid duplicate Telegram alerts
                const exists = await Job.findOne({ link });

                if (!exists) {
                    await Job.create({ title, company, link, platform: 'Indeed' });
                    
                    const message = `🚀 *New Job Found!*\n\n*Role:* ${title}\n*Company:* ${company}\n\n[View Job](${link})`;
                    await sendNotification(message);
                    console.log(`Notified: ${title}`);
                }
            }
        }
    } catch (error) {
        console.error("Error in automation cycle:", error.message);
    } finally {
        process.exit(); // Critical for GitHub Actions to finish the task
    }
};

scrapeAndNotify();