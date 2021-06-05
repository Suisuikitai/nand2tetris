"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var Parser_1 = require("./Parser");
//VMコマンドは行ごとに分かれている
var CodeWriter = /** @class */ (function () {
    function CodeWriter(file) {
        this.input_file = null;
        this.jumpCount = 0;
        this.stream = fs_1.createWriteStream(file);
    }
    CodeWriter.prototype.setFileName = function (fileName) {
        this.input_file = fileName;
    };
    CodeWriter.prototype.writeBiFuncBefore = function () {
        this.stream.write('@SP\n');
        this.stream.write('M=M-1\n');
        this.stream.write('A=M\n');
        this.stream.write('D=M\n');
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
            this.writeBiFuncBefore();
            this.stream.write('@SP\n');
            this.stream.write('A=M-1\n');
            this.stream.write('D=D+M\n');
            this.stream.write('@SP\n');
            this.stream.write('A=M-1\n');
            this.stream.write('M=D\n');
        }
        else if (command === 'sub') {
            this.writeBiFuncBefore();
            this.stream.write('@SP\n');
            this.stream.write('A=M-1\n');
            this.stream.write('D=D-M\n');
            this.stream.write('@SP\n');
            this.stream.write('A=M-1\n');
            this.stream.write('M=D\n');
        }
        else if (command === 'eq') {
            this.writeBiFuncBefore();
            this.stream.write('@SP\n');
            this.stream.write('A=M-1\n'); //A=257-1 M[257]->M[256]
            this.stream.write('D=D-M\n'); //D=M[257]-M[256]
            this.stream.write("@J_true" + this.jumpCount + "\n");
            this.stream.write('D;JEQ\n');
            this.writeAfterTrueJmp();
        }
        else if (command === 'lt') {
            this.writeBiFuncBefore();
            this.stream.write('@SP\n');
            this.stream.write('A=M-1\n'); //A=257-1 M[257]->M[256]
            this.stream.write('D=D-M\n'); //D=M[257]-M[256]
            this.stream.write("@J_true" + this.jumpCount + "\n");
            this.stream.write('D;JLT\n');
            this.writeAfterTrueJmp();
        }
        else if (command === 'gt') {
            this.writeBiFuncBefore();
            this.stream.write('@SP\n');
            this.stream.write('A=M-1\n'); //A=257-1 M[257]->M[256]
            this.stream.write('D=D-M\n'); //D=M[257]-M[256]
            this.stream.write("@J_true" + this.jumpCount + "\n");
            this.stream.write('D;JGT\n');
            this.writeAfterTrueJmp();
        }
        else if (command === 'neg') {
            this.stream.write('@SP\n');
            this.stream.write('M=-M+1\n');
        }
        else if (command === 'not') {
            this.stream.write('@SP\n');
            this.stream.write('M=!M\n');
        }
        else if (command === 'and') {
            this.writeBiFuncBefore();
            this.stream.write('@SP\n');
            this.stream.write('M=M&D\n');
        }
        else if (command === 'or') {
            this.writeBiFuncBefore();
            this.stream.write('@SP\n');
            this.stream.write('M=M|D\n');
        }
    };
    CodeWriter.prototype.writeAfterTrueJmp = function () {
        this.stream.write("@J_false" + this.jumpCount + "\n");
        this.stream.write('0;JMP\n');
        //-1をstackに積む
        this.stream.write("(J_true" + this.jumpCount + ")\n");
        this.stream.write('A=M-1\n');
        this.stream.write('M=1\n');
        this.stream.write("@END" + this.jumpCount + "\n");
        this.stream.write('0;JMP\n');
        //0をstackに積む
        this.stream.write("(J_false" + this.jumpCount + ")\n");
        this.stream.write('A=M-1\n');
        this.stream.write('M=0\n');
        //処理終了
        this.stream.write("(END" + this.jumpCount + ")\n");
        this.jumpCount++;
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
