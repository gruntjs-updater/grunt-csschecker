'use strict';

var encodeHTML = function (str) {
    return str.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
};

module.exports = function (results) {
    var xml = [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<checkstyle>'
    ];

    var resultsByFile = {};
    results.forEach(function (result) {
        resultsByFile[result.file] = resultsByFile[result.file] || [];
        resultsByFile[result.file].push(result);
    });

    Object.keys(resultsByFile).forEach(function (file) {
        var results = resultsByFile[file];

        xml.push(['<file name="' + encodeHTML(file) + '">']);

        results.forEach(function (result) {
            result.errors.forEach(function (error) {
                xml.push(['<error line="' + result.line + '" column="' + result.column + '" severity="warning" message="' + encodeHTML(error.message) + '" source="com.csschecker.' + error.tag + '" />']);
            });
        });

        xml.push(['</file>']);
    });

    xml.push(['</checkstyle>']);

    return xml.join('\n');
};
