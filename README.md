lazy-load-grunt-config [![NPM Version](https://img.shields.io/npm/v/lazy-load-grunt-config.svg?style=flat)](https://www.npmjs.com/package/lazy-load-grunt-config)
======================

lazy-load-grunt-config is a Grunt library that allows you to break up your Gruntfile config by task.
**It was inspired by [load-grunt-config](http://firstandthird.github.io/load-grunt-config/)**


Installing
----------

```shell
npm install lazy-load-grunt-config
```


Running the tests
-----------------

```shell
npm test
```


Features
--------

* Each task has its own config file. Example: copy.js, uglify.js, etc.
* Auto load all grunt plugins. Uses load-grunt-tasks.
* Support for returning a function.
* Easily register task aliases with aliases.js


API
---

### Basic

```javascript
module.exports = function(grunt) {
    require('lazy-load-grunt-config')(grunt);
};
```

### With options

```javascript
module.exports = function(grunt) {
    var path = require('path');

    require('lazy-load-grunt-config')(grunt, {
        // Path to task files, defaults to grunt dir.
        configPath: path.join(process.cwd(), 'grunt'),

        // Auto grunt.initConfig
        init: true,

        // Data passed into config. Can use with <%= test %>
        data: {
            test: false
        },

        // Can optionally pass options to load-grunt-tasks. If you set to false, it will disable auto loading tasks.
        loadGruntTasks: {
            pattern: 'grunt-*',
            config: require('./package.json'),
            scope: 'devDependencies'
        }
    });
};
```

### Aliases

If your grunt/ folder contains an aliases.js file, lazy-load-grunt-config will use that to define your tasks aliases (like grunt.registerTask('default', ['nodemon']);).

`grunt/aliases.js` returning an object.

```javascript
module.exports = {
    'default': [],
    css: ['copy', 'stylus']
};
```

`grunt/aliases.js` returning a function. Useful if there is need to compute something before return.

```javascript
module.exports = function (grunt, options) {
    
    // Computation example:
    // --------------------

    var css = ['copy', 'stylus'];
    if (grunt.option('notify', false)) {
        css.push('notify:css');
    }

    return {
        'default': [],
        css: css
    };
};
```

### Change log

#### 0.1.0 / 2015-10-28 

  * Initial commit
