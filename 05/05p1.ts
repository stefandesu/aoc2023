import { readLines } from "../utils.ts"
const isTest = Deno.args[0] === "test"
const isDebug = isTest || Deno.args[0] === "debug"
const testResult = 35

let seeds:any = []
let map:any = []

function mapNumbers() {
  isDebug && console.log("mapping", map)
  // Map numbers
  for (let index = 0; index < seeds.length; index += 1) {
    const match = map.find(e => seeds[index] >= e.sourceStart && seeds[index] <= e.sourceStart + e.range)
    isDebug && console.log(seeds[index], match)
    if (match) {
      seeds[index] = match.targetStart + seeds[index] - match.sourceStart
    }
  }
  isDebug && console.log(seeds)
}

for await (const line of readLines(`./${isTest ? "test" : "input"}.txt`)) {
  if (!seeds.length) {
    const [, seedStrings] = line.match(/^seeds\: (.*)/) || []
    seeds = seedStrings.split(" ").map(s => parseInt(s))
    continue
  }
  if (line === "") {
    mapNumbers()
  } else {
    const [numbers] = line.match(/^\d.*/) || []
    if (!numbers) {
      map = []
      continue
    }
    const [targetStart, sourceStart, range] = numbers.split(" ").map(number => parseInt(number))
    isDebug && console.log(targetStart, sourceStart, range)
    map.push({
      sourceStart,
      targetStart,
      range,
    })
  }
}
mapNumbers()

isDebug && console.log(seeds)
const result = Math.min(...(seeds || []))

console.log(result)

if (isTest) {
  if (result === testResult) {
    console.log("The test seems to be successful!")
  } else {
    console.error("The test didn't go quite right...")
  }
}
