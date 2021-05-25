import Code from './Code'
import Perser, { COMMAND_TYPE } from './Parser'
import SymbolTable from './SymbolTable'
import * as fs from 'fs'

const argv = process.argv

const parser1 = new Perser(argv[2])
const parser2 = new Perser(argv[2])
const writer = fs.openSync(argv[2].slice(0, -3) + 'hack', 'w')
const symbolTable = new SymbolTable()
let address = 16
let line = 0

const registerLabel = () => {
  while (parser1.hasMoreCommands()) {
    parser1.advance()
    const commandType = parser1.commandType()

    if (commandType === COMMAND_TYPE.L_COMMAND) {
      const symbol = parser1.symbol()
      symbolTable.addEntry(symbol, line)
      continue
    }
    line++
  }
}

const handleAOrder = () => {
  const val = parser2.symbol()
  if (!symbolTable.contains(val) && isNaN(parseInt(val)))
    symbolTable.addEntry(val, address++)

  if (isNaN(parseInt(val))) {
    const binary = (
      '0000000000000000' + symbolTable.getAddress(val).toString(2)
    ).slice(-16)
    fs.writeSync(writer, binary + '\n')
  } else {
    const binary = ('0000000000000000' + parseInt(val).toString(2)).slice(-16)
    fs.writeSync(writer, binary + '\n')
  }
}

const handleCOrder = () => {
  const comp = Code.comp(parser2.comp())
  const dest = Code.dest(parser2.dest())
  const jump = Code.jump(parser2.jump())
  const binary = `111${comp}${dest}${jump}`
  fs.writeFileSync(writer, binary + '\n')
}

const main = () => {
  registerLabel()

  while (parser2.hasMoreCommands()) {
    parser2.advance()
    const commandType = parser2.commandType()

    if (commandType === COMMAND_TYPE.A_COMMAND) {
      handleAOrder()
    }
    if (commandType === COMMAND_TYPE.C_COMMAND) {
      handleCOrder()
    }
  }
  symbolTable.symbolTable.forEach((v, k) => {
    console.log(v, k)
  })
}

main()
