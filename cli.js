var fs = require('fs');
var esprima = require('esprima');
var normalizer = require(__dirname + '/node_modules/JS_WALA/normalizer/lib/normalizer');
var liveness = require('./liveness.js');

var source = fs.readFileSync(process.argv[2], 'utf-8');
var ast = esprima.parse(source);

liveness.compute(ast);
ast = normalizer.normalize(ast);
console.log(liveness.format(ast));