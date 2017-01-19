import NeoDB from '../neo_db'
import NeoNode from './neo_node'

class User extends NeoNode {
  get username() {
    return this.properties.username
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
  },
  first_name: {
    presence: true,
    format: {
      pattern: /^[A-Za-z_-]+$/
    }
  },
  last_name: {
    presence: true,
    format: {
      pattern: /^[A-Za-z_-]+$/
    }
  }
}

User.get = (username) => {
  return new Promise((resolve, reject) => {
    NeoNode.getNodesByProps('User', {username: username}).then((results) => {

      let user = new User(results[0]['n'])
      resolve(user)

    }).catch((err) => { reject(err) })
  })
}

User.count = () => {
  return NeoNode.count('User', {})
}

User.create = (props) => {
  return new Promise((resolve, reject) => {
    NeoNode.createNode('User', props, User.VALIDATION_INFO).then((rawNode) => {

      let user = new User(rawNode)
      resolve(user)

    }).catch((err) => {
      reject(err)
    })
  })
}

export default User
