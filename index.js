const request = require('request');
const cheerio = require('cheerio');
const _ = require('lodash');

var scraper = params => {
  
  return new Promise((resolve,reject) => {
    
    if (params.url === undefined) {
      reject('Undefined url param.');
    }
    else if (params.get === undefined) {
      reject('Undefined get param.');
    }
    else if (0 === Object.keys(params.get).length) {
      reject('Empty get param.');
    }
  
    if(undefined === params.forEach){
      params.forEach = 'html';
    }

    request(params.url, function(error, response, html){

      if(error){
        reject('request error:' + error);
      }else{

        var data = [];
        const $ = cheerio.load(html);

        if(!Array.isArray(params.forEach)){
          params.forEach = [params.forEach];
        }

        for(var eachParam of params.forEach){

          $(eachParam).map((index,element) => {

            var tempObject = {};
            Object.keys(params.get).forEach( key => {
              var selector = $(params.get[key]);
              var tempData = [];
  
              $(element).find(selector).each((i,element) => {
                var e = $(element);
                tempData.push(extractData(e));
                if (1 === tempData.length) {
                  tempObject[key] = tempData[0];
                }
                else if (2 >= tempData.length) {
                  tempObject[key] = tempData;
                }
              });
            });
  
            if(!_.isEmpty(tempObject)){
              data.push(tempObject);
            }
  
          });

        }

        if(1 === data.length){
          data = data[0]               
        }

        resolve(data);
      }
    });
  });
}


function extractData(element) {
  let data;
  let text = element.text().trim().replace(/[\t\n]+/g, '').replace(/  +/g, ' ');
  if (element.is("a")) {
    let href = element.attr('href');
    data = { anchorText: text, href: href };
  }
  else {
    if (text.length > 0) {
     data = text;
    }
  }
  return data;
}

module.exports = scraper;