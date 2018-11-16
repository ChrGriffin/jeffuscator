# Jeffuscator
Obfuscate JavaScript by renaming all variables and methods to different variations of 'Jeff'. Inspired by [this tweet](https://twitter.com/MrEvilMusk/status/1061856821005205504) from Evil Elon Musk.

## Example

### Before:

```javascript
var firstNum = 1;
var secondNum = 2;

var added = add(firstNum, secondNum);

function add(a, b)
{
    return a + b;
}
```

### After:

```javascript
var jeff = 1;
var jeffrey = 2;

var jefferey = jeffeory(jeff, jeffrey);

function jeffeory(jeffy, jefrey)
{
    return jeffy + jefrey;
}
```

## Installation
 
Install Jeffuscator with NPM:

```
npm install jeffuscator
```

If you're only interested in the CLI functionality, you may wish to install globally.

## Usage

You can import Jeffuscator into your project with:

```javascript
var Jeffuscator = require('jeffuscator');
```

To Jeffuscate code, instantiate a new instance of the class with an input, then call the `processFiles` method. `processFiles` optionally accepts an output path.

```javascript
new Jeffuscator('path/to/my/files')
    .processFiles('path/to/output/folder')
```

The input argument can be either a folder or a file. If passed a folder, it will process every `.js` file in that folder.

The output path should always be a folder. Processed files will be saved to the output folder, retaining the same structure as the input folder.


## CLI Usage

Once installed, you should be able to use Jeffuscator from the command line using the `jeffuscate` command:

```
jeffuscate -i path/to/my/input -o path/to/my/output
```

## Under the Hood

Jeffuscator makes use of a custom fork of [UglifyJs v1](https://github.com/mishoo/UglifyJS) that switches out the normal string of characters used for obfuscation, with an array of different variations of the name Jeff.
