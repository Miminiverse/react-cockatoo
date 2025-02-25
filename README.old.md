# Welcome to Code the Dream's React Class!

### During class you will be building **TWO** React apps...

The **FIRST** will be a **BLOG APP** that you build while working through the class textbook.
The blog app you will create completely from scratch following the book instructions. _You should keep your work for the blog app in a separate repository._

The **SECOND** will be a **TO-DO LIST APP** that you will build as extra coding practice during your coding assignments throughout the class.

**[Click here](https://github.com/Code-the-Dream-School/react/wiki) to redirect to the Wiki for this repository.  
Read the Project Setup section and then follow the link to the General Instructions to get started.**

Install tsconfig.json
In tsconfig.json, add this line "extends": "./tsconfig.paths.json",
Create tsconfig.paths.json, add these lines

{
"compilerOptions": {
"baseUrl": ".",
"paths": {
"@root/_": ["src/_"],
"@asset/_": ["src/asset/_"],
"@components/_": ["src/components/_"]
}
}
}

Install craco and create craco.config.js and add these lines

const path = require("path");

module.exports = {
webpack: {
alias: {
"@root": path.resolve(**dirname, "src/"),
"@asset": path.resolve(**dirname, "src/asset"),
"@components": path.resolve(\_\_dirname, "src/components"),
}
}
};

in package.json, change these

"scripts": {
"start": "craco start",
"build": "craco build",
"test": "craco test",
"eject": "craco eject"
}

Then start the app "npm start"
