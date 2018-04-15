import * as EasingFunctions from './modules/easing-funcs'
import cloneObject from './modules/clone-object'
import clone3DAttributes from './modules/clone-3d-attributes'
import applyStateToObj3d from './modules/apply-state-to-obj3d'
import tweenState from './modules/tween-state'
import {
  StyleClass,
  StyleClassList,
} from './three-dom'

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

const withStateTransition = ({
  tickCallback,
}) => inputObj => {
  const subject = inputObj.clone()
  
  subject.handleStateChange = handleStateChange.bind(subject)
  subject.classList = new StyleClassList(subject.handleStateChange, clone3DAttr(subject))
  subject.getComputedStyle = () => subject.classList.computedStyle
  
  subject.tween = {}
  subject.tick = tick.bind(subject)
  subject.tickCallback = tickCallback

  const {
    transition,
  } = subject.getComputedStyle()

  const {
    transitionDuration: duration,
    transitionDelay: delay,
    transitionEasingFunction: easingFunction,
  } = transition || {}

  const totalSteps = 60 * (duration / 1000)
  const stepSize = 1 / totalSteps

  subject.tween = {
    hasTransition: Boolean(transition),
    reset: reset.bind(this),
    update: update.bind(this),
    duration,
    delay,
    shouldTransition: false,
    totalSteps,
    stepSize,
    stepsTaken: 0,
    k: 0,
  }

  if (typeof easingFunction === 'function') {
    subject.tween.easingFunction = easingFunction
  } else {
    const func = EasingFunctions[easingFunction]
    
    subject.tween.easingFunction = func || EasingFunctions.linear
    if (!func) console.warn('No easing function found with that name, defaulting to \'linear\'')
  }

  return subject
}

function handleStateChange() {
  const state = this.getComputedStyle()
  console.log('state change', state)
  if (!state.transition) {
    applyStateToObj3d({
      obj3d: this,
      state,
    })
    return
  }

  this.tween.currentState = clone3DAttr(this)
  
  this.tween.targetState = clone3DAttr(state)

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
}

function tick() {
  if (this.tween.k > 1) {
    this.tween.reset()
    return
  }
  
  if (this.tween.shouldTransition && this.tween.hasTransition) {
    this.tween.update()
  }

  if (this.tickCallback) {
    this.tickCallback(this)
  }
} 

function reset() {
  this.tween.shouldTransition = false
  this.tween.k = 0
  this.tween.stepsTaken = 0
  this.dispatchEvent({
    type: 'transitionEnd',
    target: this,
  })

  applyStateToObj3d({
    obj3d: this,
    state: this.getComputedStyle(),
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

function getTransitionParameters(transition) {
  const {
    duration,
    easingFunction,
    delay = 0,
    properties,
  } = transition
}

export default withStateTransition
