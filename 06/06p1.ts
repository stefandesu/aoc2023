import { readLines } from "../utils.ts"
const isTest = Deno.args[0] === "test"
const isDebug = isTest || Deno.args[0] === "debug"
const testResult = 288

let races
let result = 1

for await (const line of readLines(`./${isTest ? "test" : "input"}.txt`)) {
  if (!races) {
    // Save times
    races = line.split(" ").map(a => a.trim()).filter(Boolean).slice(1).map(time => ({ time: parseInt(time) }))
  } else if (line !== "") {
    // Save distances
    races = line.split(" ").map(a => a.trim()).filter(Boolean).slice(1).map((distance, index) => ({ time: races[index].time, distance: parseInt(distance) }))
  }
}

isDebug && console.log(races)

// Analyze races
for (const race of races) {
  let waysToWin = 0
  for (let time = 1; time < race.time; time += 1) {
    const distance = time * (race.time - time)
    if (distance > race.distance) {
      waysToWin += 1
    }
  }
  result *= waysToWin
}

console.log(result)

if (isTest) {
  if (result === testResult) {
    console.log("The test seems to be successful!")
  } else {
    console.error("The test didn't go quite right...")
  }
}
