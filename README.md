# cascade-config-mongodb
extension loader to cascade-config to read from mongodb

## Quick Start
`cascade-config-mongodb` adds a loader to `cascade-config` to allow reading from mongodb databases:



## API
* `.mongodb (opts)`: reads an object from a mongodb database, specified by mongodb url, database, collection and _id value. All 4 support variable substitution. Options are:
  * `url`: mongodb url (as supported by mongodb driver v3)
  * `db`: database to use
  * `coll`: collection to use
  * `id`: value of `_id` to seek within the collection. The `_id` itself is deleted from the returned object
