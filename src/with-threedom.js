import {
  Object3D,
} from 'three'
import * as EasingFunctions from './modules/easing-funcs'
import cloneObject from './modules/clone-object'
import clone3DAttributes from './modules/clone-3d-attributes'
import applyStateToObj3d from './modules/apply-state-to-obj3d'
import tweenState from './modules/tween-state'
import {
  Style3DList,
} from './StyleClassList'

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

const withThreedom = inputObj => {
  const subject = inputObj.clone()
  
  subject.handleClassListChange = handleClassListChange.bind(subject)
  subject.handleStateChange = handleStateChange.bind(subject) 
  subject.classList = new Style3DList(subject.handleClassListChange, clone3DAttr(subject))
  
  subject.getComputedStyle = () => subject.classList.computedStyle
  
  subject.tween = {}
  subject.tick = tick.bind(subject)
  subject.setState = setState.bind(subject)

  const computedStyles = subject.getComputedStyle()
  subject.state = { ...computedStyles }
  subject.previousState = { ...computedStyles }

  subject.tween = {
    reset: reset.bind(subject),
    update: update.bind(subject),
    updateTransitionParams: updateTransitionParams.bind(subject),
    currentState: subject.getComputedStyle(),
    targetState: subject.getComputedStyle(),
    shouldTransition: false,
    stepsTaken: 0,
    k: 0,
  }
  return subject
}

function handleClassListChange() {
  const styles = this.getComputedStyle()
  this.tween.updateTransitionParams(styles.transition)
  
  this.setState(styles)

}

function tick() {
  if (this.tween.k > 1) {
    this.tween.reset(true)
    return
  }
  
  if (this.tween.shouldTransition) {
    this.tween.update()
  }

  if (typeof this.tickCallback === 'function') {
    this.tickCallback(this)
  }

  return
} 

function reset(apply = false) {
  this.tween.shouldTransition = false
  this.tween.k = 0
  this.tween.stepsTaken = 0
  
  if (apply) {
    applyStateToObj3d({
      obj3d: this,
      state: clone3DAttr(this.state),
    })
    this.dispatchEvent({
      type: 'transitionEnd',
      target: this,
    })
  }
}

function update() {
  const alpha = this.tween.easingFunction(this.tween.k)
  const state = tweenState({
    properties: this.tween.transitionProperties,
    alpha,
    from: this.tween.currentState,
    to: this.tween.targetState,
  })

  applyStateToObj3d({
    obj3d: this,
    state,
  })

  const nonTransitioningState = removeProperties({
    obj: this.tween.targetState,
    props: this.tween.transitionProperties,
  })

  if (Object.keys(nonTransitioningState).length) {
    applyStateToObj3d({
      obj3d: this,
      state: nonTransitioningState,
    })
  }

  this.tween.k += this.tween.stepSize
  this.tween.stepsTaken += 1
  return
}

function setState(update, cb) {  
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
  if (this.tween.hasTransition) {
    this.tween.updateTransitionParams(state.transition)
    this.tween.reset()
    
    this.tween.targetState = this.state

    this.tween.currentState = clone3DAttr(this)

    this.tween.shouldTransition = true
    return
  }

  applyStateToObj3d({
    obj3d: this,
    state,
  })

  return
}

function updateTransitionParams(transition = {}) {
  if (!Object.keys(transition).length) {
    this.tween.hasTransition = false
    return
  }
  
  this.tween.transitionParams = {
    ...this.tween.transitionParams,
    ...transition,
  }

  const {
    transitionDuration = 0,
    transitionEasingFunction = 'linear',
    transitionProperties,
  } = this.tween.transitionParams

  this.tween.hasTransition = true
  
  const totalSteps = 60 * (transitionDuration / 1000)
  const stepSize = 1 / totalSteps
  
  this.tween.totalSteps = totalSteps || 1
  this.tween.stepSize = stepSize
  this.tween.transitionProperties = transitionProperties
  
  if (typeof transitionEasingFunction === 'function') {
    this.tween.easingFunction = transitionEasingFunction
  } else {
    const func = EasingFunctions[transitionEasingFunction]
    
    this.tween.easingFunction = func || EasingFunctions.linear
    if (!func) console.warn('No easing function found with that name, defaulting to \'linear\'')
  }
}

export default withThreedom

function removeProperties({
  obj,
  props,
}) {
  const newObj = {}
  for (const key in obj) {
    if (props.includes(key)) continue
    newObj[key] = obj[key]
  }
  return newObj
}