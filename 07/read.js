const fs = require('fs')
// const stream = fs.createReadStream('./sample.txt')

const displayFile = (file) => {
  const buff_size = 100
  const buff_pos = 0
  const read_size = 10
  const buff = Buffer.alloc(buff_size)

  let str = ''
  let pos = 0
  let size = 0
  try {
    const fd = fs.openSync(file)
    let count = 1
    while ((size = fs.readSync(fd, buff, buff_pos, read_size, pos)) !== 0) {
      console.log(size)
      const index = buff.toString('utf-8').indexOf('\n')
      str = buff.toString('utf-8', 0, index).split('\n')
      pos += index + 1
      console.log(str)
    }
    fs.closeSync(fd)
  } catch (e) {
    console.log(e)
  }
}
displayFile('./07/sample.txt')