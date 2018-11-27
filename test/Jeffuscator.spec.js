const { expect } = require('chai')
const path = require('path')
const fs = require('fs-extra')
const Jeffuscator = require('../src/Jeffuscator')
const { dirWalk } = require('../src/helpers')
const { exec } = require('child_process');

describe('Jeffuscator', () => {

    /**
     * Perform setup before each test.
     *
     * @return { void }
     */
    beforeEach(function() {
        removeTestFiles()
    })

    /**
     * Perform teardown after each test.
     *
     * @return { void }
     */
    afterEach(function() {
        removeTestFiles()
    });

    /**
     * Tests related to class instantiation.
     *
     * @return { void }
     */
    describe('Instantiation & Setup', () => {
        it('is referencable', () => {
            expect(Jeffuscator).to.exist
        })

        it('throws an exception when no directory or file is provided', () => {
            expect(() => {
                new Jeffuscator()
            }).to.throw('Directory or file is required')
        })
    })

    /**
     * Tests related to loading and verifying files.
     *
     * @return { void }
     */
    describe('File Loading', () => {
        it('throws an exception when the given directory or file does not exist', () => {
            expect(() => {
                new Jeffuscator('geralt_of_rivia.js')
            }).to.throw('Directory or path does not exist')

            expect(() => {
                new Jeffuscator('geralt_of_rivia')
            }).to.throw('Directory or path does not exist')
        })

        it('throws an exception when the given file is not a JavaScript file', () => {
            expect(() => {
                new Jeffuscator(path.resolve(__dirname, 'fixtures/notJs.css'))
            }).to.throw('File is not a JavaScript file')
        })

        it('does not throw an invalid file type exception when passed a directory', () => {
            expect(() => {
                new Jeffuscator(path.resolve(__dirname, 'fixtures'))
            }).to.not.throw()
        })

        it('gets a single file when passed a filepath', () => {
            let jsPath = path.resolve(__dirname, 'fixtures/multipleJsFiles/js1.js')
            let jeff = new Jeffuscator(jsPath)

            expect(jeff.files.length).to.equal(1)
            expect(jeff.files.indexOf(jsPath)).to.not.equal(-1)
        })

        it('gets multiple files recursively when passed a directory', () => {
            let jeff = new Jeffuscator(path.resolve(__dirname, 'fixtures/multipleJsFiles'))
            expect(jeff.files.length).to.equal(3)

            let jsPaths = [
                path.join(__dirname, 'fixtures/multipleJsFiles/js1.js'),
                path.join(__dirname, 'fixtures/multipleJsFiles/js.2.js'),
                path.join(__dirname, 'fixtures/multipleJsFiles/subDirectory/js3.js')
            ]

            jsPaths.forEach((jsPath) => {
                expect(jeff.files.indexOf(jsPath)).to.not.equal(-1)
            })
        })
    })

    /**
     * Tests related to processing and saving files.
     *
     * @return { void }
     */
    describe('File Processing', () => {
        it('saves processed files next to the originals when no output directory is provided', () => {
            new Jeffuscator(path.resolve(__dirname, 'fixtures/multipleJsFiles')).processFiles()

            let jsPaths = [
                path.resolve(__dirname, 'fixtures/multipleJsFiles/js1.jeff.js'),
                path.resolve(__dirname, 'fixtures/multipleJsFiles/js.2.jeff.js'),
                path.resolve(__dirname, 'fixtures/multipleJsFiles/subDirectory/js3.jeff.js')
            ]

            jsPaths.forEach((jsPath) => {
                expect(fs.existsSync(jsPath)).to.equal(true)
            })
        })

        it('does not process `.jeff.js` files', () => {
            new Jeffuscator(path.resolve(__dirname, 'fixtures/multipleJsFiles')).processFiles()
            new Jeffuscator(path.resolve(__dirname, 'fixtures/multipleJsFiles')).processFiles()

            let jsPaths = [
                path.resolve(__dirname, 'fixtures/multipleJsFiles/js1.jeff.jeff.js'),
                path.resolve(__dirname, 'fixtures/multipleJsFiles/js.2.jeff.jeff.js'),
                path.resolve(__dirname, 'fixtures/multipleJsFiles/subDirectory/js3.jeff.jeff.js')
            ]

            jsPaths.forEach((jsPath) => {
                expect(fs.existsSync(jsPath)).to.equal(false)
            })
        })

        it('saves processed files with the same structure to an output directory when provided', () => {
            let outputPath = path.resolve(__dirname, 'output')

            new Jeffuscator(path.resolve(__dirname, 'fixtures/multipleJsFiles'))
                .processFiles(outputPath)

            let jsPaths = [
                outputPath + '/js1.jeff.js',
                outputPath + '/js.2.jeff.js',
                outputPath + '/subDirectory/js3.jeff.js'
            ]

            jsPaths.forEach((jsPath) => {
                expect(fs.existsSync(jsPath)).to.equal(true)
            })
        })
    })

    /**
     * Tests related to obfuscating files.
     *
     * @return { void }
     */
    describe('Obfuscation', () => {

        it('replaces normal function declarations with Jeffs', () => {

            expectJeffReplacements(
                path.resolve(__dirname, 'fixtures/functionTests/functionDeclaration.js'),
                path.resolve(__dirname, 'fixtures/functionTests/functionDeclaration.jeff.js'),
                2
            )
        })

        it('replaces functions stored in variables with Jeffs', () => {

            expectJeffReplacements(
                path.resolve(__dirname, 'fixtures/functionTests/functionAsVariable.js'),
                path.resolve(__dirname, 'fixtures/functionTests/functionAsVariable.jeff.js'),
                2
            )
        })

        it('replaces single variables with Jeffs', () => {

            expectJeffReplacements(
                path.resolve(__dirname, 'fixtures/variableTests/singleVariables.js'),
                path.resolve(__dirname, 'fixtures/variableTests/singleVariables.jeff.js'),
                2
            )
        })

        it('replaces comma-separated variables with Jeffs', () => {

            expectJeffReplacements(
                path.resolve(__dirname, 'fixtures/variableTests/commaSeparatedVariables.js'),
                path.resolve(__dirname, 'fixtures/variableTests/commaSeparatedVariables.jeff.js'),
                3
            )
        })

        it('obfuscates a valid file into a valid file', () => {

            var validJavascriptFunction = require(path.resolve(__dirname, 'fixtures/validJavascript.js'))

            expect(() => {
                validJavascriptFunction.getMyValue()
            }).to.not.throw()

            expect(validJavascriptFunction.getMyValue()).to.equal(1)

            new Jeffuscator(path.resolve(__dirname, 'fixtures/validJavascript.js'))
                .processFiles()

            var processedJavascriptFunction = require(path.resolve(__dirname, 'fixtures/validJavascript.jeff.js'))

            expect(() => {
                processedJavascriptFunction.getMyValue()
            }).to.not.throw()

            expect(processedJavascriptFunction.getMyValue()).to.equal(1)
        })
    })

    /**
     * Tests related to the CLI functionality.
     *
     * @return { void }
     */
    describe('CLI Functionality', () => {

        const cliPath = path.resolve(__dirname, '../cli.js')
        const inputPath = path.resolve(__dirname, './fixtures/multipleJsFiles/js1.js')
        const outputPathNoOutput = path.resolve(__dirname, './fixtures/multipleJsFiles/js1.jeff.js')
        const outputDirectoryPath = path.resolve(__dirname, './fixtures/multipleJsFiles')
        const outputFilePath = path.resolve(__dirname, './fixtures/multipleJsFiles/js1.jeff')

        it('exits with an error code when no input is specified', () => {

            exec(`node ${cliPath}`, (err, stdout, stderr) => {

                expect(err).to.not.equal(null)
            });
        })

        it('saves processed file next to original when provided an input and no output', () => {

            exec(`node ${cliPath} -i ${inputPath}`, (err, stdout, stderr) => {

                expect(err).to.equal(null)
                expect(fs.existsSync(outputPathNoOutput)).to.equal(true)
            });
        })

        it('saves processed file in the output directory when provided an input and an output', () => {

            exec(`node ${cliPath} -i ${inputPath} -o ${outputDirectoryPath}`, (err, stdout, stderr) => {

                expect(err).to.equal(null)
                expect(fs.existsSync(outputPathFilet)).to.equal(true)
            });
        })
    })
})

