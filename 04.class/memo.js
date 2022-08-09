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

  detail (displayMessage) {
    this.#selectMemo(displayMessage).run()
      .then(answer =>
        this.#findIndexNum(displayMessage, answer))
      .then(indexNum => {
        console.log(this.memosContent.Memos[indexNum].content)
      })
      .catch(console.error)
  }

  delete (displayMessage) {
    this.#selectMemo(displayMessage).run()
      .then(answer =>
        this.#findIndexNum(displayMessage, answer))
      .then(indexNum => {
        this.memosContent.Memos.splice(indexNum, 1)
        fs.writeFileSync('memo.json', JSON.stringify(this.memosContent))
      })
      .then(answer =>
        console.log('メモが削除されました')
      )
      .catch(console.error)
  }

  prompt (displayMessage) {
    return this.#selectMemo(displayMessage)
  }

  #selectMemo (displayMessage) {
    const memo = new Select({
      message: displayMessage,
      choices: this.memosContent.Memos
    })
    return memo
  }

  #findIndexNum (displayMessage, answer) {
    const indexNum = memoApp.prompt(displayMessage).choices.findIndex(({ value }) => value === answer)
    return indexNum
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
  memoApp.detail('表示したいメモを選択してください')
} else if (argv.d) {
  memoApp.delete('削除したいメモを選択してください')
}
