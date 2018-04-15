import {
  createStore,
} from 'redux'

const initState = {
  rotation: {
    x: 0,
    y: 0,
    z: 0,
  },
}

function cubeReducer(state = initState, action) {
  const {
    payload,
    type,
  } = action
  switch(type) {
    case 'TURN': {
      return {
        rotation: {
          x: 1,
          y: 1,
          z: 1,
        },
      }
    }
    default: {
      return state
    }
  }
}

export default createStore(
  cubeReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)