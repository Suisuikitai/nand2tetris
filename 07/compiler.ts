import Parser from './Parser'
import { COMMAND_TYPE } from './Parser'
import CodeWriter from './CodeWriter'
import * as fs from 'fs'

const argv = process.argv
const inputDir = argv[2]
const asmFileName = argv[3]

const writer = new CodeWriter(asmFileName)
writer.writeInit()
const main = async (inputFile: string) => {
  const parser = new Parser(inputFile)
  const fileName = inputFile.split('/').slice(-1)[0]
  await parser.advance((line: [string]) => {
    writer.setFileName(fileName.slice(0, -3))
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
    if (cmdType === COMMAND_TYPE.C_ARITHMETIC)
      writer.writeArithmetic(parser.current[0])
  })
}

fs.readdirSync(inputDir, { withFileTypes: true })
  .filter((dirent: fs.Dirent) => {
    return dirent.isFile() && dirent.name.endsWith('.vm')
  })
  .map((dirent: fs.Dirent) => {
    main(inputDir + '/' + dirent.name)
  })
