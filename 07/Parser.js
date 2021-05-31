"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.COMMAND_TYPE = void 0;
var fs = require("fs");
var readline = require("readline");
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
        var _this = this;
        this.current = '';
        this.file = file;
        this.moreLine = true;
        this.stream = fs.createReadStream(file);
        this.rl = readline.createInterface(this.stream);
        this.rl.on('line', function (line) {
            _this.current = line.replace(/\/\/.*$/, '').replace(/\s/, '');
            if (_this.current === '')
                _this.advance();
            console.log(_this.current);
        });
    }
    Parser.prototype.hasmoreCommands = function () {
        return !(this.current === 'EOF');
    };
    Parser.prototype.advance = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
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
var p = new Parser('07/StackArithmetic/SimpleAdd/SimpleAdd.vm');
p.advance();
var s = fs.createReadStream('07/StackArithmetic/SimpleAdd/SimpleAdd.vm');
var rl = readline.createInterface(s);
rl.on('line', function (line) { return console.log(line); });
