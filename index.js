const PORT = 8000;

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

const articles = [];


app.get('/', (req, res) => {
    res.json('Welcome to my News API!');
});


app.get('/news', (req, res) => {

    axios.get("https://www.theguardian.com/environment/climate-crisis").then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);

        $('a:contains("climate")', html).each(function () {
            const title = $(this).text();
            const url = $(this).attr('href');
            articles.push({
                title,
                url
            });
        });
        res.json(articles);
    }).catch((error) => {
        console.log(error);
    });
});


app.listen(PORT, () => {
    console.log("Congrats! Server running on " + PORT);
});