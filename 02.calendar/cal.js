const argv = require('minimist')(process.argv.slice(2))
const today = new Date()
const thisYear = today.getFullYear()
const thisMonth = today.getMonth() + 1

let year
if (argv.y === undefined) {
  year = thisYear
} else {
  year = argv.y
}

let month
if (argv.m === undefined) {
  month = thisMonth
} else if (argv.m < 1 || argv.m > 12) {
  console.log('有効な値を入力してください')
  month = thisMonth
} else {
  month = argv.m
}

const lastDay = new Date(year, month, 0)
const lastDayNum = lastDay.getDate()
const firstDay = new Date(year, month - 1, 2, -1)
const firstDayNum = firstDay.getDate()
let firstWday = firstDay.getDay()

const title = month + '月 ' + year
console.log(title.padStart(14, (' ')))
console.log('日 月 火 水 木 金 土')
process.stdout.write(''.padStart(firstWday * 3, ' '))

for (let day = firstDayNum; day <= lastDayNum; day++) {
  firstWday++
  day = String(day).padStart(2, ' ')
  if (firstWday % 7 === 0) {
    console.log(day)
  } else {
    process.stdout.write(String(day) + ' ')
  }
}
