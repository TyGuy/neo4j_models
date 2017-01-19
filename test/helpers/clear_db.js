import NeoDB from '../../lib/neo_db'

const clearDB = (callback) => {
  NeoDB.cypher({
    query: 'MATCH (n) DETACH DELETE n',
    params: {}
  }, (err, results) => {
    if (err) {
      console.log(err)
      return callback(err)
    }
    callback(null, results)
  })
}

export default clearDB
