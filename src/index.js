require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const connectDB = require('./config/db');
const Job = require('./models/Job');
const { sendNotification } = require('./services/notifier');

const scrapeAndNotify = async () => {
    try {
        // 1. Connect to Database
        await connectDB();
        
        const apiKey = process.env.SCRAPER_API_KEY;
        // Clean up the roles string to remove extra spaces
        const roles = process.env.SEARCH_ROLES ? process.env.SEARCH_ROLES.split(',').map(r => r.trim()) : ['MERN Stack Developer'];
        const location = process.env.LOCATION || 'Remote';

        for (const role of roles) {
            console.log(`🔍 Searching for: ${role}`);
            
            // 2. Build the URL correctly
            const targetUrl = `https://www.indeed.com/jobs?q=${encodeURIComponent(role)}&l=${encodeURIComponent(location)}`;
            
            // 3. Use Premium + Render for Indeed bypass
            const scraperUrl = `http://api.scraperapi.com?api_key=${apiKey}&url=${encodeURIComponent(targetUrl)}&render=true&premium=true`;

            console.log(`📡 Fetching from ScraperAPI...`);
            const response = await axios.get(scraperUrl);
            const $ = cheerio.load(response.data);
            
            // 4. More reliable selector for Indeed job cards
            const jobElements = $('.job_seen_beacon').toArray();
            console.log(`📊 Found ${jobElements.length} potential job cards.`);

            for (const el of jobElements) {
                const title = $(el).find('h2 span[id^="jobTitle"]').text().trim() || $(el).find('h2').text().trim();
                const rawLink = $(el).find('h2 a').attr('href');
                
                if (!rawLink) continue; // Skip if no link found

                const link = rawLink.startsWith('http') ? rawLink : `https://www.indeed.com${rawLink}`;
                const company = $(el).find('[data-testid="company-name"]').text().trim();

                // 5. Check MongoDB to avoid duplicate Telegram alerts
                const exists = await Job.findOne({ link });

                if (!exists) {
                    await Job.create({ title, company, link, platform: 'Indeed' });
                    
                    const message = `🚀 *New Job Found!*\n\n*Role:* ${title}\n*Company:* ${company}\n\n[Apply Here](${link})`;
                    await sendNotification(message);
                    console.log(`✅ Notified: ${title}`);
                }
            }
        }
    } catch (error) {
        // More detailed error logging
        if (error.response) {
            console.error(`❌ ScraperAPI Error (${error.response.status}):`, error.response.data);
        } else {
            console.error("❌ Automation Error:", error.message);
        }
    } finally {
        process.exit(); 
    }
};

scrapeAndNotify();
