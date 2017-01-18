import NeoDB from '../neo_db'

class User {
  constructor(_node) {
    this._node = _node
  }

  get username() {
    return this._node.properties.username
  }

  get properties() {
    return this._node.properties
  }

  get labels() {
    return this._node.labels
  }

  get _id() {
    return this._node._id
  }
}

// init validation stuff:
User.VALIDATION_INFO = {
  'username': {
    required: true,
    minLength: 6,
    maxLength: 20,
    pattern: /^[A-Za-z0-9_]+$/,
    message: '2-16 characters; letters, numbers, and underscores only.'
  },
}

import Validator from './validator'
const validator = new Validator(User.VALIDATION_INFO)

User.get = (username) => {
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

User.count = () => {
  return new Promise((resolve, reject) => {
    NeoDB.cypher({
      query: 'MATCH (user:User) RETURN count(user) as count'
    }, (err, results) => {
      if (err) return reject(err)

      resolve(results[0]['count'])
    })
  })
}

User.create = (props) => {
  return new Promise((resolve, reject) => {
    let query = [
      'CREATE (user:User {props})',
      'RETURN user',
    ].join('\n')

    // TODO: make this work like a real promise
    let params = {
      props: validator.validate(props, true)
    }

    NeoDB.cypher({
      query: query,
      params: params,
    }, (err, results) => {
      // TODO: handle specific errors like constraint validation
      if (err) return reject(err)

      let user = new User(results[0]['user'])
      resolve(user)
    })
  })
}

export default User
