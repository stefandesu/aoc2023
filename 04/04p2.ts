import { readLines } from "../utils.ts"
const isTest = Deno.args[0] === "test"
const isDebug = isTest || Deno.args[0] === "debug"
const testResult = 30

let sum = 0
const additionalCopies: any = {}

for await (const line of readLines(`./${isTest ? "test" : "input"}.txt`)) {
  const [, cardNumberStr, winningNumbersStr, myNumbersStr] = line.match(/^Card\s+(\d+)\: ([^|]+) \| ([^|]+)$/) || []
  const cardNumber = parseInt(cardNumberStr)
  const winningNumbers = winningNumbersStr.split(" ").map(n => n.trim()).filter(Boolean)
  const myNumbers = myNumbersStr.split(" ").map(n => n.trim()).filter(Boolean)

  // Let's just bruteforce it...
  let matches = 0
  for (const number of myNumbers) {
    if (winningNumbers.findIndex(n => n === number) !== -1) {
      matches += 1
    }
  }
  
  const numberOfCurrentCopies = (additionalCopies[cardNumber] || 0) + 1

  isDebug && console.log(cardNumberStr, winningNumbers, myNumbers, "Matches:", matches, "Copies:", numberOfCurrentCopies)

  while (matches !== 0) {
    additionalCopies[cardNumber + matches] = (additionalCopies[cardNumber + matches] || 0) + numberOfCurrentCopies
    matches -= 1
  }

  sum += numberOfCurrentCopies
  isDebug && console.log("Running sum:", sum)
}

isDebug && console.log(additionalCopies)

console.log(sum)

if (isTest) {
  if (sum === testResult) {
    console.log("The test seems to be successful!")
  } else {
    console.error("The test didn't go quite right...")
  }
}
