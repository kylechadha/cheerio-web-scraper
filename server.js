var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var async   = require("async");


app.get('/scrape', function(req, res) {

  var json = {
    categories : {},
    affirmations : {}
  }

  async.series([

    function(callback) {

      var url = 'http://www.self-help-and-self-development.com/affirmations.html';

      request(url, function(error, response, html) {

        if (!error) {

          var $ = cheerio.load(html)

          $('.columns_block li').filter(function() {
            var data = $(this);
            data.each(function(key, value) {
              var category = $(data[key]).find('b').text(),
                  categoryUrl = $(data[key]).find('a').attr('href')

              json.categories[category] = categoryUrl;
            });
          });

          callback(null, 'one');

        }
        else {
          console.log(error);
        }

      });

    },

    function(callback) {

      var categoriesArray = [];

      for (var key in json.categories) {
        if (json.categories.hasOwnProperty(key)) {
          categoriesArray.push(key);
          json.affirmations[key] = [];
        }
      }

      async.each(categoriesArray, function(category, callback) {

          var url = json.categories[category];

          request(url, function(error, response, html) {

            if (!error) {
              var $ = cheerio.load(html)
              var data = $('#ContentColumn').find('li:not(:has(a))');

              data.each(function(key, value) {
                json.affirmations[category].push($(data[key]).text());
              })

              callback(null);
            }
            else {
              callback(error);
            }

          })


      }, function() {
        callback(null, 'two')
      });

    }


  ], function() {
    
    fs.writeFile('seeds.json', JSON.stringify(json, null, 4), function(err) {
      console.log('File successfully written.')
    });

    res.send('Scraping Complete.');

  })

});


app.listen('8081')
console.log('Magic happens on port 8081');

exports = module.exports = app;
