const fs = require('fs')
// const stream = fs.createReadStream('./sample.txt')

const displayFile = (file) => {
  const buff_size = 100
  let buff_pos = 0
  const read_size = 10
  let buff = Buffer.alloc(buff_size)

  let str = ''
  let pos = 0
  let size = 0
  try {
    const fd = fs.openSync(file)
    let count = 1
    //bufferに読みこむ
    while ((size = fs.readSync(fd, buff, 0, buff_size, pos)) !== 0) {
      const str_size = buff.indexOf('\n')
      console.log(str_size)
      count++
      console.log(str_size)
      pos = pos + str_size + 1
      str = buff.slice(0, str_size).toString('utf-8', 0, str_size)
      console.log(str)
    }
  } catch (e) {
    console.log(e)
  }
}
// displayFile('./07/sample.txt')

const readline = require('readline')
const displayFileRL = (() => {
  const stream = fs.createReadStream('./07/sample.txt')
  const rl = readline.createInterface(stream)
  const getLineGen = async function* (a) {
    for await (const line of rl) {
      const l = line
        .replace(/\/{2}.*$/, '')
        .replace(/\s+/, ' ')
        .trim()
        .split(' ')
      if (l.length === 1 && l[0] === '') {
        continue
      } else {
        yield l
      }
    }
  };
  return async () => ((await getLineGen(1).next()).value)
})();

const main = async () => {
  if ((f = await displayFileRL()) !== undefined) {
    console.log(f)
    main()
  }
}
main()