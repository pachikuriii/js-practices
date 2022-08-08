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

class Memo {
  constructor (memoData) {
    this.message = memoData[0]
    this.value = uuidv4()
    this.content = memoData.join('\n')
  }
}

class MemoApp {
  constructor () {
    this.memosContent = memosContent
    this.showPrompt = new Select({
      message: '表示したいメモを選択してください',
      choices: memosContent.Memos
    })
    this.deletePrompt = new Select({
      message: '削除したいメモを選択してください',
      choices: memosContent.Memos
    })
  }

  create (newMemo) {
    this.memosContent.Memos.push(newMemo)
    fs.writeFileSync('memo.json', JSON.stringify(this.memosContent))
  }

  show () {
    for (let i = 0; i < this.memosContent.Memos.length; i++) {
      console.log(this.memosContent.Memos[i].message)
    }
  }

  detail (indexNum) {
    console.log(this.memosContent.Memos[indexNum].content)
  }

  delete (indexNum) {
    this.memosContent.Memos.splice(indexNum, 1)
    fs.writeFileSync('memo.json', JSON.stringify(this.memosContent))
  }

  showPrompt () {
    return this.showPrompt
  }

  deletePrompt () {
    return this.deletePrompt
  }
}

const memoData = []
const memoApp = new MemoApp(memosContent)
reader.on('line', (line) => {
  memoData.push(line)
})
reader.on('close', () => {
  memoApp.create(new Memo(memoData))
})

if (argv.l) {
  memoApp.show()
  process.exit()
} else if (argv.r) {
  memoApp.showPrompt.run()
    .then(answer => {
      const indexNum = memoApp.showPrompt.choices.findIndex(({ value }) => value === answer)
      return indexNum
    })
    .then(indexNum => {
      memoApp.detail(indexNum)
    })
    .catch(console.error)
} else if (argv.d) {
  memoApp.deletePrompt.run()
    .then(answer => {
      const indexNum = memoApp.deletePrompt.choices.findIndex(({ value }) => value === answer)
      return indexNum
    })
    .then(indexNum => {
      memoApp.delete(indexNum)
    })
    .then(answer =>
      console.log('メモが削除されました')
    )
    .catch(console.error)
}
