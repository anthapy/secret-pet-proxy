const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

async function fetchPets() {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto('https://secretpetapi.bubblegumsimulatorinfinity.com/?t=' + Date.now(), { waitUntil: 'networkidle2' });

    const pets = await page.evaluate(() => Object.values(window.data || {}));
    await browser.close();
    return pets;
}

app.get('/pets', async (req, res) => {
    try {
        const pets = await fetchPets();
        res.json(pets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch pets' });
    }
});

app.listen(PORT, () => console.log(`Pet proxy running on port ${PORT}`));
