const fs = require('fs')

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

/**
 * Get the lowest common directory from an array of file paths.
 *
 * @param { array } files
 * @returns { string }
 */
let getLowestCommonDirectory = function(files) {
    if(files.length < 2) {
        return files[0].substr(files[0].lastIndexOf('/') || 0)
    }
    else {
        let intersection = null
        for(let f = 1; f < files.length; f++) {
            let thisIntersection = findIntersectionFromStart(files[0], files[f])
            if(intersection === null || thisIntersection.length < intersection.length) {
                intersection = thisIntersection
            }
        }

        return files[0].substr(intersection.position, intersection.length)
    }
}

/**
 * Return the longest intersection between two strings, from the start of the strings.
 *
 * @param { string } a
 * @param { string } b
 * @returns { null|object }
 */
let findIntersectionFromStart = function(a, b) {
    for(var i = a.length; i > 0; i--){
        d = a.substring(0,i);
        j = b.indexOf(d);
        if (j >= 0){
            return { position: j, length: i };
        }
    }

    return null;
}

/**
 * Insert a string at the given index of another string.
 *
 * @param { string } origStr
 * @param { string } insStr
 * @param { int } index
 * @returns {string}
 */
let insertAtStrPos = function(origStr, insStr, index) {
    return origStr.substr(0, index)
        + insStr
        + origStr.substr(index)
}

/**
 * Export helpers.
 *
 * @type {{dirWalk: (function(string, Array): Array), getLowestCommonDirectory: getLowestCommonDirectory, findIntersectionFromStart: findIntersectionFromStart, insertAtStrPos: (function(string, string, int): string)}}
 */
module.exports = {
    dirWalk,
    getLowestCommonDirectory,
    findIntersectionFromStart,
    insertAtStrPos
}