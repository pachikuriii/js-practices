process.stdin.setEncoding('utf8')

const lines = []
const reader = require('readline').createInterface({
  input: process.stdin
})

reader.on('line', (line) => { // 改行ごとに"line"イベントが発火
  lines.push(line) // lines配列に、標準入力から渡されたデータを入れる
})
reader.on('close', () => { // 標準入力のストリームが終了すると呼ばれる
  console.log(lines)
})
