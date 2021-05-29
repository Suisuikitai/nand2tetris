import Parser from './Parser'
import { COMMAND_TYPE } from './Parser'
import CodeWriter from './CodeWriter'
const argv = process.argv
const inputFile = argv[2]
const asmFileName = argv[3] ? argv[3] : argv[2].slice(-3)

const main = async () => {
  const parser = new Parser(argv[2])
  const writer = new CodeWriter(asmFileName)
  writer.setFileName(inputFile)
  while (parser.hasmoreCommands()) {
    console.log('a')
    parser.advance()
    const commandType = parser.commandType()
    let arg1 = null
    if (commandType !== COMMAND_TYPE.C_RETURN) {
      arg1 = parser.arg1()
    }
    let arg2 = null
    if (
      commandType === COMMAND_TYPE.C_PUSH ||
      commandType === COMMAND_TYPE.C_POP ||
      commandType === COMMAND_TYPE.C_FUNCTION ||
      commandType === COMMAND_TYPE.C_CALL
    ) {
      arg2 = parser.arg2()
    }
    if (commandType == COMMAND_TYPE.C_ARITHMETIC) {
      writer.writeArithmetic(parser.current)
    } else if (
      commandType === COMMAND_TYPE.C_PUSH ||
      commandType === COMMAND_TYPE.C_POP
    ) {
      writer.writePushPop(commandType, parser.arg1(), parseInt(parser.arg2()))
    }
  }
}

main()