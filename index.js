const request = require('request');
let cheerio = require('cheerio');
const advanced_cheerio = require('cheerio-advanced-selectors');
const _ = require('lodash');

cheerio = advanced_cheerio.wrap(cheerio);

var scraper = function(params){

  return new Promise((resolve,reject) => {
    if(params.url === undefined){
      reject('Undefined url param.');
    }else if(params.get === undefined){
      reject('Undefined get param.');
    }else if(Object.keys(params.get).length === 0){
      reject('Empty get param.');
    }

    request(params.url, function(error, response, html){

      if(error){
        reject('request error:', error);
      }else{

        var data = [];
        var $ = cheerio.load(html);

        if(undefined === params.forEach){
          params.forEach = 'html';
        }

        $(params.forEach).map((index,element) => {
          var tempObject = {};
          Object.keys(params.get).forEach( key => {
            var selector = params.get[key];
            var tempData = [];
            $(element).find(selector).each((i,element) => {
              var e = $(element);
              if(e.is("a")){
                var text = e.text().trim().replace(/[\t\n]+/g, '').replace(/  +/g, ' ');
                var href = e.attr('href');
                tempData.push({anchorText:text,href:href});
              }else{
                var text = e.text().trim().replace(/[\t\n]+/g, '').replace(/  +/g, ' ');
                if(text.length > 0){
                  tempData.push(text);
                }
              }
              if(1 === tempData.length){       
                tempObject[key] = tempData[0];
              }else if(2 >= tempData.length){
                tempObject[key] = tempData;
              }
            });
          });

          if(!_.isEmpty(tempObject)){
            data.push(tempObject);
          }

        });

        if(1 === data.length){
          data = data[0]               
        }

        resolve(data);
      }
    });
  });
}

module.exports = scraper;