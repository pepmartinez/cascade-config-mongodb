var _ =            require ('lodash');
var MongoClient =  require ('mongodb').MongoClient;


//////////////////////////////////////////////
// gets data from mongodb. Both url, coll and id are templated
function _from_mongodb (utils, opts, cfg_so_far, cb) {
  var vals = {
    env: process.env.NODE_ENV || 'development'
  };

  _.merge (vals, cfg_so_far);

  var url =  utils.interpolator.parse (opts.url,  vals);
  var db =   utils.interpolator.parse (opts.db,   vals);
  var coll = utils.interpolator.parse (opts.coll, vals);
  var id =   utils.interpolator.parse (opts.id,   vals);

  MongoClient.connect (url, function(err, client) {
    if (err) return cb (err);
    var collection = client.db (db).collection (coll);
    collection.find ({_id: id}).limit (1).next (function (err, doc) {
      client.close();

      if (err) {
        return cb (err);
      }
      else {
        if (doc) delete doc._id;

        // expand variables in loaded object
        utils.expand (doc, vals, cb);
      }
    });
  });
}


//////////////////////////////////////////////
function __cc_mongodb (opts) {
  var self = this;
  var utils = {
    interpolator: self._interpolator,
    expand:       self._expand
  };

  this._tasks.push (function (cb) {
    _from_mongodb (utils, opts, self._cfg, function (err, res) {
      if (err) return cb (err);
      self._merge (res);
      return cb ();
    });
  });

  return this;
}


//////////////////////////////////////////////
module.exports = function (CC) {
  CC.prototype.mongodb = __cc_mongodb;
  return CC;
}