const axios = require('axios');
const cheerio = require('cheerio');

const scrapeIndeed = async (role, location) => {
    const apiKey = process.env.SCRAPER_API_KEY;
    const targetUrl = `https://www.indeed.com/jobs?q=${encodeURIComponent(role)}&l=${encodeURIComponent(location)}`;
    const scraperUrl = `http://api.scraperapi.com?api_key=${apiKey}&url=${encodeURIComponent(targetUrl)}&render=true`;

    try {
        const response = await axios.get(scraperUrl);
        const $ = cheerio.load(response.data);
        const results = [];

        $('.job_seen_beacon').each((i, el) => {
            const title = $(el).find('h2').text().trim();
            const company = $(el).find('[data-testid="company-name"]').text().trim();
            const link = "https://www.indeed.com" + $(el).find('a').attr('href');
            
            // For cloud efficiency, we check keywords in the snippet provided on the search page
            const snippet = $(el).find('.job-snippet').text().toLowerCase();
            const keywords = process.env.KEYWORDS.split(',');
            const hasMatch = keywords.some(word => snippet.includes(word.trim().toLowerCase()));

            if (hasMatch) {
                results.push({ title, company, link });
            }
        });

        return results;
    } catch (error) {
        console.error("Scraping error:", error.message);
        return [];
    }
};

module.exports = { scrapeIndeed };