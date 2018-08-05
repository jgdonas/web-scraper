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
  console.log('Example#1 result: ', JSON.stringify(data, null, 4));
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
  console.log('Example#2 result: ', JSON.stringify(data, null, 4));
}).catch(error => {
  console.log(error);
});

//Example #2, second way
var mySearch2_2nd_way = {
  url : 'https://www.imdb.com/title/tt0133093/',
  get:{
    filmTitle: 'strong'
  },
  forEach:'div#ratingWidget'
} ;

scraper(mySearch2_2nd_way)
.then(data => {
  console.log('Example#2 second way result: ', JSON.stringify(data, null, 4));
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
  console.log('Example#3 result: ', JSON.stringify(data, null, 4));
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
  console.log('Example#4 result: ', JSON.stringify(data, null, 4));
}).catch(error => {
  console.log(error);
});


//#Example #5
var mySearch5 = {
  url: 'https://www.imdb.com/title/tt0133093/',
  get:{
    linkToPerson: 'td[itemprop="actor"] a'
  },
  forEach: 'div#titleCast table tbody tr'
};
//using async-await

(async () => {

  try{
    let data = await scraper(mySearch5);
    console.log("Example#5 result: " +  JSON.stringify(data, null, 4,));
  }catch(error){
    console.error("Error in ecample#6" + error);
  }
  
})();

//Example #6
var mySearch6  = {
  url: 'https://www.basketball-reference.com/boxscores/200911060CHA.html',
  get:{
    playerName: 'th[csk]',
    points:'td[data-stat="pts"]'
  },
  forEach: 'table#box_atl_basic tbody tr, table#box_cha_basic tbody tr'
};

(async () => {

  try{
    let data = await scraper(mySearch6);
    console.log("Example#6 result: " +  JSON.stringify(data, null, 4,));
  }catch(error){
    console.error("Error in example#6" + error);
  }
  
})();


//Example #6, second try
var mySearch6_2nd_try  = {
  url: 'https://www.basketball-reference.com/boxscores/200911060CHA.html',
  get:{
    playerName: 'th[csk]',
    points:'td[data-stat="pts"]'
  },
  forEach: ['table#box_atl_basic tbody tr', 'table#box_cha_basic tbody tr']
};

(async () => {

  try{
    let data = await scraper(mySearch6_2nd_try);
    console.log("Example#6 second try result: " +  JSON.stringify(data, null, 4,));
  }catch(error){
    console.error("Error in example#6" + error);
  }
  
})();