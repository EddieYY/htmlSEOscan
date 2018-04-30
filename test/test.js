const { htmlCheck, FileInput, ConsoleOutput } = require('../src/package')
 

const InputPath = __dirname + '/test.html'
const OutputPath = __dirname + '/out.log'

const input = new FileInput(InputPath)
const output = new ConsoleOutput()
 
const htmlSEOheck = new htmlCheck(true)
 
htmlSEOheck.setInput(input)
htmlSEOheck.setOutput(output)
 
htmlSEOheck.run().then(function(result){
         htmlSEOheck.getResult()
})



