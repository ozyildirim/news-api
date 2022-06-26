const PORT = process.env.PORT || 8000;

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();


const newspapers = [{
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    }, {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: ''

    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change',
        base: 'https://www.telegraph.co.uk'
    },


];

const articles = [];



newspapers.forEach(newspaper => {
    console.log("asked for np");
    axios.get(newspaper.address).then((response) => {

        const html = response.data;
        const $ = cheerio.load(html);

        $('a:contains("climate")', html).each(function () {
            const title = $(this).text();
            const url = $(this).attr('href');
            articles.push({
                title,
                url: newspaper.base + url,
                source: newspaper.name
            });
        });
    });
});



app.get('/', (req, res) => {
    res.json('Welcome to my News API!');
});

app.get('/news', (req, res) => {
    res.json(articles);
});


app.get('/news/:newspaperId', async (req, res) => {
    const newspaperId = req.params.newspaperId;
    const selectedNewspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address;
    const selectedNewspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base;

    axios.get(selectedNewspaperAddress).then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const filteredArticles = [];
        $('a:contains("climate")', html).each(function () {
            const title = $(this).text();
            const url = $(this).attr('href');
            filteredArticles.push({
                title,
                url: selectedNewspaperBase + url,
                source: newspaperId
            })
        });


        res.json(filteredArticles);
    }).catch((error) => {
        console.log(error);
    });
});


app.listen(PORT, () => {
    console.log("Congrats! Server running on " + PORT);
});