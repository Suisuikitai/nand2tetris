import { createWriteStream, WriteStream } from 'fs'
import { COMMAND_TYPE } from './Parser'
//VMコマンドは行ごとに分かれている

export default class CodeWriter {
  stream: WriteStream
  input_file: string | null = null
  jumpCount = 0
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
      this.stream.write('A=M\n')
      this.stream.write('D=M\n')

      this.stream.write('@SP\n')
      this.stream.write('A=M-1\n')
      this.stream.write('D=D+M\n')

      this.stream.write('@SP\n')
      this.stream.write('A=M-1\n')
      this.stream.write('M=D\n')
    } else if (command === 'eq') {
      this.stream.write('@SP\n')
      this.stream.write('M=M-1\n') //SP:258->257
      this.stream.write('A=M\n')
      this.stream.write('D=M\n')

      this.stream.write('@SP\n')
      this.stream.write('A=M-1\n') //A=257-1 M[257]->M[256]
      this.stream.write('D=D-M\n') //D=M[257]-M[256]

      this.stream.write(`@JEQ_true${this.jumpCount}`)
      this.stream.write('D;JEQ')

      this.stream.write(`@JEQ_false${this.jumpCount}`)
      this.stream.write('0;JEQ')

      //-1をstackに積む
      this.stream.write(`(JEQ_true${this.jumpCount})`)
      this.stream.write('A=M-1\n')
      this.stream.write('M=1\n')
      this.stream.write(`@END${this.jumpCount}`)
      this.stream.write('0;JEQ')

      //0をstackに積む
      this.stream.write(`(JEQ_false${this.jumpCount})`)
      this.stream.write('A=M-1\n')
      this.stream.write('M=0\n')

      //処理終了
      this.stream.write(`(END${this.jumpCount})`)
      this.jumpCount++
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
      }
    }
  }
}
