const mime = require('mime-types');
const fs = require('fs');

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
}

/**
 * Recursively get all files in a directory.
 *
 * @param { string } dir
 * @param { array } filelist
 * @returns { array }
 */
let dirWalk = function(dir, filelist) {
    let files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
        if (fs.statSync(dir + '/' + file).isDirectory()) {
            filelist = dirWalk(dir + '/' + file, filelist);
        }
        else {
            filelist.push(dir + '/' + file);
        }
    });
    return filelist;
};
