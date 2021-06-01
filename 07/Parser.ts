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
  current: Array<string> = []
  moreLine: boolean
  stream: fs.ReadStream
  rl: readline.Interface
  constructor(file: string) {
    this.file = file
    this.moreLine = true
    this.stream = fs.createReadStream(file)
    this.rl = readline.createInterface(this.stream)
  }

  hasmoreCommands() {
    return !(this.current.length === 1 && this.current[0] === '')
  }

  advance() {
    const getLineGen = async function* (rl: readline.Interface) {
      for await (const line of rl) {
        const l = line
          .replace(/\/{2}.*$/, '')
          .trim()
          .split(' ')
        if (l.length === 1 && l[0] === '') continue
        yield l
      }
      return ['']
    }
    return (async () => {
      const val = (await getLineGen(this.rl).next()).value
      this.current = val
    })()
  }

  commandType() {
    if (this.current[0] === 'push') return COMMAND_TYPE.C_PUSH
    else if (this.current[0] === 'pop') return COMMAND_TYPE.C_POP
    else return COMMAND_TYPE.C_ARITHMETIC
  }

  arg1() {
    if (this.commandType() === COMMAND_TYPE.C_ARITHMETIC) return this.current[0]
    else return this.current[1]
  }

  arg2() {
    return parseInt(this.current[2])
  }
}
