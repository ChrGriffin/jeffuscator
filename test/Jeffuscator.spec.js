const { expect } = require('chai')
const path = require('path')
const fs = require('fs')
const Jeffuscator = require('../src/Jeffuscator')
const { dirWalk } = require('../src/helpers')

describe('Jeffuscator', () => {

    beforeEach(function() {
        removeTestFiles()
    })

    afterEach(function() {
        removeTestFiles()
    });

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
                path.resolve(__dirname, 'fixtures/multipleJsFiles/js1.js'),
                path.resolve(__dirname, 'fixtures/multipleJsFiles/js.2.js'),
                path.resolve(__dirname, 'fixtures/multipleJsFiles/subDirectory/js3.js')
            ]

            jsPaths.forEach((jsPath) => {
                expect(jeff.files.indexOf(jsPath)).to.not.equal(-1)
            })
        })
    })

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
    })
})

/**
 * Remove any files created by testing.
 *
 * @return { void }
 */
let removeTestFiles = function() {
    let files = dirWalk(path.resolve(__dirname, 'fixtures/multipleJsFiles'))
    files.forEach((file) => {
        if(file.indexOf('.jeff.js') !== -1) {
            fs.unlinkSync(file)
        }
    })
}