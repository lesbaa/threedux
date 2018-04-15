import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
} from 'three'

export default function setUpThree({
  targetSelector = '#target',
  targetEl,
  trails = false,
} = {}) {
  const scene = new Scene()
  const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )

  scene.add(camera)

  const renderer = new WebGLRenderer({
    antialias: true,
  })

  renderer.toggleTrails = (trailsSetting) => {
    renderer.autoClearColor = trailsSetting
    renderer.autoClear = trailsSetting
    renderer.preserveDrawingBuffer = !trailsSetting
  }
  renderer.toggleTrails(trails)

  const target = targetEl
    ? targetEl
    : document.querySelector(targetSelector)

  renderer.setSize( window.innerWidth, window.innerHeight )

  target.appendChild( renderer.domElement )

  return {
    scene,
    renderer,
    camera,
  }
} 
