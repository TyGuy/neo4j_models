import NeoNode from '../../lib/models/neo_node'
import Chai, { expect } from 'chai'
import NeoDB from '../../lib/neo_db'
import clearDB from '../helpers/clear_db'

describe('NeoNode', () => {
  let label = 'Ass'
  let propName = 'name'
  let propVal = 'wise'

  beforeEach((done) => { clearDB(done) })

  describe('getNodesByProps', () => {
    const props = () => {
      let _props = {}
      _props[propName] = propVal
      return _props
    }

    beforeEach((done) => {
      NeoNode.createNode(label, props()).then((result) => {
        NeoNode.createNode(label, {name: 'something else'}).then((result2) => {
          done()
        })
      })
    })

    it('returns a Promise with the raw results', (done) => {
      NeoNode.getNodesByProps(label, props()).then((results) => {
        expect(results.length).to.equal(1)

        let rawNode = results[0]['n']
        expect(rawNode.properties[propName]).to.equal(propVal)

        done()
      })
    })
  })

  describe('createNode', () => {
    it('creates a node with the given label and properties', (done) => {
      NeoNode.createNode('Thing', {thing1: 'one', thing2: 'two'}).then((result) => {

        // use raw query to ensure we don't have a circular test pattern
        NeoDB.cypher({
          query: 'MATCH (n:Thing {thing1: "one"}) RETURN n'
        }, (err, results) => {
          expect(results.length).to.equal(1)
          let properties = results[0]['n'].properties
          expect(properties).to.contain.all.keys(['thing1', 'thing2'])
          expect(properties.thing1).to.equal('one')
          expect(properties.thing2).to.equal('two')
          done()
        })
      })
    })
  })
})
