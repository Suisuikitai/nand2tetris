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
        this.stream = fs_1.createWriteStream(file);
    }
    CodeWriter.prototype.setFileName = function (fileName) {
        this.input_file = fileName;
    };
    CodeWriter.prototype.writeArithmetic = function (command) {
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
        if (command === 'add') {
            this.stream.write('@SP\n');
            this.stream.write('M=M-1\n');
            this.SP--;
            this.stream.write('A=M\n');
            this.stream.write('D=M\n');
            this.stream.write('@SP\n');
            this.stream.write('A=M-1\n');
            this.stream.write('D=D+M\n');
            this.stream.write('@SP\n');
            this.stream.write('A=M-1\n');
            this.stream.write('M=D\n');
        }
        else if (command === 'eq') {
            this.stream.write('@SP\n');
            this.stream.write('M=M-1\n');
            this.SP--;
            this.stream.write('A=M\n');
            this.stream.write('D=M\n');
        }
    };
    CodeWriter.prototype.writePushPop = function (cmdType, segment, index) {
        /**
         * push constant 7
         * push constant 8
         * これをどうやってアセンブリに変換するのが正解か
         */
        if (cmdType === Parser_1.COMMAND_TYPE.C_PUSH) {
            if (segment === 'constant') {
                //indexがnullになることはないため一旦これでよしとする
                this.stream.write("@" + index + "\n");
                this.stream.write('D=A\n');
                this.stream.write('@SP\n');
                this.stream.write('A=M\n');
                this.stream.write('M=D\n');
                this.stream.write('@SP\n');
                this.stream.write('M=M+1\n');
            }
        }
    };
    return CodeWriter;
}());
exports["default"] = CodeWriter;
