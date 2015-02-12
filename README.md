# “Blessing” the CSS library

## How to use
Blessing assumes 2 use cases:

### 1. As CSS class library (easier, lightly use)
Blessing has many useful CSS class definitions.  
You can use them by putting the following line in `<head>` of your HTML.

```html
<link rel="stylesheet" href="path/to/blessing.css" />
```

Alternatively, you can also use `@import` from your CSS file.

```css
@import "path/to/blessing.css";
```

#### Customise
To get a customised CSS, edit variables defined in `src/variables.config.less` and compile `src/main.less` with your favorite [Less compiler](http://lesscss.org/usage/#online-less-compilers).

### 2. As [Less](http://lesscss.org/) library (advanced use)

```less
@import "path/to/blessing/src/main.less";
```

If you don't want classes but mixins only, add `(reference)` as import option.

```less
@import (reference) "path/to/blessing/src/main.less";
```

## Installation
```js
"dependencies": {
	"blessing": "https://amekusa@bitbucket.org/amekusa/blessing.git#dev"
}
```

## Need contribution!
Blessing is still a work in progress.  
So think free to fork and pull-request!  
Ideas, opinions, or donations are also welcomed.  

Additionally, I'm not a native english speaker.
So correcting english in this README or comments on `.less` source files is greatly appreciated!

Thanks.
