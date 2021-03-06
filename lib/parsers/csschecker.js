'use strict';
var Promise = require('promise'),
    parse = require('css-parse'),
    fs = require('fs'),
    flatten = require('flatten'),
    helpers = require('../helpers/helpers');

function parseRules(file, parseResult) {
    var rules = parseResult.rules;

    return flatten(rules.map(function (rule) {
        if (rule.type !== 'rule') {
            return [];
        }

        var results = [];

        rule.selectors.forEach(function (selector) {
            var classMatches = helpers.getClassesFromSelector(selector);

            results.push({
                type: 'selector',
                selector: selector,
                file: file,
                line: rule.position.start.line,
                column: rule.position.start.column
            });

            classMatches.forEach(function (className) {
                results.push({
                    type: 'class',
                    className: className,
                    file: file,
                    line: rule.position.start.line,
                    column: rule.position.start.column
                });
            });
        });

        rule.declarations.forEach(function (declaration) {
            results.push({
                type: 'declaration',
                declaration: declaration,
                file: file,
                line: rule.position.start.line,
                column: rule.position.start.column
            });
        });

        return results;
    }));
}

module.exports = function (file) {
    var readFile = Promise.denodeify(fs.readFile);

    return readFile(file, 'utf8')
        .then(function (contents) {
            return parse(contents).stylesheet;
        })
        .then(function (parseResult) {
            return parseRules(file, parseResult);
        });
};
