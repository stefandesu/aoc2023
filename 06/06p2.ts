import { readLines } from "../utils.ts"
const isTest = Deno.args[0] === "test"
const isDebug = isTest || Deno.args[0] === "debug"
const testResult = 71503

let race = {}
let result = 1

for await (const line of readLines(`./${isTest ? "test" : "input"}.txt`)) {
  if (!race.time) {
    // Save time
    race.time = parseInt(line.replaceAll(/[^\d]/g, ""))
  } else if (line !== "") {
    // Save distance
    race.distance = parseInt(line.replaceAll(/[^\d]/g, ""))
  }
}

isDebug && console.log(race)

// Analyze race (brute-force lol) TODO: Make more efficient
let waysToWin = 0
for (let time = 1; time < race.time; time += 1) {
  const distance = time * (race.time - time)
  if (distance > race.distance) {
    waysToWin += 1
  }
}
result = waysToWin

console.log(result)

if (isTest) {
  if (result === testResult) {
    console.log("The test seems to be successful!")
  } else {
    console.error("The test didn't go quite right...")
  }
}
