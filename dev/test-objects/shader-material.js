import {
  CubeGeometry,
  ShaderMaterial,
  Mesh,
  TextureLoader,
} from 'three'
import {
  bindActionCreators,
  compose,
} from 'redux'
import {
  Style3D,
} from '../../src/StyleClassList'
import { connect } from '../store'
import shader from './test-shader-material'
import {
  incrementAction,
  decrementAction,
} from '../actions'

const material = new ShaderMaterial(shader)
const connectToRedux = connect(
  mapStateToObj3D,
  mapDispatchToObj3D,   
)

const enhance = compose(
  connectToRedux,
)

const style = new Style3D({
  transition: {
    transitionDuration: 1000,
    transitionEasingFunction: 'elasticOut',
    transitionProperties: [
      'uniforms',
    ], 
  },
})

const enhancedMaterial = enhance(material)

enhancedMaterial.classList.add(style)

const texture = new TextureLoader().load('./assets/cube-map.png')

enhancedMaterial.uniforms.uSampler.value = texture

window.unifs = enhancedMaterial
function mapStateToObj3D ({
  value,
}) {
  return {
    uniforms: {
      uTime: value,
    },
  }
}

function mapDispatchToObj3D (dispatch) {
  return bindActionCreators({
    incrementAction,
    decrementAction,
  }, dispatch)
}

export default enhancedMaterial
