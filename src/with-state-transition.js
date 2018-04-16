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
  
  subject.handleClassListChange = handleClassListChange.bind(subject)
  subject.handleStateChange = handleStateChange.bind(subject)
  subject.classList = new StyleClassList(subject.handleClassListChange, clone3DAttr(subject))
  
  subject.getComputedStyle = () => subject.classList.computedStyle
  
  subject.tween = {}
  subject.tick = tick.bind(subject)
  subject.setState = setState.bind(subject)
  subject.tickCallback = tickCallback

  const computedStyles = subject.getComputedStyle()
  subject.state = { ...computedStyles }
  subject.previousState = { ...computedStyles }

  subject.tween = {
    reset: reset.bind(subject),
    update: update.bind(subject),
    shouldTransition: false,
    stepsTaken: 0,
    k: 0,
  }

  window.m = subject

  return subject
}

function handleClassListChange() {
  const styles = this.getComputedStyle()
  this.setState(styles)
}

function tick() {
  if (this.tween.k > 1) {
    this.tween.reset()
    return
  }
  
  if (this.tween.shouldTransition) {
    this.tween.update()
  }

  if (this.tickCallback) {
    this.tickCallback(this)
  }
} 

function reset() {
  console.log('reset')
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
  console.log('update')  
  const alpha = this.tween.easingFunction(this.tween.k)
  const state = tweenState({
    alpha,
    from: this.previousState,
    to: this.state,
  })

  applyStateToObj3d({
    obj3d: this,
    state,
  })

  this.tween.k += this.tween.stepSize
  this.tween.stepsTaken += 1
}

function setState(update, cb) {
  console.log('setState')
  
  this.previousState = {
    ...this.state,
  }

  this.state = {
    ...this.state,
    ...update,
  }

  if (this.state != this.previousState) {
    this.handleStateChange(this.state)
    cb && cb(this.state, this.previousState)
  }
}

function handleStateChange(state) {
  console.log('handlestatechange')
  if (!state.transition) {
    applyStateToObj3d({
      obj3d: this,
      state,
    })
    return
  }

  const {
    transitionDuration = 0,
    transitionEasingFunction = 'linear',
  } = state.transition || {}
  
  const totalSteps = 60 * (transitionDuration / 1000)
  const stepSize = 1 / totalSteps
  
  this.tween.totalSteps = totalSteps || 1
  this.tween.stepSize = stepSize

  if (typeof transitionEasingFunction === 'function') {
    this.tween.easingFunction = transitionEasingFunction
  } else {
    const func = EasingFunctions[transitionEasingFunction]
    
    this.tween.easingFunction = func || EasingFunctions.linear
    if (!func) console.warn('No easing function found with that name, defaulting to \'linear\'')
  }

  this.tween.shouldTransition = true

}

export default withStateTransition
