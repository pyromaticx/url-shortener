"use strict"
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const urlRe = /https?:\/\/([w]{0,3}\.?[\w]+\.[\w]+\.?[\w]*).*/;

let urlDirectory = {};
let counter = 0;

app.use(express.static('public'));

app.get('/:query', (req, res) => {
  let query = req.params.query;
  if (urlDirectory[query]) {
    res.redirect(urlDirectory[query].original_url)
  } else {
      res.sendFile(__dirname + '/public/index.html');
    }
});

app.get('/api/:reqUrl', (req, res) => {
  console.log()
  let reqUrl = req.params.reqUrl
  let validUrl = urlRe.exec(reqUrl);
  if (validUrl) {
    console.log(validUrl);
    counter++;
    let hash = counter.toString(32);
    if (!urlDirectory[hash])
    urlDirectory[hash] = {
      original_url: validUrl[0],
      domain: validUrl[1],
      short_url: req.hostname + '/' + hash
    };
    res.send(JSON.stringify(urlDirectory[hash]));
  } else {
    console.log('invalid');
  }
});

app.listen(port);
