import Story from '../../lib/models/story'
import Chai, { expect } from 'chai'
import NeoDB from '../../lib/neo_db'
import clearDB from '../helpers/clear_db'

describe('Story', () => {
  const title = 'The Width of The World'
  const synopsis = 'A brilliant story of misadventures in measurement.'
  const description = 'Have you ever wondered what would happen if you unravelled the...'

  const defaultProps = {
    title: title,
    synopsis: synopsis,
    description: description
  }

  const createStory = (props, callback) => {
    let storyProps = Object.assign({}, defaultProps, props)
    Story.create(storyProps).then((_result) => {
      callback()
    })
  }

  beforeEach((done) => { clearDB(done) })

  describe('static methods', () => {
    describe('.get', () => {
      describe('when the story exists', () => {
        beforeEach((done) => { createStory({}, done) })

        it('returns a Promise that resolves with the story', (done) => {
          Story.get(title).then((story) => {
            expect(story).to.be.an.instanceof(Story)
            expect(story.title).to.eq(title)
            done()
          })
        })
      })

      describe('when the story does not exist', () => {
        it('returns a Promise that rejects with an error', (done) => {
          Story.get(title).then((story) => {}).catch((error) => {
            expect(error).to.be.a('Error')
            expect(error).to.match(/No such story/i)
            done()
          })
        })
      })
    })

    describe('.count', () => {
      beforeEach((done) => {
        createStory('thing1', (err, results) => {
          createStory('thing2', done)
        })
      })

      it('counts the story records', (done) => {
        Story.count().then((count) => {
          expect(count).to.equal(2)
          done()
        })
      })
    })

    describe('.create', () => {
      describe('when creating a story with valid props', () => {
        it('creates a story', (done) => {
          let props = defaultProps

          Story.create(props).then((story) => {
            expect(story).to.be.an.instanceof(Story)
            expect(story.title).to.eq(title)
            expect(story._id).to.exist
            done()
          })
        })
      })

      describe('when creating a story with invalid props', () => {
        it('does not create a story, and rejects', (done) => {
          let props = { title: '2shrt' }

          Story.create(props).then((story) => {
            // nothing
          }).catch((err) => {
            expect(err).to.contain.all.keys(['synopsis', 'description'])
            expect(err.synopsis).to.match(/be blank/)
            expect(err.description).to.match(/be blank/)
            done()
          })
        })
      })
    })
  })
});
