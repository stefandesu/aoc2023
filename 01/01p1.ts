import { readLines } from "../utils.ts"
const isTest = Deno.args[0] === "test"

let sum = 0

for await (const line of readLines(`./${isTest ? "test1" : "input"}.txt`)) {
  let [_, firstDigit, lastDigit] = line.match(/^\D*(\d).*?(\d)?\D*$/) || []
  if (firstDigit === undefined) {
    throw new Error(`Something wrong in line ${line}`)
  }
  if (lastDigit === undefined) {
    lastDigit = firstDigit
  }
  // We know these are both digits, so this will succed
  const num = parseInt(`${firstDigit}${lastDigit}`)
  sum += num
  isTest && console.log(line, num)
}

console.log(sum)

// Check with example
if (isTest) {
  if (sum === 142) {
    console.log("The test seems to be successful!")
  } else {
    console.error("The test didn't go quite right...")
  }
}
