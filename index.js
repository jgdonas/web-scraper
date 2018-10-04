const request = require('request');
const cheerio = require('cheerio');

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

          var thisParamData = [];

          $(eachParam).map((index,element) => {

            var tempObject = {};
            var tempObjectHasData = false;
            
            Object.keys(params.get).forEach( key => {
              var selector = $(params.get[key]);
              var tempData = [];
  
              $(element).find(selector).each((i,element) => {
                var e = $(element);
                tempData.push(extractData(e));
                if (1 === tempData.length) {
                  tempObject[key] = tempData[0];
                  tempObjectHasData = true;
                }
                else if (2 >= tempData.length) {
                  tempObject[key] = tempData;
                  tempObjectHasData = true;
                }
              });
            });
  
            if(tempObjectHasData){
              thisParamData.push(tempObject);
            }
  
          });

          data.push(thisParamData);

        }

        //remove unnecessary arrays. There are two possible cases when this happens:
        //two nested arrays of dimension 1
        //a single array of dimension 1
        if(1 === data.length && 1 === data[0].length){
          data = data[0][0];            
        }else if(1 === data.length){
          data = data[0];
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