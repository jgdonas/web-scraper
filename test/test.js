var {expect, assert} = require('chai');
var scraper = require('../index');

describe('Web scraper', () => {

    it('should reject no url param', done => {

        var mySearch  = {
          forEach: "#element",
          get: {
            prop: 'tr td'
          }
        };

        scraper(mySearch)
        .then(()=>{
          done(new Error('Expected method to reject.'))
        })
        .catch((err) => {
          assert.isDefined(err);
          expect(err).to.equal('Undefined url param.');
          done();
        })
        .catch(done);
    });

    it('should reject no get param', done => {

      var mySearch  = {
        url: 'http://toastytech.com/evil/',
        forEach: '#element'
      };

      scraper(mySearch)
      .then(()=>{
        done(new Error('Expected method to reject'))
      })
      .catch(err => {
        assert.isDefined(err);
        expect(err).to.equal('Undefined get param.');
        done();
      })
      .catch(done);
    });

    it('should reject empty get param', done => {

      var mySearch  = {
        url: 'http://toastytech.com/evil/',
        get:{},
        forEach: '#element'
      };

      scraper(mySearch)
      .then(()=>{
        done(new Error('Expected method to reject'))
      })
      .catch(err => {
        assert.isDefined(err);
        expect(err).to.equal('Empty get param.');
        done();
      })
      .catch(done);
    });

    it('should reject: false, malformed or non-exixtent url',done =>{

      var mySearch  = {
        url: 'http://toastytech.come/evil/',
        get:{
          name: 'td tr'
        },
        forEach: '#element'
      };

      scraper(mySearch)
      .then(()=>{
        done(new Error('Expected method to reject'));
      })
      .catch(err => {
        assert.isDefined(err);
        expect(err).to.include('request error');
        done();
      })
      .catch(done);

    });

    it('should return the expected single element', done => {

      var mySearch  = {
        url: 'http://usatoday30.usatoday.com/sports/baseball/sbfant.htm',
        get:{
          title: 'title'
        },
        forEach: 'html'
      };

      scraper(mySearch)
      .then((data) => {
        assert.isDefined(data);
        assert.isDefined(data.title);
        expect(data.title).to.equal('Fantasy baseball home page');
        done();
      })
      .catch(done)
      .catch(err => {
        done(new Error('Expected method to resolve.'));
      });
    });


    it('should return all the elements inside any table in a single object',done => {

      var mySearch  = {
        url: 'http://usatoday30.usatoday.com/sports/baseball/sbfant.htm',
        get:{
          links: 'table tr td a'
        },
        forEach: 'body'
      };

      scraper(mySearch)
      .then((data) => {
        var expectedNumberOfLinks = 26;
        assert.isDefined(data);
        assert.isDefined(data.links);
        expect(data.links.length).to.equal(expectedNumberOfLinks);
        done();
      })
      .catch(done)
      .catch(err => {
        done(new Error('Expected method to resolve.'));
      });
    });

    it('should return all the elements grouped by table inside separated objects', done => {

      var mySearch  = {
        url: 'http://usatoday30.usatoday.com/sports/baseball/sbfant.htm',
        get:{
          links: 'tr td a'
        },
        forEach: 'body table'
      };

      scraper(mySearch)
      .then((data) => {
        var expectedNumberOfLinksInFirstTable = 10;
        var expectedNumberOfLinksInSecondTable = 16;
        assert.isDefined(data);
        assert.isDefined(data[0].links);
        assert.isDefined(data[1].links);
        expect(data.length).to.equal(2);
        expect(data[0].links.length).to.equal(expectedNumberOfLinksInFirstTable);
        expect(data[1].links.length).to.equal(expectedNumberOfLinksInSecondTable);
        done();
      })
      .catch(done)
      .catch(err => {
        done(new Error('Expected method to resolve.'));
      });
    });

    it('should return both anchor text and href when "a" element requested', done =>{

      var mySearch  = {
        url: 'https://www.forocoches.com',
        get:{
          linkToTwitter: 'ul#tablist a[target="_blank"]'
        }
      };

      scraper(mySearch)
      .then( data => {
        const expectedAnchorText = 'Twitter FC';
        const expectedHref = 'https://twitter.com/forocoches'
        assert.isDefined(data);
        assert.isDefined(data.linkToTwitter.anchorText);
        assert.isDefined(data.linkToTwitter.href);
        expect(data.linkToTwitter.anchorText).to.equal(expectedAnchorText);
        expect(data.linkToTwitter.href).to.equal(expectedHref);
        done();
      })
      .catch(done)
      .catch(err => {
        done(new Error('Expected method to resolve.'))
      })
    });

    it('should return as many grouped data elements are in "forEach" field', async () => {

      var mySearch = {
        url: 'https://en.wikipedia.org/wiki/Antequera',
        get: {
          randomValue: 'span.toctext'
        },
        forEach:['a[href="#Economy"]', 'a[href="#Citations"]']
      };

      let data = await scraper(mySearch);

      assert.isArray(data);
      assert.isArray(data[0]);
      assert.isArray(data[1]);
      assert.equal(2, data.length);
      assert.equal(data[0][0].randomValue, 'Economy');
      assert.equal(data[1][0].randomValue, 'Citations');
    });

});
