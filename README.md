# Jeffuscator
Obfuscate JavaScript by renaming all variables and methods to different variations of 'Jeff'. Inspired by [this tweet](https://twitter.com/MrEvilMusk/status/1061856821005205504) from Evil Elon Musk.

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