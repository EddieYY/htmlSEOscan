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
	constructor(defaultRule = true){
		this.input = null
		this.output = null
		this.dom = null
		this.err = []
		//this.select = []
		if(defaultRule){
			this.rules = [
				[new CheckTagNoAttr('', 'img', 'alt')],
				[new CheckTagNoAttr('', 'a', 'rel')],
				[new CheckExistTag('', 'title'), 
				 new CheckTagNoAttrValue('head', 'meta', 'name', 'description'), 
				 new CheckTagNoAttrValue('head', 'meta', 'name', 'keywords')], 
				[new CheckTagCount('', 'strong', 15)],
				[new CheckTagCount('', 'h1', 1)]
			]
		}else{
			this.rules = []
		}
	}
	selectdefaultRule(indexes){
		this.select = []
		indexes.forEach(i => {
			this.select.push(this.rules[i-1])
		})
		this.rules = this.select 
	}

	setInput(input) {
		this.input = input
	}

	setOutput(output) {
		this.output = output
	}

	CustomerRule(rule) {
		rule && this.rules.push(rule)
	}

	async run() {
		const data = await this.input.read();
		this.dom = cheerio.load(data);
		console.log(data);
		this.rules.forEach((Rule) => {
			//console.log(Rule);
			Rule.forEach(rule=>{
				rule.setDom(this.dom)
				rule.check()
				const error = rule.err()
				error && this.err.push(error)
			})
		})
	}
	async getResult() {
		//console.log(this.output);
		this.output.data = this.err.length ?  "SEO defects found:" + "\n" + this.err.join("\r\n") : "This HTML not any SEO defects found."
		await this.output.write()
	}


}

module.exports = {
	FileInput: FileInput,
	StreamInput: StreamInput,
	CheckRule: CheckRule,
	CheckTagNoAttr: CheckTagNoAttr,
	CheckExistTag: CheckExistTag,
	CheckTagNoAttrValue: CheckTagNoAttrValue,
	CheckTagCount: CheckTagCount,
	CheckTagCount: ConsoleOutput,
	ConsoleOutput: ConsoleOutput,
	FileOutput: FileOutput,
	StreamOutput: StreamOutput,
	htmlCheck: htmlCheck
};

