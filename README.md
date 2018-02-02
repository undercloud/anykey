# Edito
Web code editor

## Installation
`npm install edito`

## Usage
```js
var jse = new Edito({
    mount: '#js-editor',
    syntax: 'js'
})
```

See `sandbox/index.html` for example

## Options
* mount - (string) dom selector
* syntax - (string) e.g. 'js'
* spellcheck - (boolean) default false
* tabSize - (intger) tab size, default 4
* usingSpaces - (boolean) useng spaces instead of tabs, default false
* theme - (string) set to 'dark', if need dark theme

## Methods
* gotoLine(line)
* highlightErrorLine(line)
* clearErrorLine()
* setValue(value)
* getValue()
* readonly(flag)
* getEditor()