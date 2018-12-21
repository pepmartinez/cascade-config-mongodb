var CC_base = require('cascade-config');
var CC_mongodb = require ('../');
var CC = CC_mongodb (CC_base);

var async =  require('async');
var _ =      require('lodash');
var should = require('should');

var MongoClient = require('mongodb').MongoClient;


var mongodb_url = 'mongodb://localhost:27017/test';
var mongodb_coll = 'mconf_test';

describe('cascade-config-mongodb test', function () {
  describe('plain, nontemplated', function () {
    var mongodb_url = 'mongodb://localhost:27017';
    mongodb_db = 'test';
    var mongodb_coll = 'mconf_test';

    before(function (done) {
      MongoClient.connect(mongodb_url, function (err, client) {
        var collection = client.db(mongodb_db).collection(mongodb_coll);
        collection.drop(function () {
          collection.insertMany([
            { _id: 'zxcvbnm', b: 1, cc: { a: 1, b: 2 } },
            { _id: '666', b: 2 },
            { _id: 'asdfgh', b: 3 },
            { _id: 'qwerty', c: 666, h: 'tyeryter' },
          ], function (err, result) {
            client.close();
            done(err);
          });
        });
      });
    });

    after(function (done) {
      MongoClient.connect(mongodb_url, function (err, client) {
        var collection = client.db(mongodb_db).collection(mongodb_coll);
        collection.drop(function (err, result) {
          client.close();
          done(err);
        });
      });
    });

    it('does read and merge from mongodb ok', function (done) {
      var mconf = new CC();

      mconf
        .obj ({cc: {n: 'ooo'}, x: 0})
        .mongodb({ url: mongodb_url, db: mongodb_db, coll: mongodb_coll, id: '666' })
        .mongodb({ url: mongodb_url, db: mongodb_db, coll: mongodb_coll, id: 'zxcvbnm' })
        .mongodb({ url: mongodb_url, db: mongodb_db, coll: mongodb_coll, id: 'qwerty' })
        .done(function (err, cfg) {
          cfg.should.eql({ b: 1, cc: { a: 1, b: 2, n: 'ooo' }, c: 666, h: 'tyeryter', x: 0 });
          done();
        });
    });

    it('does return empty object on nonexistent mongodb', function (done) {
      var mconf = new CC();

      mconf
        .mongodb({ url: mongodb_url, db: mongodb_db, coll: mongodb_coll, id: 'nonexistent' })
        .done(function (err, cfg) {
          cfg.should.eql({});
          done();
        });
    });
  });

  describe('templated', function () {
    var mongodb_url = 'mongodb://localhost:27017';
    mongodb_db = 'db_development_';
    var mongodb_coll = 'mconf_development_';

    before(function (done) {
      MongoClient.connect(mongodb_url, function (err, client) {
        var collection = client.db(mongodb_db).collection(mongodb_coll);
        collection.drop(function () {
          collection.insertMany([
            { _id: 'id-development-6', b: 1, cc: { a: 1, b: 2 } },
          ], function (err, result) {
            client.close();
            done(err);
          });
        });
      });
    });

    after(function (done) {
      MongoClient.connect(mongodb_url, function (err, client) {
        var collection = client.db(mongodb_db).collection(mongodb_coll);
        collection.drop(function (err, result) {
          client.close();
          done(err);
        });
      });
    });

    it('merges from templatized mongo ok', function (done) {
      var mconf = new CC();

      mconf
        .obj ({ggg: 3, gamma: {a: 6}})
        .mongodb({ url: 'mongodb://localhost:27017', db: 'db_{env}_', coll: 'mconf_{env}_', id: 'id-{env}-{gamma.a}'})
        .done(function (err, cfg) {
          cfg.should.eql({ b: 1, cc: { a: 1, b: 2 }, ggg: 3, gamma: {a: 6}});
          done();
        });
    });
  });
});

