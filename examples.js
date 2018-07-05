var scraper = require('./index');

//See readme file to get more info about these examples.
//Example #1
var mySearch1 = {
  url : 'https://www.imdb.com/title/tt0133093/',
  get:{
    filmTitle: 'title'
  }
} ;

scraper(mySearch1)
.then(data => {
  console.log('Example#1 result: ',data);
}).catch(error => {
  console.log(error);
});


//Example #2
var mySearch2 = {
  url : 'https://www.imdb.com/title/tt0133093/',
  get:{
    filmTitle: 'strong'
  },
  forEach:'div#ratingWidget p'
} ;

scraper(mySearch2)
.then(data => {
  console.log('Example#2 result: ',data);
}).catch(error => {
  console.log(error);
});

//Example #2, second chance
var mySearch2_retry = {
  url : 'https://www.imdb.com/title/tt0133093/',
  get:{
    filmTitle: 'strong'
  },
  forEach:'div#ratingWidget'
} ;

scraper(mySearch2_retry)
.then(data => {
  console.log('Example#2 retried result: ',data);
}).catch(error => {
  console.log(error);
});

//Example #3
var mySearch3 = {
  url : 'https://www.imdb.com/title/tt0133093/',
  get:{/media/jd/data/sincronizada/Ing. software/TFG/web-scraper-antiguo/
    names: 'span[itemprop="name"]'
  },
  forEach:'div#titleCast'/media/jd/data/sincronizada/Ing. software/TFG/web-scraper-antiguo/
} ;

scraper(mySearch3)
.then(data => {
  console.log('Example#3 result: ',data);
}).catch(error => {
  console.log(error);
});

//Example #4
var mySearch4 = {
  url : 'https://www.imdb.com/title/tt0133093/',
  get:{
    name: 'span[itemprop="name"]',
    character: 'td.character'
  },
  forEach:'div#titleCast table tbody tr.even, div#titleCast table tbody tr.odd'
} ;


scraper(mySearch4)
.then(data => {
  console.log('Example#4 result: ',data);
}).catch(error => {
  console.log(error);
});
