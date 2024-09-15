// This code tells TypeScript that any import statement that ends with 
// .module.css should be treated as a module that exports an object containing CSS class names as keys and their corresponding values as strings.

declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
  }