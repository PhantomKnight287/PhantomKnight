const fs = require("fs");
const { join } = require("path");

// Gets all the files in the `commands` directory
// that have the file extension `.js`

const getJSFiles = (dir) => {
  // Declare an empty array for storing the js files
  let jsFiles = [];

  // Get the contents of `dir`
  fs.readdirSync(dir, { withFileTypes: true }).forEach((file) => {
    // If the value is a directory, repeat for its contents
    if (file.isDirectory()) {
      jsFiles = [...jsFiles, ...getJSFiles(`${dir}/${file.name}`)];
    } else {
      // Add only files ending with `.js` to the array
      if (file.name.endsWith(".js")) {
        jsFiles.push(join(dir, file.name));
        return;
      } else {
        return;
      }
    }
  });

  return jsFiles;
};

module.exports = getJSFiles;
