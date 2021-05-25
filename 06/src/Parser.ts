import { createReadStream, ReadStream, readFileSync } from 'fs'
export const COMMAND_TYPE = {
  A_COMMAND: 'A',
  C_COMMAND: 'C',
  L_COMMAND: 'L',
}
type COMMAND_TYPE = typeof COMMAND_TYPE[keyof typeof COMMAND_TYPE]
export default class Perser {
  file: string
  textArray: Array<string>
  type: string = ''
  currentIndex = 0
  current = ''
  constructor(file: string) {
    this.file = file
    this.textArray = readFileSync(file, 'ascii')
      .split('\n')
      .filter((v) => {
        return !v.startsWith('//') && v.trim() !== ''
      })
      .map((v) => {
        let val = v.replace(/\s/g, '').replace(/\/\/.*$/g, '')
        return val
      })
  }

  hasMoreCommands(): boolean {
    return this.currentIndex !== this.textArray.length
  }

  advance(): void {
    if (this.hasMoreCommands()) {
      this.current = this.textArray[this.currentIndex++]
    }
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
    if (this.current.includes('=') && this.current.includes(';'))
      return this.current.slice(
        this.current.indexOf('=') + 1,
        this.current.indexOf(';')
      )
    else if (this.current.includes('=')) {
      return this.current.slice(this.current.indexOf('=') + 1)
    } else return this.current.slice(0, this.current.indexOf(';'))
  }

  jump(): string | null {
    if (this.current.includes(';')) {
      return this.current.slice(this.current.indexOf(';') + 1)
    }
    return null
  }
}
