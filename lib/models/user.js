// import neo4j from 'neo4j'
import NeoDB from '../neo_db'

class User {
  constructor(_node) {
    this._node = _node;
  }

  get username() {
    return this._node.properties.username;
  }

  get properties() {
    return this._node.properties;
  }

  get labels() {
    return this._node.labels;
  }

  static get(username) {
    return new Promise((resolve, reject) => {
      NeoDB.cypher({
        query: 'MATCH (user:User {username: {username}}) RETURN user',
        params: {
            username: username,
        },
      }, (err, results) => {
        if (err) return reject(err)

        if (!results.length) {
          let err = new Error('No such user with username: ' + username)
          return reject(err)
        }

        let user = new User(results[0]['user'])
        resolve(user)
      })
    })
  }

  static count() {
    return new Promise((resolve, reject) => {
      NeoDB.cypher({
        query: 'MATCH (user:User) RETURN count(user) as count'
      }, (err, results) => {
        if (err) return reject(err)

        resolve(results[0]['count'])
      })
    })
  }
}

User.VALIDATION_INFO = {
    'username': {
        required: true,
        minLength: 2,
        maxLength: 16,
        pattern: /^[A-Za-z0-9_]+$/,
        message: '2-16 characters; letters, numbers, and underscores only.'
    },
};

export default User;
