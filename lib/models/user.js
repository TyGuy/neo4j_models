import NeoDB from '../neo_db'
// this package is weirdly named, the .js is necessary here
import validate from 'validate.js'

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

User.VALIDATION_INFO = {
  username: {
    presence: true,
    length: {
      minimum: 6,
      maximum: 20
    },
    format: {
      pattern: /^[A-Za-z0-9_]+$/
    }
  }
}

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

    let validationErrors = validate(props, User.VALIDATION_INFO)
    if (validationErrors) {
      return reject(validationErrors)
    }

    let params = {
      props: props
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
