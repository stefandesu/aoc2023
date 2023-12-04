import { readLines } from "../utils.ts"
const isTest = Deno.args[0] === "test"
const isDebug = isTest || Deno.args[0] === "debug"
const testResult = 13

let sum = 0

for await (const line of readLines(`./${isTest ? "test" : "input"}.txt`)) {
  const [, cardNumberStr, winningNumbersStr, myNumbersStr] = line.match(/^Card\s+(\d+)\: ([^|]+) \| ([^|]+)$/) || []
  const winningNumbers = winningNumbersStr.split(" ").map(n => n.trim()).filter(Boolean)
  const myNumbers = myNumbersStr.split(" ").map(n => n.trim()).filter(Boolean)

  // Let's just bruteforce it...
  let matches = 0
  for (const number of myNumbers) {
    if (winningNumbers.findIndex(n => n === number) !== -1) {
      matches += 1
    }
  }
  if (matches) {
    sum += 2 ** (matches - 1)
  }

  isDebug && console.log(cardNumberStr, winningNumbers, myNumbers, "Matches:", matches, "Running sum:", sum)
}

console.log(sum)

if (isTest) {
  if (sum === testResult) {
    console.log("The test seems to be successful!")
  } else {
    console.error("The test didn't go quite right...")
  }
}
