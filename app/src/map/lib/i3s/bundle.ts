// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
const moduleExports = require("./index");

globalThis.loaders = globalThis.loaders || {};
module.exports = Object.assign(globalThis.loaders, moduleExports);
