var request = require('request');
var cheerio = require('cheerio');

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
          data[index] = {};
          Object.keys(params.get).forEach( key => {
            var selector = params.get[key];
            data[index][key] = [];
            $(element).find(selector).each((i,element) => {
              var e = $(element);
              if(e.is("a")){
                var text = e.text().trim();
                var href = e.attr('href');
                data[index][key].push({anchorText:text,href:href});
              }else{
                data[index][key].push($(element).text().trim());
              }
            });
          });
        });
        resolve(data);
      }
    });
  });
}

module.exports = scraper;