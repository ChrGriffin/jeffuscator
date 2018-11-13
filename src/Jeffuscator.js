const mime = require('mime-types');
const fs = require('fs-extra');
const { dirWalk, getLowestCommonDirectory, insertAtStrPos } = require('./helpers')

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
        this.files = []
        this.setFiles(path)
    }

    /**
     * Validate and set the files property.
     *
     * @param {string } path
     */
    setFiles(path) {
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
                if(mime.lookup(file) === 'application/javascript') {
                    this.files.push(file)
                }
            })

            // should an error be thrown if there are no valid files?
        }
    }

    /**
     * Process and save all configured files.
     *
     * @param { string } outputDir
     */
    processFiles(outputDir) {

        if(this.files.length < 1) {
            return
        }

        this.files.forEach((file) => {

            let filename = insertAtStrPos(file, '.jeff', file.lastIndexOf('.js'));

            if(typeof outputDir !== 'undefined') {
                filename = filename.replace(
                    getLowestCommonDirectory(this.files),
                    outputDir.replace(/\/?$/, '/')
                )
            }

            let fileText = fs.readFileSync(file, 'utf8')

            fs.outputFileSync(
                filename,
                fileText
            )
        })
    }
}