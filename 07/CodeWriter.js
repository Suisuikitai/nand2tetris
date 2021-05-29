"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var Parser_1 = require("./Parser");
//VMコマンドは行ごとに分かれている
var CodeWriter = /** @class */ (function () {
    function CodeWriter(file) {
        this.input_file = null;
        //RAM[256-2047]
        this.stack = [];
        //RAM[0]
        this.SP = 0;
        //RAM[1]
        this.LCL = null;
        //RAM[2]
        this.ARG = null;
        //RAM[3]
        this.THIS = null;
        //RAM[4]
        this.THAT = null;
        this.stream = fs_1.createWriteStream(file + '.asm');
    }
    CodeWriter.prototype.setFileName = function (fileName) {
        this.input_file = fileName;
    };
    CodeWriter.prototype.writeArithmetic = function (command) {
        var ans = 0;
        if (command == 'add') {
            ans = this.stack[--this.SP] + this.stack[--this.SP];
        }
        if (command == 'sub') {
            ans = this.stack[--this.SP] - this.stack[--this.SP];
        }
        this.stack[this.SP++] = ans;
        //アセンブリ言語としてどうなるのが正解か
        /**
         * addした結果stack[0]= 10になったとすると
         * RAM[256] = 10
         * assembly
         * @10
         * D=A
         * @256
         * M=D
         */
        this.stream.write("@" + ans + "\n");
        this.stream.write('D=A\n');
        this.stream.write("@" + (this.SP + 256) + "\n");
        this.stream.write('M=D\n');
    };
    CodeWriter.prototype.writePushPop = function (command, segment, index) {
        if (command === Parser_1.COMMAND_TYPE.C_PUSH) {
            if (segment === 'constructor') {
                this.stack[this.SP++] = index;
            }
        }
    };
    return CodeWriter;
}());
exports["default"] = CodeWriter;
