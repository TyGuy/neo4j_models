import NeoDB from '../neo_db'
import validate from 'validate.js'

class NeoNode {
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
}

const stringifyProps = (props) => {
  let criteria = Object.keys(props).map((prop) => {
    return `${prop}: "${props[prop]}"`
  })

  return `{${criteria.join(', ')}}`
}

NeoNode.getNodesByProps = (label, props) => {

  return new Promise((resolve, reject) => {
    NeoDB.cypher({
      query: `MATCH (n:${label} ${stringifyProps(props)}) RETURN n`,
      params: {}
    }, (err, results) => {
      if (err) return reject(err)

      if (!results.length) {
        let err = new Error(`No such ${label} found (${stringifyProps(props)})`)
        return reject(err)
      }

      resolve(results)
    })
  })
}

NeoNode.createNode = (label, props, schema) => {
  return new Promise((resolve, reject) => {
    if (!!schema && Object.keys(schema).length !== 0) {
      let validationErrors = validate(props, schema)

      if (validationErrors) {
        return reject(validationErrors)
      }
    }

    let query = [
      `CREATE (n:${label} {props})`,
      'RETURN n',
    ].join('\n')

    let params = { props: props }

    NeoDB.cypher({ query: query, params: params}, (err, results) => {
      if (err) return reject(err)

      resolve(results[0]['n'])
    })
  })
}

NeoNode.count = (label, props) => {
  return new Promise((resolve, reject) => {
    NeoDB.cypher({
      query: `MATCH (n:${label} ${stringifyProps(props)}) RETURN count(n) as count`
    }, (err, results) => {
      if (err) return reject(err)

      resolve(results[0]['count'])
    })
  })
}

export default NeoNode
