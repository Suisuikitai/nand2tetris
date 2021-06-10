"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var Parser_1 = require("./Parser");
//VMコマンドは行ごとに分かれている
var CodeWriter = /** @class */ (function () {
    function CodeWriter(file) {
        this.input_file = null;
        this.jumpCount = 0;
        this.tmp = 5;
        this.pointer = 3;
        this.stream = fs_1.createWriteStream(file);
    }
    CodeWriter.prototype.setFileName = function (fileName) {
        this.input_file = fileName;
    };
    CodeWriter.prototype.fetchStackVal = function () {
        this.stream.write('@SP\n');
        this.stream.write('M=M-1\n');
        this.stream.write('A=M\n');
        this.stream.write('D=M\n');
    };
    CodeWriter.prototype.focusStackTop = function () {
        this.stream.write('@SP\n');
        this.stream.write('A=M-1\n');
    };
    CodeWriter.prototype.writeArithmetic = function (command) {
        if (command === 'add') {
            this.fetchStackVal();
            this.focusStackTop();
            this.stream.write('D=D+M\n');
            this.focusStackTop();
            this.stream.write('M=D\n');
        }
        else if (command === 'sub') {
            this.fetchStackVal();
            this.focusStackTop();
            this.stream.write('D=M-D\n');
            this.focusStackTop();
            this.stream.write('M=D\n');
        }
        else if (command === 'eq') {
            this.fetchStackVal();
            this.focusStackTop();
            this.stream.write('D=D-M\n');
            this.stream.write("@J_true" + this.jumpCount + "\n");
            this.stream.write('D;JEQ\n');
            this.writeAfterTrueJmp();
        }
        else if (command === 'lt') {
            this.fetchStackVal();
            this.focusStackTop();
            this.stream.write('D=M-D\n');
            this.stream.write("@J_true" + this.jumpCount + "\n");
            this.stream.write('D;JLT\n');
            this.writeAfterTrueJmp();
        }
        else if (command === 'gt') {
            this.fetchStackVal();
            this.focusStackTop();
            this.stream.write('D=M-D\n');
            this.stream.write("@J_true" + this.jumpCount + "\n");
            this.stream.write('D;JGT\n');
            this.writeAfterTrueJmp();
        }
        else if (command === 'neg') {
            this.focusStackTop();
            this.stream.write('M=-M\n');
        }
        else if (command === 'not') {
            this.focusStackTop();
            this.stream.write('M=!M\n');
        }
        else if (command === 'and') {
            this.fetchStackVal();
            this.focusStackTop();
            this.stream.write('M=M&D\n');
        }
        else if (command === 'or') {
            this.fetchStackVal();
            this.focusStackTop();
            this.stream.write('M=M|D\n');
        }
    };
    CodeWriter.prototype.writeAfterTrueJmp = function () {
        this.stream.write("@J_false" + this.jumpCount + "\n");
        this.stream.write('0;JMP\n');
        //-1をstackに積む
        this.stream.write("(J_true" + this.jumpCount + ") //true\u306E\u30B8\u30E3\u30F3\u30D7\u7528\u306E\u30E9\u30D9\u30EB\n");
        this.focusStackTop();
        this.stream.write('M=-1 //スタックに-1を積む\n');
        this.stream.write("@END" + this.jumpCount + "\n");
        this.stream.write('0;JMP\n');
        //0をstackに積む
        this.stream.write("(J_false" + this.jumpCount + ")\n");
        this.focusStackTop();
        this.stream.write('M=0\n');
        //処理終了
        this.stream.write("(END" + this.jumpCount + ")\n");
        this.jumpCount++;
    };
    CodeWriter.prototype.writePushPop = function (cmdType, segment, index) {
        if (cmdType === Parser_1.COMMAND_TYPE.C_PUSH) {
            this.push(segment, index);
        }
        else if (cmdType === Parser_1.COMMAND_TYPE.C_POP) {
            this.pop(segment, index);
        }
    };
    CodeWriter.prototype.pushStack = function () {
        this.stream.write('@SP\n');
        this.stream.write('A=M\n');
        this.stream.write('M=D\n');
        this.stream.write('@SP\n');
        this.stream.write('M=M+1\n');
    };
    CodeWriter.prototype.writeInit = function () {
        // this.stream.write('@256\n')
        // this.stream.write('D=A\n')
        // this.stream.write('@SP\n')
        // this.stream.write('A=D\n')
    };
    CodeWriter.prototype.writeLabel = function (label) {
        this.stream.write("(" + label + ")\n");
    };
    CodeWriter.prototype.writeGoto = function (label) {
        this.stream.write("@" + label + "\n");
        this.stream.write('0;JMP\n');
    };
    CodeWriter.prototype.writeIf = function (label) {
        this.fetchStackVal();
        this.stream.write("@" + label + "\n");
        this.stream.write('D;JLT\n');
        this.stream.write('D;JGT\n');
    };
    CodeWriter.prototype.writeCall = function (functionName, numArgs) {
        //call assembly
    };
    CodeWriter.prototype.writeReturn = function () {
        this.stream.write('@LCL\n');
        this.stream.write('D=M\n');
        this.stream.write('@R13\n');
        this.stream.write('M=D\n');
        this.stream.write('@5\n');
        this.stream.write('A=D-A\n');
        this.stream.write('D=M\n');
        this.stream.write('@R14\n');
        this.stream.write('M=D\n');
        this.fetchStackVal();
        this.stream.write('@ARG\n');
        this.stream.write('A=M\n');
        this.stream.write('M=D\n');
        this.stream.write('@ARG\n');
        this.stream.write('D=M\n');
        this.stream.write('@SP\n');
        this.stream.write('M=D+1\n');
        this.stream.write('@R13\n');
        this.stream.write('A=M-1\n');
        this.stream.write('D=M\n');
        this.stream.write('@THAT\n');
        this.stream.write('M=D\n');
        this.stream.write('@R13\n');
        this.stream.write('A=M-1\n');
        this.stream.write('A=A-1\n');
        this.stream.write('D=M\n');
        this.stream.write('@THIS\n');
        this.stream.write('M=D\n');
        this.stream.write('@R13\n');
        this.stream.write('D=M\n');
        this.stream.write('@3\n');
        this.stream.write('A=D-A\n');
        this.stream.write('D=M\n');
        this.stream.write('@ARG\n');
        this.stream.write('M=D\n');
        this.stream.write('@R13\n');
        this.stream.write('D=M\n');
        this.stream.write('@4\n');
        this.stream.write('A=D-A\n');
        this.stream.write('D=M\n');
        this.stream.write('@LCL\n');
        this.stream.write('M=D\n');
        this.stream.write('@14\n');
        this.stream.write('A=M\n');
        this.stream.write('0;JMP\n');
    };
    CodeWriter.prototype.writeFunction = function (functionName, numLocals) {
        //function assembly
        this.stream.write("(" + functionName + ")\n");
        this.stream.write('@SP\n');
        this.stream.write('A=M\n');
        for (var i = 0; i < numLocals; i++) {
            this.stream.write('M=0\n');
            this.stream.write('@SP\n');
            this.stream.write('M=M+1\n');
            this.stream.write('A=M\n');
        }
    };
    CodeWriter.prototype.push = function (segment, index) {
        if (segment === 'constant') {
            this.stream.write("@" + index + "\n");
            this.stream.write('D=A\n');
        }
        else if (segment === 'temp') {
            this.stream.write("@R" + (this.tmp + index) + "\n");
            this.stream.write('D=M\n');
        }
        else if (segment === 'static') {
            this.stream.write('@16\n');
            this.stream.write('D=A\n');
            this.stream.write("@" + index + "\n");
            this.stream.write('A=D+A\n');
            this.stream.write('D=M\n');
        }
        else if (segment === 'pointer') {
            this.stream.write("@" + this.pointer + "\n");
            this.stream.write('D=A\n');
            this.stream.write("@" + index + "\n");
            this.stream.write('A=D+A\n');
            this.stream.write('D=M\n');
        }
        else {
            var addr = '';
            if (segment === 'local') {
                addr = 'LCL';
            }
            else if (segment === 'that') {
                addr = 'THAT';
            }
            else if (segment === 'this') {
                addr = 'THIS';
            }
            else if (segment === 'argument') {
                addr = 'ARG';
            }
            this.stream.write("@" + addr + "\n");
            this.stream.write('A=M\n');
            for (var i = 0; i < index; i++) {
                this.stream.write('A=A+1\n');
            }
            this.stream.write('D=M\n');
        }
        this.pushStack();
    };
    CodeWriter.prototype.pop = function (segment, index) {
        this.fetchStackVal();
        var addr = '';
        if (segment === 'temp') {
            this.stream.write('@R5\n');
        }
        else if (segment === 'static') {
            this.stream.write('@16\n');
        }
        else if (segment === 'pointer') {
            this.stream.write("@" + this.pointer + "\n");
        }
        else {
            if (segment === 'local') {
                addr = 'LCL';
            }
            else if (segment === 'that') {
                addr = 'THAT';
            }
            else if (segment === 'this') {
                addr = 'THIS';
            }
            else if (segment === 'argument') {
                addr = 'ARG';
            }
            this.stream.write("@" + addr + "\n");
            this.stream.write('A=M\n');
        }
        for (var i = 0; i < index; i++) {
            this.stream.write('A=A+1\n');
        }
        this.stream.write('M=D\n');
    };
    return CodeWriter;
}());
exports["default"] = CodeWriter;
