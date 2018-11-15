#!/usr/bin/env node

const Jeffuscator = require('./src/Jeffuscator')
const program = require('commander')
const path = require('path')

program
    .version('1.0.0', '-v, --version')
    .option('-i, --inputPath <inputPath>', 'The input file or directory.')
    .option('-o, --outputPath <outputPath>', 'The output directory. If not set, processed files will be saved next to the originals.')
    .action(() => {
        if(!program.inputPath) {
            console.error('The input option is required.')
            process.exit(1)
        }

        console.log(program.inputPath)

        if(program.outputPath) {
            var output = path.resolve(__dirname, program.outputPath)
        }

        new Jeffuscator(path.resolve(__dirname, program.inputPath))
            .processFiles(output)
    })
    .parse(process.argv)