/**
 * Expect that we refactor all function references in a given file to be instances of 'Jeff'.
 *
 * @param { string } sourcePath
 * @param { string } processedPath
 * @param { int } numFunctions
 */
let expectJeffReplacements = function(sourcePath, processedPath, numFunctions)
{
    let fileText = fs.readFileSync(sourcePath, 'utf8')

    for(let f = 1; f <= numFunctions; f++) {
        expect(new RegExp('shouldBeReplaced' + f).test(fileText)).to.equal(true)
    }

    new Jeffuscator(sourcePath)
        .processFiles()

    fileText = fs.readFileSync(processedPath, 'utf8')

    for(let f = 1; f <= numFunctions; f++) {
        expect(new RegExp('shouldBeReplaced' + f).test(fileText)).to.equal(false)
    }
}

/**
 * Remove any files created by testing.
 *
 * @return { void }
 */
let removeTestFiles = function()
{
    let files = dirWalk(path.resolve(__dirname, 'fixtures'))
    files.forEach((file) => {
        if(file.indexOf('.jeff.js') !== -1) {
            //fs.unlinkSync(file)
        }
    })

    if(fs.existsSync(path.resolve(__dirname, 'output'))) {
        fs.removeSync(path.resolve(__dirname, 'output'))
    }
}
