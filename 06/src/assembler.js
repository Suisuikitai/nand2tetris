"use strict";
exports.__esModule = true;
var Code_1 = require("./Code");
var Parser_1 = require("./Parser");
var SymbolTable_1 = require("./SymbolTable");
var fs = require("fs");
var argv = process.argv;
var parser1 = new Parser_1["default"](argv[2]);
var parser2 = new Parser_1["default"](argv[2]);
var writer = fs.openSync(argv[2].slice(0, -3) + 'hack', 'w');
var symbolTable = new SymbolTable_1["default"]();
var address = 16;
var line = 0;
var registerLabel = function () {
    while (parser1.hasMoreCommands()) {
        parser1.advance();
        var commandType = parser1.commandType();
        if (commandType === Parser_1.COMMAND_TYPE.L_COMMAND) {
            var symbol = parser1.symbol();
            symbolTable.addEntry(symbol, line);
            continue;
        }
        line++;
    }
};
var handleAOrder = function () {
    var val = parser2.symbol();
    if (!symbolTable.contains(val) && isNaN(parseInt(val)))
        symbolTable.addEntry(val, address++);
    if (isNaN(parseInt(val))) {
        var binary = ('0000000000000000' + symbolTable.getAddress(val).toString(2)).slice(-16);
        fs.writeSync(writer, binary + '\n');
    }
    else {
        var binary = ('0000000000000000' + parseInt(val).toString(2)).slice(-16);
        fs.writeSync(writer, binary + '\n');
    }
};
var handleCOrder = function () {
    var comp = Code_1["default"].comp(parser2.comp());
    var dest = Code_1["default"].dest(parser2.dest());
    var jump = Code_1["default"].jump(parser2.jump());
    var binary = "111" + comp + dest + jump;
    fs.writeFileSync(writer, binary + '\n');
};
var main = function () {
    registerLabel();
    while (parser2.hasMoreCommands()) {
        parser2.advance();
        var commandType = parser2.commandType();
        if (commandType === Parser_1.COMMAND_TYPE.A_COMMAND) {
            handleAOrder();
        }
        if (commandType === Parser_1.COMMAND_TYPE.C_COMMAND) {
            handleCOrder();
        }
    }
    symbolTable.symbolTable.forEach(function (v, k) {
        console.log(v, k);
    });
};
main();
