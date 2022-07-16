const argv = require('minimist')(process.argv.slice(2))

const year = argv.y
const month = argv.m

const lastDay = new Date(year, month, 0)
const last_Day = lastDay.getDate()
const firstDay = new Date(year, month - 1, 2, -1)
const first_Day = firstDay.getDate()
let first_Wday = firstDay.getDay()

title = month + '月' + year
console.log(title.padStart(13, (' ')))
console.log('日 月 火 水 木 金 土')
process.stdout.write(''.padStart(first_Wday * 3))

for (day = first_Day; day <= last_Day; day++) {
  day = (' ' + day).slice(-2)
  first_Wday++

  if (first_Wday % 7 === 0) {
    console.log(day)
  } else {
    process.stdout.write(String(day) + ' ')
  }
}
