'use strict';

var fs = require('fs');
var path = require('path');
var glob = require('glob');
var orcorum = require('orcorum');
var loadGruntTasks = require('load-grunt-tasks');

var cwd = process.cwd();
var defaults = {
    configPath: path.join(cwd, 'grunt'),
    loadGruntTasks: {},
    init: true,
    data: {}
};

module.exports = function(grunt, options) {
    options = options || {};
    if (options.config) {
        options.data = options.config;
        delete options.config;
    }

    var opts = orcorum.object.extend({}, defaults, options);
    var packageJsonPath = path.join(cwd, 'package.json');
    var taskName;
    var config;

    if (fs.existsSync(packageJsonPath)) {
        opts.data.package = require(packageJsonPath);
    }

    config = loadConfig(options.configPath, grunt, options.data);

    if (opts.init) {
        grunt.initConfig(config);
    }
    if (opts.loadGruntTasks) {
        loadGruntTasks(grunt, opts.loadGruntTasks);
    }
    if (config.aliases) {
        for (taskName in config.aliases) {
            grunt.registerTask(taskName, config.aliases[taskName]);
        }
    }
    return config;
};

function loadConfig(dir, grunt, options) {
    var files = glob.sync('*.js', {
        cwd: dir
    });
    var fullPaths = files.map(function map(file) {
        return path.join(dir, file);
    });
    var config = {};

    fullPaths.forEach(function each(path) {
        var result = loadFile(path);
        var key = getKey(path);

        config.__defineGetter__(key, function() {
            if (typeof result === 'function') {
                result = result(grunt, options);
            }
            return result;
        });
    });
    return config;
}

function loadFile(file) {
    if (!fs.existsSync(file)) {
        throw new Error(file + ' doesn\'t exist');
    }
    return require(file);
}

function getKey(file) {
    return path.basename(file, path.extname(file));
}
