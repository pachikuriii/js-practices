process.stdin.setEncoding('utf8')

const fs = require('fs')
const lines = []
const reader = require('readline').createInterface({
  input: process.stdin
})

reader.on('line', (line) => { // 改行ごとに"line"イベントが発火
  lines.push(line) // lines配列に、標準入力から渡されたデータを入れる
})
reader.on('close', () => { // 標準入力のストリームが終了すると呼ばれる

  const lines2 = JSON.stringify(
    { Title: lines[0], Memo: lines[1] + lines[2] + lines[3] }, null, ' ')
  fs.writeFileSync('memo.json', lines2)

})

const argv = require('minimist')(process.argv.slice(2))
const { Select } = require('enquirer');
if (argv.r === true) {
  const prompt = new Select({
    name: 'title',
    message: 'Choose a note you want to see:',
    choices: ['apple', 'grape', 'watermelon', 'cherry', 'orange']
  });

  prompt.run()
    .then(answer => console.log(answer))
    .catch(console.error);
} else if (argv.l === true) {
  const jsonObject = JSON.parse(fs.readFileSync('./memo.json', 'utf8'));
  console.log(jsonObject.Title)
} else if (argv.d === true) {
  const prompt = new Select({
    name: 'title',
    message: 'Choose a note you want to delete:',
    choices: ['apple', 'grape', 'watermelon', 'cherry', 'orange']
  });
  prompt.run()
    .then(answer => console.log(answer))
    .catch(console.error);
}