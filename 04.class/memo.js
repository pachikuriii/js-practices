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

  detail (indexNum) {
    console.log(this.memosContent.Memos[indexNum].content)
  }

  delete (indexNum) {
    this.memosContent.Memos.splice(indexNum, 1)
    fs.writeFileSync('memo.json', JSON.stringify(this.memosContent))
  }

  prompt (displayMessage) {
    return this.#select(displayMessage)
  }

  #select (displayMessage) {
    const select = new Select({
      message: displayMessage,
      choices: this.memosContent.Memos
    })
    return select
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
  memoApp.prompt('表示したいメモを選択してください').run()
    .then(answer => {
      const indexNum = memoApp.prompt('表示したいメモを選択してください').choices.findIndex(({ value }) => value === answer)
      return indexNum
    })
    .then(indexNum => {
      memoApp.detail(indexNum)
    })
    .catch(console.error)
} else if (argv.d) {
  memoApp.prompt('削除したいメモを選択してください').run()
    .then(answer => {
      const indexNum = memoApp.prompt('削除したいメモを選択してください').choices.findIndex(({ value }) => value === answer)
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
