const mime = require('mime-types');
const fs = require('fs-extra');
const { dirWalk, getLowestCommonDirectory, insertAtStrPos } = require('./helpers')
const jsp = require('../node_modules/uglify-js/lib/parse-js')
const pro = require('../node_modules/uglify-js/lib/process')

/**
 * @property { string } files
 * @property { boolean } isDirectory
 */
module.exports = class Jeffuscator
{
    /**
     * Jeffuscator constructor.
     *
     * @param { string } path
     */
    constructor(path)
    {
        this.parser = jsp
        this.processor = pro

        this.files = []

        this.setFiles(path)
    }

    /**
     * Validate and set the files property.
     *
     * @param {string } path
     */
    setFiles(path)
    {
        if (typeof path === 'undefined') {
            throw new Error('Directory or file is required');
        }

        if (!fs.existsSync(path)) {
            throw new Error('Directory or path does not exist')
        }

        let isDirectory = fs.lstatSync(path).isDirectory()

        if(!isDirectory) {
            if(mime.lookup(path) !== 'application/javascript') {
                throw new Error('File is not a JavaScript file')
            }

            this.files = [path]
        } else {
            dirWalk(path).forEach((file) => {
                if(
                    mime.lookup(file) === 'application/javascript'
                    && !/jeff.js$/.test(file)
                ) {
                    this.files.push(file)
                }
            })

            // should an error be thrown if there are no valid files?
        }
    }

    /**
     * Process and save all configured files.
     *
     * @param { string|undefined } outputDir
     */
    processFiles(outputDir)
    {
        this.files.forEach((file) => {
            this.processFile(file, outputDir)
        })
    }

    /**
     * Process and save a given file.
     *
     * @param { string } file
     * @param { string|undefined } outputDir
     */
    processFile(file, outputDir)
    {
        let filename = this.generateFilename(file, outputDir)

        let fileText = fs.readFileSync(file, 'utf8')
        let ast = this.parser.parse(fileText)
        ast = this.processor.ast_mangle(ast, {toplevel: true});
        ast = this.processor.gen_code(ast, {beautify: true})

        fs.outputFileSync(
            filename,
            ast
        )
    }

    /**
     * Create a new filename for the given file.
     *
     * @param { string } file
     * @param { string|undefined } outputDir
     * @returns { string }
     */
    generateFilename(file, outputDir)
    {
        let filename = insertAtStrPos(file, '.jeff', file.lastIndexOf('.js'));

        if(outputDir) {
            filename = filename.replace(
                getLowestCommonDirectory(this.files),
                outputDir.replace(/\/?$/, '/')
            )
        }

        return filename
    }
}