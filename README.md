
[![Build Status](https://travis-ci.org/jgdonas/web-scraper.svg?branch=master)](https://travis-ci.org/jgdonas/web-scraper) ![Hex.pm](https://img.shields.io/hexpm/l/plug.svg) <a href="https://www.npmjs.com/package/@jose.donas/web-scraper"><img src="https://img.shields.io/npm/v/@jose.donas/web-scraper.svg?style=flat" alt="NPM version"></a> <a href="https://www.npmjs.com/package/@jose.donas/web-scraper"><img src="https://img.shields.io/npm/dt/@jose.donas/web-scraper.svg?style=flat" alt="NPM downloads"></a>

# web-scraper 
A simple web scraper for node.js using promises and css selectors.

## How it works

All you need is define an json object with:
* **url**: the web page url to be scraped (mandatory)
* **forEach**: the html element(s) where the scraper should search (optional).
If no specified, **html** will be used.
* **get**: a object specifying what data we want to get back from each **forEach** element.

Both **forEach** element and **get** values must be [css selectors](https://www.w3schools.com/cssref/css_selectors.asp).

Briefly:
for each **forEach** element found in the web DOM, **web-scraper** will return an object with the same structure as
the **get** param containing the data in the corresponding property. Let's see some examples.

#### How to use it

Since **web-scraper** returns a Promise, given a correct search object (see examples below) you can choose between:

* **then/catch**

```js
const scraper = require('@jose.donas/web-scraper');
var mySearch = {...};

scraper(mySearch)
        .then( data => {
            //**data** is the returned info by **scraper**. Do whatever you need with it
        })
        .catch( err => {
            //Some error ocurred. Handle it!!
        });

```

* **async/await**

Cleaner option, but remember that you can only use **await** inside an **async** function:

```js
const scraper = require('@jose.donas/web-scraper');
var mySearch = {...};

(async() => {
    try{
        let data = await scraper(mySearch);
        //do whatever you need with **data**
    }catch(err){
        //Some error ocurred. Handle it!!
    }
})();

```

## Examples

In this example, we are fetching some data from [The Matrix page at IMDB](https://www.imdb.com/title/tt0133093/)

#### 1. Get the film name, available in the web title

Our search params will be:

```js
var mySearch = {
  url : 'https://www.imdb.com/title/tt0133093/',
  get:{
    filmTitle: 'div#ratingWidget p strong'
  }
} ;
```
this will return:

```json
{
    "filmTitle": "Matrix"
}
```

Notice that the result will be an array only if the search result contains more than one element.
This way you will need to check wether the result is a single element or a set of them.
We'll see it in some following examples, but let's continue with The Matrix.

#### 2. Get the film name with a different search params.

For every search, we can find several ways to get the desired data. In this case, we can get the film
title with this configuration:

```js
var mySearch = {
  url : 'https://www.imdb.com/title/tt0133093/',
  get:{
    filmTitle: 'strong'
  },
  forEach:'div#ratingWidget p'
} ;
```

With this configuration we are requesting our scraper to search for a **strong** element inside every **p** that 
is children of **div#ratingWidget**. But in the inspected DOM, this only ocurrs one time, so again, we will get:

```json
{
    "filmTitle": "Matrix"
}
```

#### 3. Get all the cast inside a single object.

Since there is a **div** identified with **titleCast** containing all the cast, we can get
all the names with:

```js
var mySearch = {
  url : 'https://www.imdb.com/title/tt0133093/',
  get:{
    names: 'span[itemprop="name"]'
  },
  forEach:'div#titleCast'
} ;
```

In this case, as there is **just one element** identified with 'div#titleCast', we are getting
**just one object** containing an array of names, one for each actor/actress:

```json
 { names:
     [ 'Keanu Reeves',
       'Laurence Fishburne',
       'Carrie-Anne Moss',
       'Hugo Weaving',
       'Gloria Foster',
       'Joe Pantoliano',
       'Marcus Chong',
       'Julian Arahanga',
       'Matt Doran',
       'Belinda McClory',
       'Anthony Ray Parker',
       'Paul Goddard',
       'Robert Taylor',
       'David Aston',
       'Marc Aden Gray' 
      ] 
  } 
```

#### 4. Get one object for each actor and actress, containing the character's name too.

What if we wanted to get a set of objects, containg each one the name of the actor/actress and
the name of the played character?

```js
var mySearch = {
  url : 'https://www.imdb.com/title/tt0133093/',
  get:{
    name: 'span[itemprop="name"]',
    character: 'td.character'
  },
  forEach:'div#titleCast table tbody tr.even, div#titleCast table tbody tr.odd'
} ;
```
Will return us:

```json
[
    {
        "name": "Keanu Reeves",
        "character": "Neo"
    },
    {
        "name": "Laurence Fishburne",
        "character": "Morpheus"
    },
    {
        "name": "Carrie-Anne Moss",
        "character": "Trinity"
    },
    {
        "name": "Hugo Weaving",
        "character": "Agent Smith"
    },
    {
        "name": "Gloria Foster",
        "character": "Oracle"
    },
    {
        "name": "Joe Pantoliano",
        "character": "Cypher"
    },
    {
        "name": "Marcus Chong",
        "character": "Tank"
    },
    {
        "name": "Julian Arahanga",
        "character": "Apoc"
    },
    {
        "name": "Matt Doran",
        "character": "Mouse"
    },
    {
        "name": "Belinda McClory",
        "character": "Switch"
    },
    {
        "name": "Anthony Ray Parker",
        "character": "Dozer"
    },
    {
        "name": "Paul Goddard",
        "character": "Agent Brown"
    },
    {
        "name": "Robert Taylor",
        "character": "Agent Jones"
    },
    {
        "name": "David Aston",
        "character": "Rhineheart"
    },
    {
        "name": "Marc Aden Gray",
        "character": "Choi (as Marc Gray)"
    }
]
```

#### 5. Gathering links

Links ("a" elements) can be considered quite special because they contain a couple of elements we may want to store:
the **href** attribute and the **anchor text**. That's why when we ask our scraper to gather **a** elements, it'll
return us both pieces of data. An example where we are interested in a set of links:

```js
var mySearch  = {
  url: 'https://www.imdb.com/title/tt0133093/',
  get:{
    linkToPerson: 'td[itemprop="actor"] a'
  },
  forEach: 'div#titleCast table tbody tr'
};
```

Will return us:

```json
[
    {
        "linkToPerson": {
            "anchorText": "Keanu Reeves",
            "href": "/name/nm0000206/?ref_=tt_cl_t1"
        }
    },
    {
        "linkToPerson": {
            "anchorText": "Laurence Fishburne",
            "href": "/name/nm0000401/?ref_=tt_cl_t2"
        }
    },
    {
        "linkToPerson": {
            "anchorText": "Carrie-Anne Moss",
            "href": "/name/nm0005251/?ref_=tt_cl_t3"
        }
    },
    {
        "linkToPerson": {
            "anchorText": "Hugo Weaving",
            "href": "/name/nm0915989/?ref_=tt_cl_t4"
        }
    },
    {
        "linkToPerson": {
            "anchorText": "Gloria Foster",
            "href": "/name/nm0287825/?ref_=tt_cl_t5"
        }
    },
    {
        "linkToPerson": {
            "anchorText": "Joe Pantoliano",
            "href": "/name/nm0001592/?ref_=tt_cl_t6"
        }
    },
    {
        "linkToPerson": {
            "anchorText": "Marcus Chong",
            "href": "/name/nm0159059/?ref_=tt_cl_t7"
        }
    },
    {
        "linkToPerson": {
            "anchorText": "Julian Arahanga",
            "href": "/name/nm0032810/?ref_=tt_cl_t8"
        }
    },
    {
        "linkToPerson": {
            "anchorText": "Matt Doran",
            "href": "/name/nm0233391/?ref_=tt_cl_t9"
        }
    },
    {
        "linkToPerson": {
            "anchorText": "Belinda McClory",
            "href": "/name/nm0565883/?ref_=tt_cl_t10"
        }
    },
    {
        "linkToPerson": {
            "anchorText": "Anthony Ray Parker",
            "href": "/name/nm0662562/?ref_=tt_cl_t11"
        }
    },
    {
        "linkToPerson": {
            "anchorText": "Paul Goddard",
            "href": "/name/nm0323822/?ref_=tt_cl_t12"
        }
    },
    {
        "linkToPerson": {
            "anchorText": "Robert Taylor",
            "href": "/name/nm0853079/?ref_=tt_cl_t13"
        }
    },
    {
        "linkToPerson": {
            "anchorText": "David Aston",
            "href": "/name/nm0040058/?ref_=tt_cl_t14"
        }
    },
    {
        "linkToPerson": {
            "anchorText": "Marc Aden Gray",
            "href": "/name/nm0336802/?ref_=tt_cl_t15"
        }
    }
]

```  

#### 6. Grouping data

Sometimes we may need to group the desired data. Let's see an example: in this case we are gathering players
from [a random NBA game](https://www.basketball-reference.com/boxscores/200911060CHA.html)

We could make a request to our scraper with this simple params:

```js
var mySearch  = {
  url: 'https://www.basketball-reference.com/boxscores/200911060CHA.html',
  get:{
    playerName: 'th[csk]',
    points:'td[data-stat="pts"]'
  },
  forEach: 'table#box_atl_basic tbody tr, table#box_cha_basic tbody tr'
};
```

This is what we get:

```json
[
    {
        "playerName": "Joe Johnson",
        "points": "13"
    },
    {
        "playerName": "Marvin Williams",
        "points": "9"
    },
    {
        "playerName": "Al Horford",
        "points": "10"
    },
    {
        "playerName": "Josh Smith",
        "points": "13"
    },
    {
        "playerName": "Mike Bibby",
        "points": "2"
    },
    {
        "playerName": "Jamal Crawford",
        "points": "13"
    },
    {
        "playerName": "Maurice Evans",
        "points": "10"
    },
    {
        "playerName": "Jeff Teague",
        "points": "4"
    },
    {
        "playerName": "Zaza Pachulia",
        "points": "8"
    },
    {
        "playerName": "Joe Smith",
        "points": "0"
    },
    {
        "playerName": "Randolph Morris",
        "points": "1"
    },
    {
        "playerName": "Jason Collins",
        "points": "0"
    },
    {
        "playerName": "Gerald Wallace",
        "points": "11"
    },
    {
        "playerName": "Boris Diaw",
        "points": "10"
    },
    {
        "playerName": "Raja Bell",
        "points": "24"
    },
    {
        "playerName": "Tyson Chandler",
        "points": "10"
    },
    {
        "playerName": "Raymond Felton",
        "points": "7"
    },
    {
        "playerName": "D.J. Augustin",
        "points": "11"
    },
    {
        "playerName": "Ronald Murray",
        "points": "15"
    },
    {
        "playerName": "Nazr Mohammed",
        "points": "8"
    },
    {
        "playerName": "Stephen Graham",
        "points": "2"
    },
    {
        "playerName": "Vladimir Radmanovic",
        "points": "2"
    },
    {
        "playerName": "Derrick Brown",
        "points": "2"
    },
    {
        "playerName": "Gerald Henderson",
        "points": "1"
    }
]
```

Yes, this way we'll get all the players with their respective points, but: what team did they play for?

To get than info grouped by team, as each roster has it own table, we just need to pass an array instead
a comma separated list of elements. In this example, note the transformation at 'forEach' field:


```js
var mySearch  = {
  url: 'https://www.basketball-reference.com/boxscores/200911060CHA.html',
  get:{
    playerName: 'th[csk]',
    points:'td[data-stat="pts"]'
  },
  forEach: ['table#box_atl_basic tbody tr', 'table#box_cha_basic tbody tr']
};
```

Now, our scraper will search separetely all the players games and points inside each of the
elements (in this case, tables) for those players, so at the end we'll get separated stats by teams,
where each array position contains each team players and stats:

```json
[
    [
        {
            "playerName": "Joe Johnson",
            "points": "13"
        },
        {
            "playerName": "Marvin Williams",
            "points": "9"
        },
        {
            "playerName": "Al Horford",
            "points": "10"
        },
        {
            "playerName": "Josh Smith",
            "points": "13"
        },
        {
            "playerName": "Mike Bibby",
            "points": "2"
        },
        {
            "playerName": "Jamal Crawford",
            "points": "13"
        },
        {
            "playerName": "Maurice Evans",
            "points": "10"
        },
        {
            "playerName": "Jeff Teague",
            "points": "4"
        },
        {
            "playerName": "Zaza Pachulia",
            "points": "8"
        },
        {
            "playerName": "Joe Smith",
            "points": "0"
        },
        {
            "playerName": "Randolph Morris",
            "points": "1"
        },
        {
            "playerName": "Jason Collins",
            "points": "0"
        }
    ],
    [
        {
            "playerName": "Gerald Wallace",
            "points": "11"
        },
        {
            "playerName": "Boris Diaw",
            "points": "10"
        },
        {
            "playerName": "Raja Bell",
            "points": "24"
        },
        {
            "playerName": "Tyson Chandler",
            "points": "10"
        },
        {
            "playerName": "Raymond Felton",
            "points": "7"
        },
        {
            "playerName": "D.J. Augustin",
            "points": "11"
        },
        {
            "playerName": "Ronald Murray",
            "points": "15"
        },
        {
            "playerName": "Nazr Mohammed",
            "points": "8"
        },
        {
            "playerName": "Stephen Graham",
            "points": "2"
        },
        {
            "playerName": "Vladimir Radmanovic",
            "points": "2"
        },
        {
            "playerName": "Derrick Brown",
            "points": "2"
        },
        {
            "playerName": "Gerald Henderson",
            "points": "1"
        }
    ]
]
```



Check out the [test folder](https://github.com/jgdonas/web-scraper/tree/master/test) to find more examples.


## Tests

You can run the tests executing

```js
npm test
```
from console (after you set your current directory to the project root). After tests execution, you'll have access to a coverage report both at the terminal and coverage folder (that will be created automatically) which contains an html report (simply double click on index.html to access a more detailed report).

## Installation

Installation is quite easy using npm:

```js
npm i @jose.donas/web-scraper
```
You can get some extra info about this module at [web-scraper npm web page](https://www.npmjs.com/package/@jose.donas/web-scraper)

## Author

* **Jose Antonio González Doñas** -  [LinkedIn](https://www.linkedin.com/in/jose-antonio-gonzalez-donas/)

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE.md](LICENSE.md) file for details
