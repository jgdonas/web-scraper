var request = require('request');
var cheerio = require('cheerio');

var scrape = function(params){

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
        var root = params.node;

        if(undefined === root){
          root = 'body';
        }

        $(root).map((index,element) => {
          data[index] = {};
          Object.keys(params.get).forEach( key => {
            var selector = params.get[key];
            data[index][key] = [];
            $(element).find(selector).each((i,element) => {
              data[index][key].push($(element).text());
            });
          });
        });
        resolve(data);
      }
    });
  });
}

module.exports = scrape;
