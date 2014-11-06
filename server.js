var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var async = require("async");


app.get('/scrape', function(req, res) {

  url = 'http://www.self-help-and-self-development.com/affirmations.html';

  var json = {
    categories : [],
    affirmations : {}
  }

  request(url, function(error, response, html) {

    if (!error) {

      var $ = cheerio.load(html)

      $('.columns_block li').filter(function() {

        var data = $(this);
        
        data.each(function(key, value) {

          var category = $(data[key]).find('b').text()
          json.categories.push(category);
          console.log(category);

        });

      });

    } else {
      console.log(error);
    }

  });
  
  // for (var i = 0; i < json.categories.length; i++) {

    // $('li *:contains("' + json.categories[i] + '")')[0].click();
    // console.log($('#ContentColumn'));
    // console.log(json.categories[i]);

  // }

  // This is running FIRST... will need to use ASYNC to handle, HOLLA!
  fs.writeFile('seeds.json', JSON.stringify(json, null, 4), function(err) {
    console.log('File successfully written.')
  });

  res.send('Scraping Complete.');

});



app.listen('8081')
console.log('Magic happens on port 8081');

exports = module.exports = app;
