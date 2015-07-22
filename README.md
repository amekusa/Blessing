# [Blessing](http://amekusa.github.io/Blessing/) The Stylesheet Library
Intuitive and highly adaptive stylesheet library written in Less

## Concentrate to code the design
You know there are many headaches and pitfalls in CSS.  
Why are you still bothered by such random CSS things to implement your nice design?  
What you should code is just your **design intent** and is not asterisk-hack, vendor-prefixes or clearfixes.

## You type less, the library does far more
Speed is important. You don’t need to be polite at the expense of it.  
Blessing provides lots of short, elegant but also readable mixins.  
Most of them are not mere kinds of syntactic sugar but like an agent who understands your **design intent** and translate into effective CSS codes.  
[» examples](http://amekusa.github.io/Blessing/section-mixins.html)

---

## How to use
Blessing assumes 2 use cases:

### 1. As a CSS library (easier, lightly use)
Blessing has many useful CSS class definitions. [» examples](http://amekusa.github.io/Blessing/section-classes.html)  
You can use them by putting the following line in `<head>` of your HTML.

```html
<link rel="stylesheet" href="path/to/blessing.css">
```

Alternatively, you can also use `@import` from your CSS file.

```css
@import "path/to/blessing.css";
```

#### Customise
To get a customised CSS, edit variables defined in `src/variables.config.less` and compile `src/main.less` with your favorite [Less compiler](http://lesscss.org/usage/#online-less-compilers).

### 2. As a [Less](http://lesscss.org/) library (advanced use)

```less
@import "path/to/blessing/src/main.less";
```

If you don’t want classes but mixins only, add `(reference)` as import option.

```less
@import (reference) "path/to/blessing/src/main.less";
```

## Installation
You can install Blessing via [bower.io](http://bower.io/).  
Type the following shell command in your project directory.

```sh
bower install --save-dev blessing
```

---

:blue_book: For more details, [see documentation.](http://amekusa.github.io/Blessing/)

## Need Contribution!
Blessing is still work in progress.  
So think free to fork and pull-request!  
Ideas, opinions, or donations are also welcomed.  

Additionally, I'm not a native English speaker.
So correcting my bad English in this README or comments on `.less` source files is greatly appreciated!

Thanks.

Satoshi Soma a.k.a. amekusa
