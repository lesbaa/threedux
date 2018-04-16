export class StyleClassList {
  // TODO add getter for the classList
  constructor(onUpdate, defaultStyle = {}, classList = []) {
    this.classList = classList
    this.computedStyle = defaultStyle
    this.defaultStyle = defaultStyle
    this.onUpdate = onUpdate
  }

  add = (style3D) => {
    this.classList.push(style3D)
    this.computeStyle()
    this.onUpdate()
  }

  remove = (style3D) => {
    if (typeof style3D !== 'string') {
      const index = this.classList.indexOf(style3D)
      this.classList.splice(index, 1)
    }
    if (style3D.name) {
      this.classList.filter(({ name }) => name !== style3D.name)
    }
    this.computeStyle()
    this.onUpdate()
  }

  toggle = (style3D) => {
    if (this.classList.includes(style3D)) {
      console.log('class removed!')
      this.remove(style3D)
    } else {
      console.log('class added!')
      this.add(style3D)
    }
  }

  includes = (style3D) => {
    return this.classList.includes(style3D)
  }

  computeStyle = () => {
    this.computedStyle = {
      ...this.defaultStyle,
    }
    for (const styleIndex in this.classList) {
      const style = this.classList[styleIndex]
      this.computedStyle = {
        ...this.computedStyle,
        ...style.props,
      }
    }
  }

  computedStyle = {}
}

export class StyleClass {
  constructor(properties) {
    this.props = {
      ...properties,
    }
  }
}