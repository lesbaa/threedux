import {
  createStore,
  compose,
} from 'redux'
import threeConnect from '../src/three-connect'

const initState = {
  value: 0.0,
}

function cubeReducer(state = initState, action) {
  const {
    payload,
    type,
  } = action
  switch(type) {
    case 'INCREMENT': {
      return {
        value: state.value += 0.1,
      }
    }
    case 'DECREMENT': {
      return {
        value: state.value -= 0.1,
      }
    }
    default: {
      return state
    }
  }
}

const store = createStore(
  cubeReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export const connect = threeConnect(store)

export default store
