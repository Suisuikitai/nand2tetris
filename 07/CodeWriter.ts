import { createWriteStream, WriteStream } from 'fs'
import { COMMAND_TYPE } from './Parser'
//VMコマンドは行ごとに分かれている

export default class CodeWriter {
  stream: WriteStream
  input_file: string | null = null
  jumpCount = 0
  tmp = 5
  pointer = 3
  constructor(file: string) {
    this.stream = createWriteStream(file)
  }
  setFileName(fileName: string) {
    this.input_file = fileName
  }
  fetchStackVal() {
    this.stream.write('@SP\n')
    this.stream.write('M=M-1\n')
    this.stream.write('A=M\n')
    this.stream.write('D=M\n')
  }
  focusStackTop() {
    this.stream.write('@SP\n')
    this.stream.write('A=M-1\n')
  }
  writeArithmetic(command: string) {
    if (command === 'add') {
      this.fetchStackVal()
      this.focusStackTop()
      this.stream.write('D=D+M\n')

      this.focusStackTop()
      this.stream.write('M=D\n')
    } else if (command === 'sub') {
      this.fetchStackVal()
      this.focusStackTop()
      this.stream.write('D=M-D\n')

      this.focusStackTop()
      this.stream.write('M=D\n')
    } else if (command === 'eq') {
      this.fetchStackVal()
      this.focusStackTop()
      this.stream.write('D=D-M\n')

      this.stream.write(`@J_true${this.jumpCount}\n`)
      this.stream.write('D;JEQ\n')
      this.writeAfterTrueJmp()
    } else if (command === 'lt') {
      this.fetchStackVal()
      this.focusStackTop()
      this.stream.write('D=M-D\n')

      this.stream.write(`@J_true${this.jumpCount}\n`)
      this.stream.write('D;JLT\n')
      this.writeAfterTrueJmp()
    } else if (command === 'gt') {
      this.fetchStackVal()
      this.focusStackTop()
      this.stream.write('D=M-D\n')

      this.stream.write(`@J_true${this.jumpCount}\n`)
      this.stream.write('D;JGT\n')
      this.writeAfterTrueJmp()
    } else if (command === 'neg') {
      this.focusStackTop()
      this.stream.write('M=-M\n')
    } else if (command === 'not') {
      this.focusStackTop()
      this.stream.write('M=!M\n')
    } else if (command === 'and') {
      this.fetchStackVal()
      this.focusStackTop()
      this.stream.write('M=M&D\n')
    } else if (command === 'or') {
      this.fetchStackVal()
      this.focusStackTop()
      this.stream.write('M=M|D\n')
    }
  }
  writeAfterTrueJmp() {
    this.stream.write(`@J_false${this.jumpCount}\n`)
    this.stream.write('0;JMP\n')

    //-1をstackに積む
    this.stream.write(`(J_true${this.jumpCount}) //trueのジャンプ用のラベル\n`)
    this.focusStackTop()
    this.stream.write('M=-1 //スタックに-1を積む\n')
    this.stream.write(`@END${this.jumpCount}\n`)
    this.stream.write('0;JMP\n')

    //0をstackに積む
    this.stream.write(`(J_false${this.jumpCount})\n`)
    this.focusStackTop()
    this.stream.write('M=0\n')

    //処理終了
    this.stream.write(`(END${this.jumpCount})\n`)
    this.jumpCount++
  }
  writePushPop(cmdType: number, segment: string, index: number) {
    if (cmdType === COMMAND_TYPE.C_PUSH) {
      this.push(segment, index)
    } else if (cmdType === COMMAND_TYPE.C_POP) {
      this.pop(segment, index)
    }
  }
  pushStack() {
    this.stream.write('@SP\n')
    this.stream.write('A=M\n')
    this.stream.write('M=D\n')
    this.stream.write('@SP\n')
    this.stream.write('M=M+1\n')
  }
  writeInit() {
    this.stream.write('@256\n')
    this.stream.write('D=A\n')
    this.stream.write('@SP\n')
    this.stream.write('A=D\n')
  }
  writeLabel(label: string) {
    this.stream.write(`(${label})\n`)
  }
  writeGoto(label: string) {
    this.stream.write(`@${label}\n`)
    this.stream.write('0;JMP')
  }
  writeIf(label: string) {
    this.fetchStackVal()
    this.stream.write(`@${label}\n`)
    this.stream.write('D;JLT\n')
    this.stream.write('D;JGT\n')
  }
  push(segment: string | null, index: number) {
    if (segment === 'constant') {
      this.stream.write(`@${index}\n`)
      this.stream.write('D=A\n')
    } else if (segment === 'temp') {
      this.stream.write(`@R${this.tmp + index}\n`)
      this.stream.write('D=M\n')
    } else if (segment === 'static') {
      this.stream.write('@16\n')
      this.stream.write('D=A\n')
      this.stream.write(`@${index}\n`)
      this.stream.write('A=D+A\n')
      this.stream.write('D=M\n')
    } else if (segment === 'pointer') {
      this.stream.write(`@${this.pointer}\n`)
      this.stream.write('D=A\n')
      this.stream.write(`@${index}\n`)
      this.stream.write('A=D+A\n')
      this.stream.write('D=M\n')
    } else {
      let addr = ''
      if (segment === 'local') {
        addr = 'LCL'
      } else if (segment === 'that') {
        addr = 'THAT'
      } else if (segment === 'this') {
        addr = 'THIS'
      } else if (segment === 'argument') {
        addr = 'ARG'
      }
      this.stream.write(`@${addr}\n`)
      this.stream.write('A=M\n')
      for (let i = 0; i < index; i++) {
        this.stream.write('A=A+1\n')
      }
      this.stream.write('D=M\n')
    }
    this.pushStack()
  }
  pop(segment: string | null, index: number) {
    this.fetchStackVal()
    let addr = ''
    if (segment === 'temp') {
      this.stream.write('@R5\n')
    } else if (segment === 'static') {
      this.stream.write('@16\n')
    } else if (segment === 'pointer') {
      this.stream.write(`@${this.pointer}\n`)
    } else {
      if (segment === 'local') {
        addr = 'LCL'
      } else if (segment === 'that') {
        addr = 'THAT'
      } else if (segment === 'this') {
        addr = 'THIS'
      } else if (segment === 'argument') {
        addr = 'ARG'
      }
      this.stream.write(`@${addr}\n`)
      this.stream.write('A=M\n')
    }
    for (let i = 0; i < index; i++) {
      this.stream.write('A=A+1\n')
    }
    this.stream.write('M=D\n')
  }
}
