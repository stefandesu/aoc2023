import { readLines } from "../utils.ts"
const isTest = Deno.args[0] === "test"

let sum = 0
// TODO: Use proper TypeScript lol
const numberStrings:any = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
}

for await (const line of readLines(`./${isTest ? "test2" : "input"}.txt`)) {
  // TODO: Is it possible to do it in a singular regex? (I had trouble making it work with greedy/lazy matching correctly)
  // TODO: Also, we can use `numberStrings` above for the written-out numbers instead of repeating them here
  let [_a, firstDigit] = line.match(/^.*?(one|two|three|four|five|six|seven|eight|nine|\d)/) || []
  let [_b, lastDigit] = line.match(/.*(one|two|three|four|five|six|seven|eight|nine|\d).*?$/) || []
  if (firstDigit === undefined) {
    throw new Error(`Something wrong in line ${line}`)
  }
  if (numberStrings[firstDigit]) {
    firstDigit = numberStrings[firstDigit]
  }
  if (lastDigit === undefined) {
    lastDigit = firstDigit
  } else if (numberStrings[lastDigit]) {
    lastDigit = numberStrings[lastDigit]
  }
  // We know these are both digits, so this will succed
  const num = parseInt(`${firstDigit}${lastDigit}`)
  sum += num
  isTest && console.log(line, num)
}

console.log(sum)

// Check with example
if (isTest) {
  if (sum === 281) {
    console.log("The test seems to be successful!")
  } else {
    console.error("The test didn't go quite right...")
  }
}
