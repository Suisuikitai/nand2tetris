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
    this.stream = createWriteStream(file)
  }
  setFileName(fileName: string) {
    this.input_file = fileName
  }
  writeArithmetic(command: string) {
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
      this.stream.write('@SP\n')
      this.stream.write('M=M-1\n')
      this.SP--
      this.stream.write('A=M\n')
      this.stream.write('D=M\n')
      this.stream.write('@SP\n')
      this.stream.write('A=M-1\n')
      this.stream.write('D=D+M\n')
      this.stream.write('@SP\n')
      this.stream.write('A=M-1\n')
      this.stream.write('M=D\n')
    }
  }
  writePushPop(cmdType: number, segment: string | null, index: number | null) {
    /**
     * push constant 7
     * push constant 8
     * これをどうやってアセンブリに変換するのが正解か
     */
    if (cmdType === COMMAND_TYPE.C_PUSH) {
      if (segment === 'constant') {
        //indexがnullになることはないため一旦これでよしとする
        this.stream.write(`@${index}\n`)
        this.stream.write('D=A\n')
        this.stream.write('@SP\n')
        this.stream.write('A=M\n')
        this.stream.write('M=D\n')
        this.stream.write('@SP\n')
        this.stream.write('M=M+1\n')
        this.stack[this.SP++] = index
      }
    }
  }
}
