"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToString = (a) => a.map(t => t.toString());
exports.exclude = (c, type, defaultExcludedTypes) => ({
    [type]: {
        exclude: defaultExcludedTypes.concat(...c.excludedTypes[type].exclude)
    }
});
__export(require("./generate-type-defs"));
