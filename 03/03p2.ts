import { readLines } from "../utils.ts"
const isTest = Deno.args[0] === "test"
const isDebug = isTest || Deno.args[0] === "debug"
const testResult = 467835

let row = 1, sum = 0
const symbolsByRow:any = {}, numbers:any = []

// First read data
for await (const line of readLines(`./${isTest ? "test" : "input"}.txt`)) {
  let match
  
  // Find numbers in line
  let toParse = line
  while (match = toParse.match(/(\d+)/)) {
    const index = match.index as number
    const entry = {
      length: match[0].length,
      row,
      column: line.length - toParse.length + index,
      number: parseInt(match[0]),
    }
    numbers.push(entry)
    toParse = toParse.slice(index + entry.length)
  }
  // Find symbols in line
  toParse = line, match = null
  symbolsByRow[row] = []
  while (match = toParse.match(/([^\.\d])/)) {
    const index = match.index as number
    const entry = {
      row,
      column: line.length - toParse.length + index,
      // Actually doesn't matter which symbol
      symbol: match[0],
      nearNumbers: [],
    }
    symbolsByRow[row].push(entry)
    toParse = toParse.slice(index + 1)
  }

  if (isDebug) {
    console.log(line)
    console.log(numbers.filter(n => n.row === row))
    console.log(symbolsByRow[row])
  }
  row += 1
}

// Then go through all numbers and check if they have a symbol near them
for (const number of numbers) {
  let symbolFound = false

  for (let row = number.row - 1; row <= number.row + 1; row += 1) {
    const matches = (symbolsByRow[row] || []).filter(s => s.symbol === "*" && s.column >= number.column -1 && s.column <= number.column + number.length)
    matches.forEach(symbol => {
      symbol.nearNumbers.push(number.number)
    })
  }
}

// Find all the nears and build sum, reusing "row" from above
for (let currentRow = 1; currentRow < row; currentRow += 1) {
  for (const symbol of symbolsByRow[currentRow]) {
    if (symbol.nearNumbers.length === 2) {
      sum += symbol.nearNumbers[0] * symbol.nearNumbers[1]
    }
  }
}

console.log(sum)

if (isTest) {
  if (sum === testResult) {
    console.log("The test seems to be successful!")
  } else {
    console.error("The test didn't go quite right...")
  }
}
