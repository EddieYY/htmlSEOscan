const { htmlCheck, FileInput, StreamInput, ConsoleOutput, FileOutput, StreamOutput } = require('../src/package')
//const { htmlCheck, FileInput, StreamInput, ConsoleOutput, FileOutput, StreamOutput } = require('htmlseoscan')
 

const InputPath = __dirname + '/test.html' // input local file path 
const input = new FileInput(InputPath)

const output = new ConsoleOutput() // ouput in Console.
// if write output to local file
// const OutputPath = __dirname + '/out.log'
// const output = new FileOutput(OutputPath)


const htmlSEOcheck = new htmlCheck()
htmlSEOcheck.setInput(input)
htmlSEOcheck.setOutput(output)

htmlSEOcheck.run().then(function(result){
         htmlSEOcheck.getResult()
})
