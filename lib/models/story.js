import NeoDB from '../neo_db'
import NeoNode from './neo_node'

class Story extends NeoNode {
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
    NeoNode.getNodesByProps('Story', {title: title}).then((results) => {

      let story = new Story(results[0]['n'])
      resolve(story)

    }).catch((err) => { reject(err) })
  })
}

Story.count = () => {
  return NeoNode.count('Story', {})
}

Story.create = (props) => {
  return new Promise((resolve, reject) => {
    NeoNode.createNode('Story', props, Story.VALIDATION_INFO).then((rawNode) => {
      let story = new Story(rawNode)
      resolve(story)
    }).catch((err) => {
      reject(err)
    })
  })
}

export default Story
