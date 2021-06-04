import Parser from './Parser'
import { COMMAND_TYPE } from './Parser'
import CodeWriter from './CodeWriter'
const argv = process.argv
const inputFile = argv[2]
const asmFileName = argv[3]

const main = async () => {
  const parser = new Parser(inputFile)
  const writer = new CodeWriter(asmFileName)
  while (parser.hasmoreCommands()) {
    console.log(1)
    await parser.advance()
    let arg1 = null,
      arg2 = null
    const cmdType = parser.commandType()
    if (cmdType !== COMMAND_TYPE.C_RETURN) {
      arg1 = parser.arg1()
    }
    if (
      cmdType === COMMAND_TYPE.C_PUSH ||
      cmdType === COMMAND_TYPE.C_POP ||
      cmdType === COMMAND_TYPE.C_FUNCTION ||
      cmdType === COMMAND_TYPE.C_CALL
    ) {
      arg2 = parser.arg2()
    }
    writer.writePushPop(cmdType, arg1, arg2)
    console.log(parser.current[0])
    writer.writeArithmetic(parser.current[0])
  }
}

main()
