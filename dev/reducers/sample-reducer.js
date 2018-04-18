const initState = {
  value: 0.0,
}

export default function sample(state = initState, action) {
  const {
    payload,
    type,
  } = action
  switch(type) {
    case 'INCREMENT': {
      return {
        value: state.value += 0.01,
      }
    }
    case 'DECREMENT': {
      return {
        value: state.value -= 0.01,
      }
    }
    default: {
      return state
    }
  }
}
