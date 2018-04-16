import {
  createStore,
} from 'redux'
import threeConnect from '../src/three-connect'
import sampleReducer from './reducers/sample-reducer'

const store = createStore(
  sampleReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export const connect = threeConnect(store)

export default store
