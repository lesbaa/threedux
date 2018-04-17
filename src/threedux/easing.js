/*
* Easing Functions - inspired from http://gizma.com/easing/
* only considering the t value for the range [0, 1] => [0, 1]
*/
// no easing, no acceleration

export const linear = t => t

export const easeInQuad = t => t*t

export const easeOutQuad = t => t*(2-t)

export const easeInOutQuad = t => t<.5 ? 2*t*t : -1+(4-2*t)*t

export const easeInCubic = t => t*t*t

export const easeOutCubic = t => (--t)*t*t+1

export const easeInOutCubic = t => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1

export const easeInQuart = t => t*t*t*t

export const easeOutQuart = t => 1-(--t)*t*t*t

export const easeInOutQuart = t => t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t

export const easeInQuint = t => t*t*t*t*t

export const easeOutQuint = t => 1+(--t)*t*t*t*t

export const easeInOutQuint = t => t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t

export const bounceOut = (k) => {

  if (k < (1 / 2.75)) {
    return 7.5625 * k * k;
  } else if (k < (2 / 2.75)) {
    return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
  } else if (k < (2.5 / 2.75)) {
    return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
  } else {
    return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
  }

}

export const bounceIn = k => {

  return 1 - bounceOut(1 - k);

}

export const bounceInOut = (k) => {

  if (k < 0.5) {
    return bounceIn(k * 2) * 0.5;
  }

  return bounceOut(k * 2 - 1) * 0.5 + 0.5;

}

export const elasticIn = (t) => {

  if (t === 0) {
    return 0;
  }

  if (t === 1) {
    return 1;
  }

  return -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI);

}

export const elasticOut = (k) => {

  if (k === 0) {
    return 0;
  }

  if (k === 1) {
    return 1;
  }

  return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;

}


export const elasticInOut = (k) => {

  if (k === 0) {
    return 0;
  }

  if (k === 1) {
    return 1;
  }

  k *= 2;

  if (k < 1) {
    return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
  }

  return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;

}
