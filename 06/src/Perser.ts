import { createReadStream, ReadStream, readFileSync } from 'fs'
import * as readline from 'readline'

const COMMAND_TYPE = {
  A_COMMAND: 'A',
  C_COMMAND: 'C',
  L_COMMAND: 'L',
}
type COMMAND_TYPE = typeof COMMAND_TYPE[keyof typeof COMMAND_TYPE]
class Perser {
  file: string
  stream: ReadStream
  readline: readline.Interface
  current: string = ''
  type: string = ''
  constructor(file: string) {
    this.file = file
    this.stream = createReadStream(file, {
      encoding: 'utf-8',
      highWaterMark: 256,
    })
    this.readline = readline.createInterface({ input: this.stream })
  }

  hasMoreCommands(): boolean {
    return this.stream.readable
  }

  async advance(): Promise<void> {
    if (!this.hasMoreCommands()) return

    this.readline.once('line', (line) => {
      if (line.startsWith('//') || line.trim() === '') this.advance()
      this.current = line
    })
    this.commandType()
  }

  commandType(): COMMAND_TYPE {
    if (this.current.startsWith('@')) {
      return COMMAND_TYPE.A_COMMAND
    } else if (this.current.startsWith('(')) {
      return COMMAND_TYPE.L_COMMAND
    } else {
      return COMMAND_TYPE.C_COMMAND
    }
  }

  symbol(): string {
    if (this.commandType() === COMMAND_TYPE.A_COMMAND)
      return this.current.slice(1)
    else if (this.commandType() === COMMAND_TYPE.L_COMMAND)
      return this.current.slice(1, -1)
    else throw Error('command type must be A_COMMAND or L_COMMAND')
  }

  dest(): string | null {
    if (this.current.includes('='))
      return this.current.slice(0, this.current.indexOf('='))
    else return null
  }

  comp(): string {
    if (this.current.includes('='))
      return this.current.slice(
        this.current.indexOf('=') + 1,
        this.current.indexOf(';')
      )
    else return this.current.slice(0, this.current.indexOf(';'))
  }

  jump(): string | null {
    if (this.current.includes(';')) {
      return this.current.slice(this.current.indexOf(';') + 1)
    }
    return null
  }
}

const perser = new Perser('06/add/Add.asm')
perser.advance()
