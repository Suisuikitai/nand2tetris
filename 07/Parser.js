const fs = require('fs')
const readline = require('readline')

export const COMMAND_TYPE = {
  C_ARITHMETIC: 1,
  C_PUSH: 2,
  C_POP: 3,
  C_LABEL: 4,
  C_GOTO: 5,
  C_IF: 6,
  C_FUNCTION: 7,
  C_RETURN: 8,
  C_CALL: 9
}

class Parser {
  file
  stream
  rl
  current
  constructor(file) {
    this.file = file
    this.stream = fs.createReadStream(file)
    this.rl = readline.createInterface(this.stream)
  }

  hasmoreCommands() {
    return !this.stream.readableEnded
  }

  async advance() {
    for await (const line of this.rl) {
      if (line.replace(/\/\/.*$/g, '').trim() === '') continue
      this.current = line
      return
    }
  }

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

const main = async () => {
  const p = new Parser('./sample.txt')
  console.log(p.hasmoreCommands())
  await p.advance().then(a => { console.log(a) })
  console.log(p.hasmoreCommands())
}

main()