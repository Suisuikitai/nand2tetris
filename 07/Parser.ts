import * as fs from 'fs'
import * as readline from 'readline'
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

  async advance(handleLine: Function): Promise<void> {
    for await (const line of this.rl) {
      const l = line
        .replace(/\/{2}.*$/, '')
        .trim()
        .split(' ')
      if (l.length === 1 && l[0] === '') continue
      else {
        handleLine(l)
      }
    }
  }

  commandType() {
    if (this.current[0] === 'push') return COMMAND_TYPE.C_PUSH
    else if (this.current[0] === 'pop') return COMMAND_TYPE.C_POP
    else if (this.current[0] === 'label') return COMMAND_TYPE.C_LABEL
    else if (this.current[0] === 'goto') return COMMAND_TYPE.C_GOTO
    else if (this.current[0] === 'if-goto') return COMMAND_TYPE.C_IF
    else if (this.current[0] === 'function') return COMMAND_TYPE.C_FUNCTION
    else if (this.current[0] === 'return') return COMMAND_TYPE.C_RETURN
    else if (this.current[0] === 'call') return COMMAND_TYPE.C_CALL
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
