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
const readstream = fs.createReadStream(filePath)
const input = new StreamInput(readstream)
```

## Result output
I. A file (User is able to config the output destination)

```js
const FileOutput = require('htmlseoscan')
const outputPath = '/yourpath/outputfilename' 
const output = new FileOutput(outputPath)
```

II. Node Writable Stream
```js
const fs = require('fs')
const StreamOutput = require('htmlseoscan')
const writestream = fs.createWriteStream(filePath)
const output = new StreamOutput(writestream)
```

III. Console
```js
const fs = require('fs')
const ConsoleOutput = require('htmlseoscan')
const output = new ConsoleOutput()
```


## Pre-defined SEO rules

```js
const htmlCheck = require('htmlseoscan')
const htmlSEOcheck = new htmlCheck()
htmlSEOcheck.setInput(input)
htmlSEOcheck.setOutput(output)
htmlSEOcheck.run().then(function(result){
         htmlSEOcheck.getResult()
})

```

1. Detect if any `<img />` tag without alt attribute
```js
htmlSEOcheck.selectdefaultRule([1])
```


2. Detect if any `<a />` tag without rel attribute
```js
htmlSEOcheck.selectdefaultRule([2])
```

3. In` <head>` tag <br/>
i. Detect if header doesn’t have `<title>` tag <br/>
ii. Detect if header doesn’t have `<meta name=“descriptions” ... />` tag <br/>
iii. Detect if header doesn’t have `<meta name=“keywords” ... />` tag <br/>
```js
htmlSEOcheck.selectdefaultRule([3])
```


4. Detect if there’re more than 15 `<strong>` tag in HTML (15 is a value should be configurable by user)
```js
htmlSEOcheck.selectdefaultRule([4])

// const CheckTagCount = require('htmlseoscan')
// htmlSEOcheck.CustomerRule([new CheckTagCount('', 'strong', 15)])

```

5. Detect if a HTML have more than one `<H1>` tag. 
```js
htmlSEOcheck.selectdefaultRule([5])

// const CheckTagCount = require('htmlseoscan')
// htmlSEOcheck.CustomerRule([new CheckTagCount('', 'h1', 1)])

```


## Example Output
1. Only use the rule 1 and 4.
```js
const { htmlCheck, FileInput, ConsoleOutput} = require('htmlseoscan')
const InputPath = __dirname + '/test.html' // input local file path 
const input = new FileInput(InputPath)
const output = new ConsoleOutput() // ouput in Console.

htmlSEOcheck.setInput(input)
htmlSEOcheck.setOutput(output)
htmlSEOcheck.selectdefaultRule([1, 4])

htmlSEOcheck.run().then(function(result){
         htmlSEOcheck.getResult()
})
```
<img  src="https://raw.githubusercontent.com/EddieYY/htmlSEOscan/master/img/example1.png">


2. Checking `<meta name="robots" />` existing or not?
```js
const { htmlCheck, FileInput, ConsoleOutput, FileOutput, CheckTagNoAttrValu } = require('htmlseoscan')

const InputPath = __dirname + '/test.html' // input local file path 
const input = new FileInput(InputPath)

const output = new ConsoleOutput() // ouput in Console.

const htmlSEOcheck = new htmlCheck(false)
htmlSEOcheck.setInput(input)
htmlSEOcheck.setOutput(output)
//Checking <meta name="robots" /> existing or not
htmlSEOcheck.CustomerRule([new CheckTagNoAttrValue('head', 'meta', 'name', 'robots')])
htmlSEOcheck.run().then(function(result){
         htmlSEOcheck.getResult()
})

//SEO defects found:
//This HTML without <meta name="robots"> tag.
```

3. Showing all of the defects for rules that user apply, following is a simple output demo when a user apply above 5 rules.
```js
const { htmlCheck, FileInput, ConsoleOutput} = require('htmlseoscan')
const InputPath = __dirname + '/test.html' // input local file path 
const input = new FileInput(InputPath)
const output = new ConsoleOutput() // ouput in Console.

htmlSEOcheck.setInput(input)
htmlSEOcheck.setOutput(output)

htmlSEOcheck.run().then(function(result){
         htmlSEOcheck.getResult()
})
```
<img  src="https://raw.githubusercontent.com/EddieYY/htmlSEOscan/master/img/example2.png">


## User can define and use their own rules easily.
Please follow this check rule structure:
```js
const CheckRule  = require('htmlseoscan')

//define new check rule
class NewCheckRule extends CheckRule {
	constructor(rootag, parameters...) {
		super(rootag)
	     	...
	   }

	check() {
		// check rule
	 	this.isCheck = true // or false
	   }

	err() {
		return !this.isCheck ? "Error message" : ""
	} 
}
```
Then, add this rule in htmlCheck function.<br/> 
ex:`htmlSEOcheck.CustomerRule([new NewCheckRule(rootag, parameters...)])`

