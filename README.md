# cascade-config-mongodb
extension loader to cascade-config to read from mongodb

## Quick Start
`cascade-config-mongodb` adds a loader to `cascade-config` to allow reading from mongodb databases:

```javascript
var CC_base = require('cascade-config');
var CC_mongodb = require ('cascade-config-mongodb');
var CC = CC_mongodb (CC_base);

var config = new CC();

config
.obj ({cc: {n: 'ooo'}, x: 0})
.mongodb({ 
  url: 'mongodb://{env}-config.server.com', 
  db: 'config_database_{env}', 
  coll: 'config_{env}_coll', 
  id: 'abcdef-{env}')
.done(function (err, cfg) {
  ...
});
```

## API
* `.mongodb (opts)`: reads an object from a mongodb database, specified by mongodb url, database, collection and _id value. All 4 support variable substitution. Options are:
  * `url`: mongodb url (as supported by mongodb driver v3)
  * `db`: database to use
  * `coll`: collection to use
  * `id`: value of `_id` to seek within the collection. The `_id` itself is deleted from the returned object

# Variable expansion
As it happens with standard loaders in `cascade-config` read objects from mongodb are then subject to variable expansion using so-far read config; also, config read by this loader can be user as source for variable expansion on further stages