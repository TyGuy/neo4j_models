import Glue from 'glue'
import Manifest from './manifest'

const composeOptions = {
  relativeTo: __dirname
}

export default Glue.compose.bind(Glue, Manifest.get('/'), composeOptions);
