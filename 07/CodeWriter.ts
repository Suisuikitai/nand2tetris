import { createWriteStream, WriteStream } from 'fs'
import { COMMAND_TYPE } from './Parser'
//VMコマンドは行ごとに分かれている

export default class CodeWriter {
  stream: WriteStream
  input_file: string | null = null
  //RAM[256-2047]
  stack: Array<number> = []
  //RAM[0]
  SP: number = 0
  //RAM[1]
  LCL = null
  //RAM[2]
  ARG = null
  //RAM[3]
  THIS = null
  //RAM[4]
  THAT = null
  constructor(file: string) {
    this.stream = createWriteStream(file + '.asm')
  }
  setFileName(fileName: string) {
    this.input_file = fileName
  }
  writeArithmetic(command: string) {
    let ans = 0
    if (command == 'add') {
      ans = this.stack[--this.SP] + this.stack[--this.SP]
    }
    if (command == 'sub') {
      ans = this.stack[--this.SP] - this.stack[--this.SP]
    }
    this.stack[this.SP++] = ans
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
    this.stream.write(`@${ans}\n`)
    this.stream.write('D=A\n')
    this.stream.write(`@${this.SP + 256}\n`)
    this.stream.write('M=D\n')
  }
  writePushPop(command: number, segment: string, index: number) {
    if (command === COMMAND_TYPE.C_PUSH) {
      if (segment === 'constructor') {
        this.stack[this.SP++] = index
      }
    }
  }
}
