"use strict";
exports.__esModule = true;
exports.COMMAND_TYPE = void 0;
var fs_1 = require("fs");
exports.COMMAND_TYPE = {
    A_COMMAND: 'A',
    C_COMMAND: 'C',
    L_COMMAND: 'L'
};
var Perser = /** @class */ (function () {
    function Perser(file) {
        this.type = '';
        this.currentIndex = 0;
        this.current = '';
        this.file = file;
        this.textArray = fs_1.readFileSync(file, 'ascii')
            .split('\n')
            .filter(function (v) {
            return !v.startsWith('//') && v.trim() !== '';
        })
            .map(function (v) {
            var val = v.replace(/\s/g, '').replace(/\/\/.*$/g, '');
            return val;
        });
    }
    Perser.prototype.hasMoreCommands = function () {
        return this.currentIndex !== this.textArray.length;
    };
    Perser.prototype.advance = function () {
        if (this.hasMoreCommands()) {
            this.current = this.textArray[this.currentIndex++];
        }
    };
    Perser.prototype.commandType = function () {
        if (this.current.startsWith('@')) {
            return exports.COMMAND_TYPE.A_COMMAND;
        }
        else if (this.current.startsWith('(')) {
            return exports.COMMAND_TYPE.L_COMMAND;
        }
        else {
            return exports.COMMAND_TYPE.C_COMMAND;
        }
    };
    Perser.prototype.symbol = function () {
        if (this.commandType() === exports.COMMAND_TYPE.A_COMMAND)
            return this.current.slice(1);
        else if (this.commandType() === exports.COMMAND_TYPE.L_COMMAND)
            return this.current.slice(1, -1);
        else
            throw Error('command type must be A_COMMAND or L_COMMAND');
    };
    Perser.prototype.dest = function () {
        if (this.current.includes('='))
            return this.current.slice(0, this.current.indexOf('='));
        else
            return null;
    };
    Perser.prototype.comp = function () {
        if (this.current.includes('=') && this.current.includes(';'))
            return this.current.slice(this.current.indexOf('=') + 1, this.current.indexOf(';'));
        else if (this.current.includes('=')) {
            return this.current.slice(this.current.indexOf('=') + 1);
        }
        else
            return this.current.slice(0, this.current.indexOf(';'));
    };
    Perser.prototype.jump = function () {
        if (this.current.includes(';')) {
            return this.current.slice(this.current.indexOf(';') + 1);
        }
        return null;
    };
    return Perser;
}());
exports["default"] = Perser;
