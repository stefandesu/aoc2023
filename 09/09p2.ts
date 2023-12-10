import { readLines } from "../utils.ts"
const isTest = Deno.args[0] === "test"
const isDebug = isTest || Deno.args[0] === "debug"
const testResult = 2

let result = 0

for await (const line of readLines(`./${isTest ? "test" : "input"}.txt`)) {
  if (!line) {
    continue
  }
  const sequence = line.split(" ").map(n => parseInt(n))
  const sequences = [sequence]
  while (sequences[sequences.length - 1].find(n => n !== 0)) {
    const lastSequence = sequences[sequences.length - 1]
    const nextSequence = lastSequence.reduce((acc, cur, index) => {
      if (index > 0) {
        acc.push(cur - lastSequence[index - 1])
      }
      return acc
    }, [])
    sequences.push(nextSequence)
  }
  isDebug && console.log(sequences.join("\n"))
  const nextValue = sequences.reverse().reduce((prev, cur) => {
    return cur[0] - prev
  }, 0)
  isDebug && console.log(nextValue)
  result += nextValue
  isDebug && console.log()
}

console.log(result)

if (isTest) {
  if (result === testResult) {
    console.log("The test seems to be successful!")
  } else {
    console.error("The test didn't go quite right...")
  }
}
