# htmlSEOscan
A Node.js package to let user can use this package to scan a HTML file and show all of the SEO defects. 

## A NPM module
`npm install htmlseoscan`

The detail see the test.js file.

```js
const { htmlCheck, FileInput, StreamInput, ConsoleOutput, FileOutput, StreamOutput } = require('htmlseoscan')
```


## HTML input
I. A HTML file (User is able to config the input path)

```js
const FileInput = require('htmlseoscan')
const InputPath = '/yourpath/filename' // input local file path 
const input = new FileInput(InputPath)
```

II. Node Readable Stream

```js
const fs = require('fs')
const StreamInput = require('htmlseoscan')
const stream = fs.createReadStream(filePath)
const input = new StreamInput(stream)
```

## Result output
I. A file (User is able to config the output destination)

```js
const FileOutput = require('htmlseoscan')
const outputPath = '/yourpath/outputfilename' 
const output = new FileOutput(outputPath)
```

II. Node Writable Stream


III. Console




## Pre-defined SEO rules
1. Detect if any <img /> tag without alt attribute

```js
const {CheckTagNoAttr} = require('htmlseoscan')
CheckTagNoAttr('', 'img', 'alt')
```




2. Detect if any <a /> tag without rel attribute
3. In <head> tag
i. Detect if header doesn’t have <title> tag
ii. Detect if header doesn’t have <meta name=“descriptions” ... /> tag
iii. Detect if header doesn’t have <meta name=“keywords” ... /> tag
4. Detect if there’re more than 15 <strong> tag in HTML (15 is a value should be configurable by user)
5. Detect if a HTML have more than one <H1> tag. 
