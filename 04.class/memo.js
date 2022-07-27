process.stdin.resume()
process.stdin.setEncoding('utf8')
const fs = require('fs')
const memosContent = JSON.parse(fs.readFileSync('memo.json', 'utf8'))
const argv = require('minimist')(process.argv.slice(2))
const { v4: uuidv4 } = require('uuid')
const { Select } = require('enquirer')
const reader = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

const memoData = []
reader.on('line', (line) => {
  memoData.push(line)
})
reader.on('close', () => {
  const newMemo =
  {
    message: memoData[0],
    value: uuidv4(),
    content: memoData.join('\n')
  }
  memosContent.Memos.push(newMemo)
  const newMemos = JSON.stringify(memosContent)
  fs.writeFileSync('memo.json', newMemos)
})

if (argv.l === true) {
  for (let i = 0; i < memosContent.Memos.length; i++) {
    console.log(memosContent.Memos[i].message)
  }
  process.stdin.pause()
} else if (argv.r === true) {
  const prompt = new Select({
    message: '表示したいメモを選択してください:',
    choices: memosContent.Memos

  })
  prompt.run()
    .then(answer => {
      const indexNum = prompt.choices.findIndex(({ value }) => value === answer)
      return indexNum
    })
    .then(indexNum => {
      const fileContent = JSON.parse(fs.readFileSync('memo.json', 'utf8'))
      console.log(fileContent.Memos[indexNum].content)
    })
    .catch(console.error)
} else if (argv.d === true) {
  const prompt = new Select({
    message: '削除したいメモを選択してください:',
    choices: memosContent.Memos
  })
  prompt.run()
    .then(answer => {
      const indexNum = prompt.choices.findIndex(({ value }) => value === answer)
      return indexNum
    })
    .then(indexNum => {
      const fileContent = JSON.parse(fs.readFileSync('memo.json', 'utf8'))
      fileContent.Memos.splice(indexNum, 1)
      fs.writeFileSync('memo.json', JSON.stringify(fileContent))
    })
    .then(answer =>
      console.log('メモが削除されました')
    )
    .catch(console.error)
}
