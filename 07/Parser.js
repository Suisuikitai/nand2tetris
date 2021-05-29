"use strict";
exports.__esModule = true;
exports.COMMAND_TYPE = void 0;
var fs = require("fs");
//1行ずつ非同期で読みたいならある程度纏まって読み取った後
//改行文字列で分割してさらにループするまたは、
//1byte?(改行コードのデータ量)ずつ読み取って改行が来たら返すしかないかも
exports.COMMAND_TYPE = {
    C_ARITHMETIC: 1,
    C_PUSH: 2,
    C_POP: 3,
    C_LABEL: 4,
    C_GOTO: 5,
    C_IF: 6,
    C_FUNCTION: 7,
    C_RETURN: 8,
    C_CALL: 9
};
var Parser = /** @class */ (function () {
    function Parser(file) {
        this.current = '';
        this.file = file;
        this.stream = fs.createReadStream(file);
        this.moreLine = true;
    }
    Parser.prototype.hasmoreCommands = function () {
        return !this.stream.readableEnded;
    };
    Parser.prototype.advance = function () {
        this.current = this.stream.read(100);
        console.log(this.current);
    };
    Parser.prototype.commandType = function () {
        if (this.current.startsWith('push'))
            return exports.COMMAND_TYPE.C_PUSH;
        else if (this.current.startsWith('pop'))
            return exports.COMMAND_TYPE.C_POP;
        else
            return exports.COMMAND_TYPE.C_ARITHMETIC;
    };
    Parser.prototype.arg1 = function () {
        if (this.commandType() === exports.COMMAND_TYPE.C_ARITHMETIC)
            return this.current;
        else
            return this.current.split(' ')[1];
    };
    Parser.prototype.arg2 = function () {
        return this.current.split(' ')[2];
    };
    return Parser;
}());
exports["default"] = Parser;
