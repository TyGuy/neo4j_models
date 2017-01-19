import NeoDB from '../neo_db'
import validate from 'validate.js'

class Story {
  constructor(_node) {
    this._node = _node
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

  get title() {
    return this.properties.title
  }
}

Story.VALIDATION_INFO = {
  title: {
    presence: true,
    length: {
      maximum: 255
    },
  },
  synopsis: {
    presence: true,
    length: {
      maximum: 255
    }
  },
  description: {
    presence: true,
    length: {
      maximum: 2000
    }
  }
}

Story.get = (title) => {
  return new Promise((resolve, reject) => {
    NeoDB.cypher({
      query: 'MATCH (story:Story {title: {title}}) RETURN story',
      params: {
          title: title,
      },
    }, (err, results) => {
      if (err) return reject(err)

      if (!results.length) {
        let err = new Error('No such story with title: ' + title)
        return reject(err)
      }

      let story = new Story(results[0]['story'])
      resolve(story)
    })
  })
}

Story.count = () => {
  return new Promise((resolve, reject) => {
    NeoDB.cypher({
      query: 'MATCH (story:Story) RETURN count(story) as count'
    }, (err, results) => {
      if (err) return reject(err)

      resolve(results[0]['count'])
    })
  })
}

Story.create = (props) => {
  return new Promise((resolve, reject) => {
    let query = [
      'CREATE (story:Story {props})',
      'RETURN story',
    ].join('\n')

    let validationErrors = validate(props, Story.VALIDATION_INFO)
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
      if (err) return reject(err)

      let story = new Story(results[0]['story'])
      resolve(story)
    })
  })
}

export default Story
