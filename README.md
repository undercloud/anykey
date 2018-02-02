# Edito
Web-based code editor

![Alt text](https://raw.githubusercontent.com/undercloud/edito/promo.png)

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
* gotoLine(line) - move cursor to selected line
* highlightErrorLine(line) - set error code line
* clearErrorLine() - unset error highlight
* setValue(value) - set editor value
* getValue() - get editor value
* readonly(flag) - set read only mode
* getEditor() - get dom editor
