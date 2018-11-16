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

        var output = program.outputPath
            ? path.join(process.cwd(), program.outputPath)
            : null

        new Jeffuscator(path.join(process.cwd(), program.inputPath))
            .processFiles(output)
    })
    .parse(process.argv)