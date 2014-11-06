var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var async   = require("async");


app.get('/scrape', function(req, res) {

  // var asyncTasks = [];
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
              // console.log(category);
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

      // for (var key in json.categories) {
      //   if (json.categories.hasOwnProperty(key)) {

      //     var url = json.categories[key];
      //     // console.log(url);

      //     request(url, function(error, response, html) {

      //       if (!error) {

      //         var $ = cheerio.load(html)
      //         json.affirmations[key] = [];
      //         // console.log(json.affirmations);

      //         var data = $('#ContentColumn').find('li:not(:has(a)):has(span)');
      //         data.each(function(key, value) {
      //           // console.log($(data[key]).text());
      //           // json.affirmations[key].push($(data[key]).text());
      //         })

      //       }
      //       else {
      //         console.log(error);
      //       }

      //     })
          
      //   }
      // }

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
              // json.affirmations[key] = [];
              // console.log(json.affirmations);

              var data = $('#ContentColumn').find('li:not(:has(a)):has(span)');
              data.each(function(key, value) {
                // console.log($(data[key]).text());
                // json.affirmations[key].push($(data[key]).text());
              })

              callback(null);

            }
            else {
              callback(error);
            }

          })

      }, callback(null, 'two'));


      // async.each(json.categories, 

      // callback(null, 'two');

    }


  ], function() {
    
    fs.writeFile('seeds.json', JSON.stringify(json, null, 4), function(err) {
      console.log('File successfully written.')
    });

    res.send('Scraping Complete.');

  })


  // asyncTasks.push(createCategories);

  // async.parallel(asyncTasks, function() {
  // });
  
  // for (var i = 0; i < json.categories.length; i++) {

    // $('li *:contains("' + json.categories[i] + '")')[0].click();
    // console.log($('#ContentColumn'));
    // console.log(json.categories[i]);

  // }


});


app.listen('8081')
console.log('Magic happens on port 8081');

exports = module.exports = app;
