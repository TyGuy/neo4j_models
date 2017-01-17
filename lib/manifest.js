import Confidence from 'confidence'
import Config from './config'

const criteria = {
  env: process.env.NODE_ENV
};

const manifest = {
  $meta: 'Is this thing on?',
  server: {
    debug: {
      request: ['error']
    },
  },
  connections: [{
    port: Config.get('/port/web'),
    labels: ['web'],
    host: 'localhost'
  }],
  registrations: [
    {
      plugin: './routes'
    },
  ]
};

const store = new Confidence.Store(manifest)

const get = (key) => { return store.get(key, criteria) }
const meta = (key) => { return store.meta(key, criteria) }

export default { get: get, meta: meta }
