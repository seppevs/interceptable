# interceptable
Easily intercept calls to function properties

✨ [![Build Status](http://img.shields.io/travis/seppevs/interceptable.svg?style=flat)](https://travis-ci.org/seppevs/interceptable) [![Coverage Status](https://coveralls.io/repos/github/seppevs/interceptable/badge.svg?branch=master)](https://coveralls.io/r/seppevs/interceptable) [![NPM](http://img.shields.io/npm/v/interceptable.svg?style=flat)](https://www.npmjs.org/package/interceptable) [![Downloads](http://img.shields.io/npm/dm/interceptable.svg?style=flat)](https://www.npmjs.org/package/interceptable) [![Dependencies](https://david-dm.org/seppevs/interceptable.svg)](https://david-dm.org/seppevs/interceptable) [![Known Vulnerabilities](https://snyk.io/test/github/seppevs/interceptable/badge.svg)](https://snyk.io/test/github/seppevs/interceptable) ✨

## Introduction
With this module, you can intercept calls to function properties on an object 
* You hook in before and/or after a function is called
* Both sync and async function calls are interceptable

## Installation
```bash
$ npm install interceptable --save
```

## Demo's

### Intercept synchronous functions that return a value (sync / success)
```javascript
const interceptable = require('interceptable');

const obj = {
  sayHello(name) {
    console.log('... inside sayHello');
    return `Hello ${name}!`;
  }
};

const interceptor = ({ fn, args }) => () => {
  console.log(`BEFORE call to ${fn} with args ${args}`);
  return {
    onSuccess(result) {
      console.log(`AFTER call to ${fn} with args ${args} -> result: ${result}`);
    },
  };
};

const interceptableObj = interceptable(obj, interceptor);
interceptableObj.sayHello('Sam');

// OUTPUT:
// BEFORE call to sayHello with args Sam
// ... inside sayHello
// AFTER call to sayHello with args Sam -> result: Hello Sam!
```

### Intercept synchronous functions that throw an error (sync / error)
```javascript
const interceptable = require('interceptable');

const obj = {
  sayHello(name) {
    console.log('... inside sayHello');
    throw new Error(`Cannot say hello to ${name}!`);
  }
};

const interceptor = ({ fn, args }) => () => {
  console.log(`BEFORE call to ${fn} with args ${args}`);
  return {
    onError(err) {
      console.log(`AFTER call to ${fn} with args ${args} -> error: ${err.message}`);
    },
  };
};

const interceptableObj = interceptable(obj, interceptor);
interceptableObj.sayHello('Sam');

// OUTPUT:
// BEFORE call to sayHello with args Sam
// ... inside sayHello
// AFTER call to sayHello with args Sam -> error: Cannot say hello to Sam!
// /Users/seb/Work/Github/interceptable/src/interceptable.js:20
//             throw err;
//             ^
// 
// Error: Cannot say hello to Sam!
//     at Object.sayHello (/Users/seb/Work/Github/interceptable/manual.js:6:11)
//      ... 
```

### Intercept asynchronous functions that resolve a value (async / success)
```javascript
const interceptable = require('interceptable');

const obj = {
  sayHello(name) {
    console.log('... inside sayHello');
    return Promise.resolve(`Hello ${name}!`);
  }
};

const interceptor = ({ fn, args }) => () => {
  console.log(`BEFORE call to ${fn} with args ${args}`);
  return {
    onSuccess(result) {
      console.log(`AFTER call to ${fn} with args ${args} -> result: ${result}`);
    },
  };
};

const interceptableObj = interceptable(obj, interceptor);
interceptableObj.sayHello('Sam');

// OUTPUT:
// BEFORE call to sayHello with args Sam
// ... inside sayHello
// AFTER call to sayHello with args Sam -> result: Hello Sam!
```
### Intercept asynchronous functions that rejects an error (async / error)
```javascript
const interceptable = require('interceptable');

const obj = {
  sayHello(name) {
    console.log('... inside sayHello');
    return Promise.reject(new Error(`Cannot say hello to ${name}!`));
  }
};

const interceptor = ({ fn, args }) => () => {
  console.log(`BEFORE call to ${fn} with args ${args}`);
  return {
    onError(result) {
      console.log(`AFTER call to ${fn} with args ${args} -> result: ${result}`);
    },
  };
};

const interceptableObj = interceptable(obj, interceptor);
interceptableObj.sayHello('Sam');

// OUTPUT:
// BEFORE call to sayHello with args Sam
// ... inside sayHello
// AFTER call to sayHello with args Sam -> result: Hello Sam!
// (node:26506) UnhandledPromiseRejectionWarning: Error: Cannot say hello to Sam!
//     at Object.sayHello (/Users/seb/Work/Github/interceptable/manual.js:6:27)
//     ... 
```
