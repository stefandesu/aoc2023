
const isTest = Deno.args[0] === "test"

const input = await Deno.readTextFile(`./${isTest ? "test1" : "input"}.txt`)
let sum = 0

// TODO: Reading the whole file, then splitting it is not very efficient...
for (const line of input.split("\n").filter(Boolean)) {
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
