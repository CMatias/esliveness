require('es6-shim');

var esgraph = require('esgraph');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var deepEqual = require('deep-equal');

function computeGen (astNode) {
    console.log(astNode);

    switch (astNode.type) {
        case 'AssignmentExpression':
            return computeGen(astNode.right);

        case 'UpdateExpression':
        case 'UnaryExpression':
        case 'ReturnStatement':
            return computeGen(astNode.argument);

        case 'BinaryExpression':
            var set = new Set();
            computeGen(astNode.left).forEach(set.add.bind(set));
            computeGen(astNode.right).forEach(set.add.bind(set));
            return Array.from(set);

        case 'ConditionalExpression':
            var set = new Set();
            computeGen(astNode.test).forEach(set.add.bind(set));
            computeGen(astNode.consequent).forEach(set.add.bind(set));
            computeGen(astNode.alternate).forEach(set.add.bind(set));
            return Array.from(set);

        case 'FunctionExpression':
            // No variable is read, but recurse into the function to calculate liveness
            compute(astNode.body);
            return [];

        case 'CallExpression':
            var set = new Set();
            astNode.arguments.map(computeGen).forEach(function (vars) {
                vars.forEach(set.add.bind(set));
            });
            //computeGen(astNode.callee).forEach(set.add.bind(set));
            //Properties may interfere with surrounding scope.
            computeGen(astNode.callee.object).forEach(set.add.bind(set));
            return Array.from(set);

        case 'MemberExpression':
            var set = new Set();
            computeGen(astNode.object).forEach(set.add.bind(set));
            //Properties may interfere with surrounding scope.
            //computeGen(astNode.property).forEach(set.add.bind(set));
            return Array.from(set);

        case 'ThisExpression':
            return ['this'];

        case 'VariableDeclaration':
            var set = new Set();
            astNode.declarations.map(computeGen).forEach(function (vars) {
                vars.forEach(set.add.bind(set));
            });
            return Array.from(set);

        case 'VariableDeclarator':
            if (astNode.init) {
                if (astNode.init.object) {
                    return computeGen(astNode.init.object);
                } else {
                    return computeGen(astNode.init);
                }
            } else {
                return [];
            }

        case 'NewExpression':
            return computeGen(astNode.callee);

        case 'ObjectExpression':
            var set = new Set();
            astNode.properties.map(computeGen).forEach(function (vars) {
                vars.forEach(set.add.bind(set));
            });
            return Array.from(set);

        case 'Property':
            if (astNode.value) {
                return computeGen(astNode.value);
            } else {
                return [];
            }

        case 'Literal':
        case 'ArrayExpression':
            return [];

        case 'Identifier':
            return [astNode.name];


        default:
            console.error('Unexpected type:', astNode.type, astNode);
            return [];
        //throw new Error('Unexpected type: '+astNode.type);
    }
}

function computeKill (astNode) {
    switch (astNode.type) {
        case 'AssignmentExpression':
            return computeKill(astNode.left);

        case 'UpdateExpression':
            return computeKill(astNode.argument);

        case 'UnaryExpression':
        case 'BinaryExpression':
        case 'ConditionalExpression':
        case 'FunctionExpression':
        case 'CallExpression':
        case 'MemberExpression':
        case 'ReturnStatement':
            return [];

        case 'VariableDeclaration':
            var set = new Set();
            astNode.declarations.map(computeKill).forEach(function (vars) {
                vars.forEach(set.add.bind(set));
            });
            return Array.from(set);

        case 'VariableDeclarator':
            if (astNode.init) {
                return computeKill(astNode.id);
            } else {
                return [];
            }

        case 'Identifier':
            return [astNode.name];

        default:
            console.error('Unexpected type:', astNode.type, astNode);
            return [];
        //throw new Error('Unexpected type: '+astNode.type);
    }
}

function computeLive (flowNode) {
    var set = new Set();

    // Add liveOut
    flowNode.next.forEach(function (nextFlowNode) {
        if (!nextFlowNode.astNode || !nextFlowNode.astNode.liveness) {
            return;
        }
        nextFlowNode.astNode.liveness.live.forEach(function (name) {
            set.add(name);
        });
    });

    // Remove Kills
    flowNode.astNode.liveness.kill.forEach(function (name) {
        set['delete'](name);
    });

    // Add Gens
    flowNode.astNode.liveness.gen.forEach(function (name) {
        set.add(name);
    });

    return Array.from(set);
}

function compute (ast, cfg) {
    if (!cfg) {
        cfg = esgraph(ast);
    }

    (function rec (flowNode) {
        if (flowNode.type === undefined) {
            var prevLiveness = flowNode.astNode.liveness;

            flowNode.astNode.liveness = {
                gen: computeGen(flowNode.astNode),
                kill: computeKill(flowNode.astNode)
            };
            flowNode.astNode.liveness.live = computeLive(flowNode);

            if (deepEqual(prevLiveness, flowNode.astNode.liveness)) {
                return;
            } else {
                return flowNode.prev.slice().reverse().forEach(rec);
            }
        }
        else {
            return flowNode.prev.slice().reverse().forEach(rec);
        }

    })(cfg[1]); // cfg[1] is the exit node if the cfg
}

module.exports.compute = compute;

function computeWithIdentifier (ast, identifierToSearch, cfg) {
    if (!cfg) {
        cfg = esgraph(ast);
    }

    var foundIdentifier = false;

    if (typeof identifierToSearch !== 'string') {
        console.error("Invalid identifier supplied");
        identifierToSearch = null;
    }

    (function rec (flowNode) {
        if (flowNode.type === undefined) {
            var prevLiveness = flowNode.astNode.liveness;

            flowNode.astNode.liveness = {
                gen: computeGen(flowNode.astNode),
                kill: computeKill(flowNode.astNode)
            };
            flowNode.astNode.liveness.live = computeLive(flowNode);

            if (identifierToSearch && !foundIdentifier) {
                var findRes = flowNode.astNode.liveness.live.find(function(elem) {
                    return elem == identifierToSearch;
                });

                if (findRes) {
                    foundIdentifier = true;
                }
            }

            if (deepEqual(prevLiveness, flowNode.astNode.liveness)) {
                return;
            } else {
                return flowNode.prev.slice().reverse().forEach(rec);
            }
        }
        else {
            return flowNode.prev.slice().reverse().forEach(rec);
        }

    })(cfg[1]); // cfg[1] is the exit node if the cfg

    return foundIdentifier;
}

module.exports.computeWithIdentifier = computeWithIdentifier;

function format (ast, detailed) {
    estraverse.traverse(ast, {
        enter: function (node) {
            if ('liveness' in node) {
                // Liveness information available
                if (!('leadingComments' in node)) {
                    node.leadingComments = [];
                }

                node.leadingComments.push({
                    type: 'Line',
                    value: ' Liveness: ' + node.liveness.live.sort().join(', ')
                });

                if (detailed) {
                    if (node.liveness.gen.length > 0) {
                        node.leadingComments.push({
                            type: 'Line',
                            value: ' - Gen: ' + node.liveness.gen.sort().join(', ')
                        });
                    }

                    if (node.liveness.kill.length > 0) {
                        node.leadingComments.push({
                            type: 'Line',
                            value: ' - Kill: ' + node.liveness.kill.sort().join(', ')
                        });
                    }
                }
            }
        }
    });

    return escodegen.generate(ast, {
        format: {
            indent: {
                style: '\t',
            },
        },
        comment: true
    });
}
module.exports.format = format;