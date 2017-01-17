import Confidence from 'confidence'
import Dotenv from 'dotenv'

Dotenv.config({ silent: true });

const criteria = {
    env: process.env.NODE_ENV
};

const config = {
    $meta: 'This file configures the thing.',
    projectName: 'NeoAsFuck',
    port: {
        web: {
            $filter: 'env',
            test: 9090,
            production: process.env.PORT,
            $default: 9000
        }
    },
};

const store = new Confidence.Store(config);

const get = (key) => { return store.get(key, criteria) }
const meta = (key) => { return store.meta(key, criteria) }

export default { get: get, meta: meta }
