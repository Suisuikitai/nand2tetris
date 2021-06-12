import Parser from './Parser'
import { COMMAND_TYPE } from './Parser'
import CodeWriter from './CodeWriter'
const argv = process.argv
const inputFile = argv[2]
const asmFileName = argv[3]

const main = async () => {
  const parser = new Parser(inputFile)
  const writer = new CodeWriter(asmFileName)
  let fileName = inputFile.split('/').slice(-1)[0]
  writer.setFileName(fileName.slice(0, -3))
  writer.writeInit()
  await parser.advance((line: [string]) => {
    parser.current = line
    let arg1 = null,
      arg2 = null
    const cmdType = parser.commandType()
    if (cmdType === COMMAND_TYPE.C_RETURN) {
      writer.writeReturn()
      return
    }
    arg1 = parser.arg1()

    if (cmdType === COMMAND_TYPE.C_LABEL) {
      writer.writeLabel(arg1)
    } else if (cmdType === COMMAND_TYPE.C_GOTO) {
      writer.writeGoto(arg1)
    } else if (cmdType === COMMAND_TYPE.C_IF) {
      writer.writeIf(arg1)
    } else {
      arg2 = parser.arg2()

      if (cmdType === COMMAND_TYPE.C_PUSH || cmdType === COMMAND_TYPE.C_POP) {
        writer.writePushPop(cmdType, arg1, arg2)
      } else if (cmdType === COMMAND_TYPE.C_FUNCTION) {
        writer.writeFunction(arg1, arg2)
      } else if (cmdType === COMMAND_TYPE.C_CALL) {
        writer.writeCall(arg1, arg2)
      }
    }
    writer.writeArithmetic(parser.current[0])
  })
}

main()
