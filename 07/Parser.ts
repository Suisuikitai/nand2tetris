import * as fs from 'fs'
import * as readline from 'readline'
//1行ずつ非同期で読みたいならある程度纏まって読み取った後
//改行文字列で分割してさらにループするまたは、
//1byte?(改行コードのデータ量)ずつ読み取って改行が来たら返すしかないかも

export const COMMAND_TYPE = {
  C_ARITHMETIC: 1,
  C_PUSH: 2,
  C_POP: 3,
  C_LABEL: 4,
  C_GOTO: 5,
  C_IF: 6,
  C_FUNCTION: 7,
  C_RETURN: 8,
  C_CALL: 9,
}
type COMMAND_TYPE = typeof COMMAND_TYPE[keyof typeof COMMAND_TYPE]

export default class Parser {
  file: string
  moreLine: boolean
  stream: fs.ReadStream
  current: string = ''
  rl: readline.Interface
  constructor(file: string) {
    this.file = file
    this.moreLine = true
    this.stream = fs.createReadStream(file)
    this.rl = readline.createInterface(this.stream)
    this.rl.on('line', (line: string) => {
      this.current = line.replace(/\/\/.*$/, '').replace(/\s/, '')
      if (this.current === '') this.advance()
      console.log(this.current)
    })
  }

  hasmoreCommands() {
    return !(this.current === 'EOF')
  }

  async advance() {}

  commandType() {
    if (this.current.startsWith('push')) return COMMAND_TYPE.C_PUSH
    else if (this.current.startsWith('pop')) return COMMAND_TYPE.C_POP
    else return COMMAND_TYPE.C_ARITHMETIC
  }

  arg1() {
    if (this.commandType() === COMMAND_TYPE.C_ARITHMETIC) return this.current
    else return this.current.split(' ')[1]
  }

  arg2() {
    return this.current.split(' ')[2]
  }
}

const p = new Parser('StackArithmetic/SimpleAdd/SimpleAdd.vm')
p.advance()

const s = fs.createReadStream('07/StackArithmetic/SimpleAdd/SimpleAdd.vm')
const rl = readline.createInterface(s)
rl.on('line', (line) => console.log(line))
