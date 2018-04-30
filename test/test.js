const { htmlCheck, FileInput, ConsoleOutput } = require('../src/package')
 

const InputPath = __dirname + '/test.html'
const OutputPath = __dirname + '/out.log'

const input = new FileInput(InputPath)
const output = new ConsoleOutput()
 
const htmlSEOcheck = new htmlCheck(true)
 
htmlSEOcheck.setInput(input)
htmlSEOcheck.setOutput(output)
 
htmlSEOcheck.run().then(function(result){
         htmlSEOcheck.getResult()
})



