var scraper = require('./index');

//See readme file to get more info about these examples.
//Example #1
var mySearch1 = {
  url : 'https://www.imdb.com/title/tt0133093/',
  get:{
    filmTitle: 'div#ratingWidget p strong'
  }
} ;

scraper(mySearch1)
.then(data => {
  console.log('Example#1 result: ', JSON.stringify(data, null, 4,));
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
  console.log('Example#2 result: ', JSON.stringify(data, null, 4,));
}).catch(error => {
  console.log(error);
});

//Example #2, second way
var mySearch2_way = {
  url : 'https://www.imdb.com/title/tt0133093/',
  get:{
    filmTitle: 'strong'
  },
  forEach:'div#ratingWidget'
} ;

scraper(mySearch2_way)
.then(data => {
  console.log('Example#2 second way result: ', JSON.stringify(data, null, 4,));
}).catch(error => {
  console.log(error);
});

//Example #3
var mySearch3 = {
  url : 'https://www.imdb.com/title/tt0133093/',
  get:{
    names: 'span[itemprop="name"]'
  },
  forEach:'div#titleCast'
} ;

scraper(mySearch3)
.then(data => {
  console.log('Example#3 result: ', JSON.stringify(data, null, 4,));
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
  console.log('Example#4 result: ', JSON.stringify(data, null, 4,));
}).catch(error => {
  console.log(error);
});
