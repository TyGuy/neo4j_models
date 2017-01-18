import neo4j from 'neo4j'

exports.register = function(server, options, next) {
  let username = process.env.NEO4J_USERNAME || 'neo4j'
  let password = process.env.NEO4J_PASSWORD || 'neo4j'

  let NeoDB = new neo4j.GraphDatabase(`http://${username}:${password}@localhost:7474`)

  const userCallback = (err, results) => {
    if(err) { throw err }

    console.log(results)
  }

  NeoDB.cypher({
    query: 'MATCH (u:User {name: {name}}) RETURN u.name as name',
    params: {
        name: 'Tyler',
    },
  }, userCallback)

  server.expose('NeoDB', NeoDB)

  next();
}

exports.register.attributes = {
  name: 'NeoDB'
}
