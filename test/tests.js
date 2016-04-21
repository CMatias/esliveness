var expect = require('chai').expect;
var fs = require('fs');
var esprima = require('esprima');

var liveness = require(__dirname + '/../liveness');
var RUN_ONLY = process.env.RUN_ONLY;

describe('compute liveness', function() {
	var testFiles;
	if (RUN_ONLY) testFiles = [RUN_ONLY];
	else testFiles = fs.readdirSync(__dirname + '/input');
	
	testFiles.forEach(function (filename) {
		it(filename, function() {
			var expected = fs.readFileSync(__dirname + '/expected/' + filename);
			
			var source = fs.readFileSync(__dirname + '/input/' + filename);
			var ast = esprima.parse(source);
			liveness.compute(ast);
			
			expect(liveness.format(ast, true).trim()).to.equal((''+expected).trim());
		});
	});
});