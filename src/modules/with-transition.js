import * as EasingFunctions from './easing-funcs'
import cloneObject from './clone-object'
import clone3DAttributes from './clone-3d-attributes'
import applyStateToObj3d from './apply-state-to-obj3d'
import tweenState from './tween-state'

const clone3DAttr = clone3DAttributes([
  'position',
  'rotation',
  'scale',
  'color',
  'intensity',
  'morphTargetInfluences',
  'uniforms',
  'attributes',
  'refractionRatio',
  'reflectivity',
])

/**
 * TODO
 * "css-ify" the API, classList add etc.
 * general tidy up refactor
 * fix problem with timing of transitions getting reversed half way through
 */

const withTransition = ({
  duration = 1000,
  delay,
  to = {},
  from = {},
  easingFunction = 'linear',
  initAtFromPosition = true,
  debug = false,
  primer = null,
  tickCallback = null,
}) => subject => {

  const obj3d = primer
    ? primer(subject) 
    : subject

  obj3d.debug = debug
  if (debug) {
    window.tweensDebug = window.window.tweens || []
    window.tweensDebug.push(obj3d)
  }

  obj3d.state = { isActive: false }
  obj3d.oldState = { isActive: false }

  obj3d.setState = setState.bind(obj3d)
  obj3d.tick = tick.bind(obj3d)
  obj3d.tickCallback = tickCallback
  const restingState = clone3DAttr(from)
  const activeState = clone3DAttr(to)
  const totalSteps = 60 * (duration / 1000)
  const stepSize = 1 / totalSteps
  obj3d.tween = {
    reset: reset.bind(obj3d),
    handleStateChange: handleStateChange.bind(obj3d),
    update: update.bind(obj3d),
    duration,
    delay,
    shouldTransition: false,
    currentState: clone3DAttr(restingState),
    targetState: clone3DAttr(activeState),
    restingState,
    activeState,
    totalSteps,
    stepSize,
    stepsTaken: 0,
    k: 0,
  }

  if (initAtFromPosition) {
    applyStateToObj3d({
      obj3d,
      state: obj3d.tween.restingState,
    })
  }

  obj3d.logging = {
    log: {},
    t1: 0,
    clearLog: () => { obj3d.logging.log = {} },
  }
  
  if (typeof easingFunction === 'function') {
    obj3d.tween.easingFunction = easingFunction
  } else {
    const func = EasingFunctions[easingFunction]
    
    obj3d.tween.easingFunction = func || EasingFunctions.linear
    if (!func) console.info('No easing function found with that name, defaulting to \'linear\'')
  }
    
  obj3d.matrixAutoUpdate = true
  return obj3d
}

function tick() {
  if (this.tween.k > 1) {
    this.tween.reset()
    return
  }
  
  if (this.tween.shouldTransition) {
    this.tween.update()
  }

  if (this.state.isActive !== this.oldState.isActive) {
    this.tween.handleStateChange()
  }

  if (this.tickCallback) {
    this.tickCallback(this)
  }

}

function reset() {
  applyStateToObj3d({
    obj3d: this,
    state: this.tween.targetState,
  })

  this.tween.shouldTransition = false
  this.tween.k = 0
  this.tween.stepsTaken = 0
  this.dispatchEvent({
    type: 'transitionEnd',
    target: this,
  })
}

function update() {
  const alpha = this.tween.easingFunction(this.tween.k)
  const state = tweenState({
    alpha,
    from: this.tween.currentState,
    to: this.tween.targetState,
    debug: this.debug,
  })

  applyStateToObj3d({
    obj3d: this,
    state,
  })

  if (this.debug) this.logging.log[performance.now()] = {
    current: this.tween.currentState,
    target: this.tween.targetState,
    actual: this,
    k: this.tween.k,
    t: performance.now(),
    alpha,
  }

  this.tween.k += this.tween.stepSize
  this.tween.stepsTaken += 1
}

function handleStateChange() {
  
  this.oldState = cloneObject(this.state)
  
  this.tween.currentState = clone3DAttr(this)
  
  this.tween.targetState = clone3DAttr(
    this.state.isActive
      ? this.tween.activeState
      : this.tween.restingState
  )

  if (this.tween.delay) {
    clearTimeout(this.tween.delayTimeout)
    this.tween.delayTimeout = setTimeout(
      () => {
        
        this.tween.shouldTransition = true
        if (this.isEventful) {
          this.dispatchEvent({
            type: 'transitionStart',
            target: this,
          })
        }
      },
      this.tween.delay
    )
  } else {
    this.tween.shouldTransition = true
    if (this.isEventful) {    
      this.dispatchEvent({
        type: 'transitionStart',
        target: this,
      })
    }
  }

  if (this.tween.k > 0) {
    this.tween.k = 0
  }

  const alpha = this.tween.easingFunction(this.tween.k)
  
  if (this.debug) this.logging.log[`x-${performance.now()}`] = {
    current: this.tween.currentState,
    target: this.tween.targetState,
    actual: this.uniforms,
    k: this.tween.k,
    t: performance.now(),
    alpha,
  }
  return
}

function setState(update) {
  this.oldState = cloneObject(this.state)
  this.state = {
    ...this.state,
    ...update,
  }
}

export default withTransition
