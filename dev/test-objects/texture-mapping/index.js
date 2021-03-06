import {
  CubeGeometry,
  ShaderMaterial,
  Mesh,
  TextureLoader,
  RepeatWrapping,
} from 'three'
import {
  bindActionCreators,
  compose,
} from 'redux'
import {
  Style3D,
} from '../../../src/threedux/Style3D'
import { connect } from '../../store'
import shader from './shader'
import {
  incrementAction,
  decrementAction,
} from '../../actions'

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
    transitionDuration: 3000,
    transitionEasingFunction: 'linear',
    transitionProperties: [
      'uniforms',
    ], 
  },
  animation: o => { o.uniforms.uTime.value += 0.01 },
})

const enhancedMaterial = enhance(material)

enhancedMaterial.classList.add(style)

const texture = new TextureLoader().load('./assets/texture-map_2.png')

enhancedMaterial.uniforms.uSampler.value = texture
enhancedMaterial.uniforms.uSampler.value.wrapS = RepeatWrapping
enhancedMaterial.uniforms.uSampler.value.wrapT = RepeatWrapping

// enhancedMaterial.tickCallback = (o) => { o.uniforms.uTime.value += 0.1 }

window.unifs = enhancedMaterial
function mapStateToObj3D ({
  value,
}, obj3d) {
  obj3d.setState({
    uniforms: {
      uVary: value,
    },
  })
}

function mapDispatchToObj3D (dispatch) {
  return bindActionCreators({
    incrementAction,
    decrementAction,
  }, dispatch)
}

export default enhancedMaterial
