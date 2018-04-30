//'use strict'
const fs = require('fs')
const cheerio = require('cheerio')


//read html local file 
class FileInput {
	constructor(path) {
		this.path = path
	}
	readFile() {
		const D = new Promise((resolve, reject) => {
			fs.readFile(this.path, 'utf8', (err, data) => {
				if (err) return reject(err)
				resolve(data)
			})
		})
		return D
	}
	async read() {
		this.data = await this.readFile(this.path)
		return this.data
	}
}

//
//
class StreamInput {
	constructor(stream) {
		this.stream = stream
	}
	readStream() {
		return new Promise((resolve, reject) => {
			this.stream.on('data', (chunk) => {
				this.data += chunk
			})
			this.stream.on('error', (err) => {
				reject(err)
			})
			this.stream.on('end', () => {
				resolve()
			})
		})
	}
	async read() {
		await this.readStream()
		return this.data
	}
}




/*define check rule */
class CheckRule {
	constructor(rootag) {
		this.root = rootag ? rootag : "html"
		this.dom = null
		this.isCheck = false
	}
	setDom(dom) {
		this.dom = dom
		//console.log(this.dom);
		}
	check() {}
	err() {}
}


class CheckTagNoAttr extends CheckRule {
	constructor(rootag, tag, attr) {
		super(rootag)
		this.tag = tag
		this.attr = attr
	}
	check() {
		const $elem = this.dom(`${this.root} ${this.tag}:not([${this.attr}])`)
		this.total = $elem.length
		this.isCheck = this.total < 1
	}
	err() {
		return !this.isCheck ? "There are " + this.total + " <"+ this.tag + ">" + " tag without " + this.attr + " attribute." : ""
	}
}


//Check some Tag in root tag (ex. <header> tag doesn’t have <title> tag)
class CheckExistTag extends CheckRule {
	constructor(rootag, tag) {
		super(rootag)
		this.tag = tag
	}
	check() {
		this.isCheck = this.dom(`${this.root} ${this.tag}`).length > 0
	  	//console.log(this.dom.html()
	}
	err() {
		return !this.isCheck ? "This HTML without " + "<" + this.tag + "> tag." : ""
	}
}


class CheckTagNoAttrValue extends CheckRule {
	constructor(rootag, tag, attr, value) {
		super(rootag)
		this.tag = tag
		this.attr = attr
		this.value = value
	}
	check() {
		this.isCheck = this.dom(`${this.root} ${this.tag}[${this.attr}*=${this.value}]`).length > 0
	}
	err() {
		return !this.isCheck ? "This HTML without " + "<" + this.tag + " " +  this.attr + "=" +  '"' + this.value + '"' + "> tag." : ""
	}
}


class CheckTagCount extends CheckRule {
	constructor(rootag, tag, count) {
		super(rootag)
		this.tag = tag
		this.count = count
	}
	check() {
		this.isCheck = this.dom(`${this.root} ${this.tag}`).length <= this.count
	}
	err() {
		return !this.isCheck ? "This HTML have more than "+ this.count +  " <"+ this.tag + ">" + " tag." : ""
	}
}


//output
class ConsoleOutput {
	constructor(data) {
		this.data = data
	}
	async write() {
		console.log(this.data)
	}
}

class FileOutput {
	constructor(path, data) {
		this.data = data
		this.path = path
	}
	async write() {
		await fs.writeFile(this.path, this.data, (err) => {
			if (err) throw err;
			console.log("The file has been saved!(" + this.path+ ")");
		})
	}
}

class StreamOutput {
	constructor(stream, data) {
		this.data = data
		this.stream = stream
  }
	writeStream() {
		return new Promise((resolve, reject) => {
			this.stream.write(this.data)
			this.stream.end()
			this.stream.on('error', (err) => {
				reject(err)
			})
			this.stream.on('finish', () => {
				resolve()
			})
		})
	}
  async write() {
	  await this.writeStream()
  }
}

class htmlCheck {
	constructor(defaultRule){
		this.input = null
		this.output = null
		this.dom = null
		this.err = []
		this.select = []
		if(defaultRule){
			this.rules = [
				["new CheckTagNoAttr('', 'img', 'alt')"],
				["new CheckTagNoAttr('', 'a', 'rel')" ,"2"]
			]
		}else{
			this.rules = []
		}
	}
	selectdefaultRule(indexes){

		//this.select = []
		indexes.forEach(i => { 
		this.rules[i-1]	&& this.rules[i-1].forEach(
				j => {this.select.push(j)
				})})
	}
	
	pprint(){
		console.log(this.select);
	}
	

}

const p = new htmlCheck(true)//selectdefaultRule([0, 1])
p.selectdefaultRule([1, 2])
console.log(p)
/*module.exports = {
	FileInput,
	StreamInput,
	CheckRule,
	CheckTagNoAttr,
    	CheckExistTag,
	CheckTagNoAttrValue,
	CheckTagCount,
	ConsoleOutput,
	FileOutput,
	StreamOutput
}
*/

/*
const Path = __dirname + '/index.html'
//const input = new FileInput(Path)

//const data = input.read();
const stream = fs.createReadStream(Path)
const result = new StreamInput(stream)

//data.then(function(result) {
//const RuleExistTag()
	const dom = cheerio.load(result);
	//const rule  = new CheckTagNoAttr('', 'img', 'alt')
	//const rule  = new CheckTagNoAttr('', 'a', 'rel')
	//const rule  = new CheckExistTag('', 'title')
	//const rule  = new CheckTagNoAttrValue('head', 'meta', 'name', 'description')
	//const rule  = new CheckTagNoAttrValue('head', 'meta', 'name', 'keywords')
	const rule  = new CheckTagCount('', 'h1', 1)
	rule.setDom(dom);
	rule.check();
	const error = rule.err();
	//const out = new ConsoleOutput(error)
	//const out = new FileOutput(__dirname + '/out.txt', error)
	const wstream = fs.createWriteStream(__dirname + '/result.log')
 	const out = new StreamOutput(wstream, error)
	const outt = out.write();
	outt.then(function(result) {
		console.log(result)
	})
	//console.log(error);
//})*/
//
//
