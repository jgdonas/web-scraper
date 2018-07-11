

# web-scraper [![Build Status](https://travis-ci.org/jgdonas/web-scraper.svg?branch=master)](https://travis-ci.org/jgdonas/web-scraper)
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

## Examples

In this example, we are fetching some data from [The Matrix page at IMDB](https://www.imdb.com/title/tt0133093/)

#### 1. Get the film name, available in the web title

Our search params will be:

```
var mySearch = {
  url : 'https://www.imdb.com/title/tt0133093/',
  get:{
    filmTitle: 'title'
  }
} ;
```
this will return:

```
[ { filmTitle: [ 'Matrix (1999) - IMDb' ] } ]
```

Notice that the result is always an array, regardless the number of elements returned.
This way you won't need to check wether the result is a single element or a set of the, simply
traverse the array! We'll see it in some following examples, but let's continue with The Matrix.

#### 2. Get the film name without the release year, available from a indentified element's children node

As you can see, the fetched element contains both the film title and release year, which maybe you
are not interested in. We can choose another element in the web, for example the **strong** element
inside a **div** with the **id ratingWidget**.

```
var mySearch = {
  url : 'https://www.imdb.com/title/tt0133093/',
  get:{
    filmTitle: 'strong'
  },
  forEach:'div#ratingWidget p'
} ;
```

returning:

```
[ { filmTitle: [ 'Matrix' ] },
  { filmTitle: [] },
  { filmTitle: [] } ]
```
Why is this request returning three objects, including two with empty data? This is because with
the 'div#ratingWidget p' selector, we asked our scraper to look for the data inside the **strong**
element inside every **p** element that it a child node of the **div with the 'ratingWidget' id**,
but we know that there's only one **strong** element, so how can we fix this?

Let's try again:

```
var mySearch = {
  url : 'https://www.imdb.com/title/tt0133093/',
  get:{
    filmTitle: 'strong'
  },
  forEach:'div#ratingWidget'
} ;
```

Now we have what we wanted!

```
[ { filmTitle: [ 'Matrix' ] } ]
```

This is because now we asked our scraper to search inside the **div#ratingWidget**
and get the data inside any **strong** element, which is unique, thus we get just
one object.

#### 3. Get all the cast inside a single object.

Since there is a **div** identified with **titleCast** containing all the cast, we can get
all the names with:

```
var mySearch = {
  url : 'https://www.imdb.com/title/tt0133093/',
  get:{
    names: 'span[itemprop="name"]'
  },
  forEach:'div#titleCast'
} ;
```

In this case, since there is **just one element** identified with 'div#titleCast', we are getting
**just one object** containing an array of names, one for each actor/actress:

```
[ { names:
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
       'Marc Aden Gray' ] } ]
```

#### 4. Get one object for each actor and actress, containing the character's name too.

What if we wanted to get a set of objects, containg each one the name of actor/actress and
the name of the played character?

```
var mySearch = {
  url : 'https://www.imdb.com/title/tt0133093/',
  get:{
    name: 'span[itemprop="name"]',
    character: 'td.character a'
  },
  forEach:'div#titleCast table tbody tr.even, div#titleCast table tbody tr.odd'
} ;
```
Will return us:

```
[ { name: [ 'Keanu Reeves' ],
    character: [ 'Neo' ] },
  { name: [ 'Laurence Fishburne' ],
    character: [ 'Morpheus' ] },
  { name: [ 'Carrie-Anne Moss' ],
    character: [ 'Trinity' ] },
  { name: [ 'Hugo Weaving' ],
    character: [ 'Agent Smith' ] },
  { name: [ 'Gloria Foster' ],
    character: [ 'Oracle' ] },
  { name: [ 'Joe Pantoliano' ],
    character: [ 'Cypher' ] },
  { name: [ 'Marcus Chong' ],
    character: [ 'Tank' ] },
  { name: [ 'Julian Arahanga' ],
    character: [ 'Apoc' ] },
  { name: [ 'Matt Doran' ],
    character: [ 'Mouse' ] },
  { name: [ 'Belinda McClory' ],
    character: [ 'Switch' ] },
  { name: [ 'Anthony Ray Parker' ],
    character: [ 'Dozer' ] },
  { name: [ 'Paul Goddard' ],
    character: [ 'Agent Brown' ] },
  { name: [ 'Robert Taylor' ],
    character: [ 'Agent Jones' ] },
  { name: [ 'David Aston' ],
    character: [ 'Rhineheart' ] },
  { name: [ 'Marc Aden Gray' ],
    character: [ 'Choi \n  \n  \n  (as Marc Gray)' ] }
  ]
```

#### 5. Gathering links

Links ("a" elements) can be considered quite special because they contain a couple of elements we may want to store:
the **href** attribute and the **anchor text**. That's why when we ask our scraper to gather **a** elements, it'll
return us both pieces of data. An example where we are interested in a single link:

```
var mySearch  = {
  url: 'https://www.forocoches.com',
  get:{
    linkToTwitter: 'ul#tablist a[target="_blank"]'
  }
};
```

Will return us:

```
[{
  "linkToTwitter":[{
    "anchorText": "Twitter FC",
    "href":       "https://twitter.com/forocoches"
   }]
}]

```  

Check out the [test folder](https://github.com/jgdonas/web-scraper/tree/master/test) to find more examples.

### Tests

You can run the tests executing

```
npm test
```
from console.

## Author

* **Jose Antonio González Doñas** -  [LinkedIn](https://www.linkedin.com/in/jose-antonio-gonzalez-donas/)

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE.md](LICENSE.md) file for details
