Threedux
========
Three.js bindings for [redux](https://redux.js.org/)

### Overview

This is an attempt to bring state management into three.js for the purposes of fascilitating 3D UI creation with three. It's still a work in progress, don't use it, it's not even, like in alpha yet.

### Wait, redux and three? what? Are you crazy!?

Yes.

### Common gotchas

 - Properties changed via three-dom will always overwrite direct manipulations in the render loop.  There is no 'specicifity' like there is in CSS
