import neo4j from 'neo4j'

let username = process.env.NEO4J_USERNAME || 'neo4j'
let password = process.env.NEO4J_PASSWORD || 'neo4j'

const NeoDB = new neo4j.GraphDatabase(`http://${username}:${password}@localhost:7474`)

export default NeoDB
