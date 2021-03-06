'use strict';

module.exports = {
    getClassesFromSelector: function (selector) {
        if (!selector) {
            return [];
        }
        var classRegEx = /[_a-zA-Z][_a-zA-Z0-9-]*/g;
        return selector.match(classRegEx) || [];
    },
    getSelectorLength: function (selector) {
        var classes = this.getClassesFromSelector(selector);
        return classes.length;
    }
};
