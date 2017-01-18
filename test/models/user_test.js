import Dotenv from 'dotenv'
import User from '../../lib/models/user'
import Chai, { expect } from 'chai'
import NeoDB from '../../lib/neo_db'

// WARNING NOTE:
// The test env uses the same instance of the Neo4j database (because
// there is only one instance). Should figure out a workaround, maybe
// using docker. But for now, simply be warned, and have a way to
// re-load data (that's a TODO for sure)

// TODO: move these helper things into a separate file that can be imported
const createUser = (username, callback) => {
  NeoDB.cypher({
    query: 'CREATE (u:User {username: {username}})',
    params: {
      username: username
    }
  }, (err, results) => {
    if(err) { console.log(err) }
    callback();
  })
}

const destroyUser = (username, callback) => {
  NeoDB.cypher({
    query: 'MATCH (u:User {username: {username}}) DETACH DELETE u',
    params: {
      username: username
    }
  }, callback)
}

const clearDB = (username, callback) => {
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

describe('User', () => {
  const username = 'tity_boi'

  beforeEach((done) => {
    clearDB(username, done)
  })

  describe('#get', () => {
    describe('when the user exists', () => {
      beforeEach((done) => {
        createUser(username, done)
      })

      it('returns the user when it is found', (done) => {
        User.get(username, (err, user) => {
          expect(err).to.not.exist
          expect(user).to.be.a('Object')
          done()
        })
      });
    })
  })
});
