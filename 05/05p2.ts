import { readLines } from "../utils.ts"
const isTest = Deno.args[0] === "test"
const isDebug = isTest || Deno.args[0] === "debug"
const testResult = 46

let seeds:any = []
let map:any = []

function mapNumbers() {
  isDebug && console.log("mapping", map)
  // Sort map by sourceStart to find first match
  map.sort((a, b) => a.sourceStart - b.sourceStart)
  let length = seeds.length
  // Map numbers
  for (let index = 0; index < length; index += 2) {
    const start = seeds[index], count = seeds[index + 1], end = start + count - 1
    let match
    if (match = map.find(e => e.sourceStart <= start && start <= e.sourceStart + e.range - 1)) {
      // Case 1: We can map numbers from the beginning of the range
      const newStart = match.targetStart + start - match.sourceStart
      let newCount = count
      if (end > match.sourceStart + match.range) {
        newCount = count - (end - match.sourceStart - match.range + 1)
        // Add leftover to seeds as new range
        length += 2
        isDebug && console.log(match.sourceStart + match.range, end - match.sourceStart - match.range)
        seeds.push(match.sourceStart + match.range)
        seeds.push(count - newCount)
      }
      seeds[index] = newStart
      seeds[index + 1] = newCount
    } else if (match = map.find(e => start < e.sourceStart && end >= e.sourceStart)) {
      // Case 2: We can map numbers in a later part of the range
      // Leave first, unmappable part as is (reducing "count" of current seed range)
      seeds[index + 1] = match.sourceStart - start
      // Add rest as separate seed range
      length += 2
      seeds.push(match.sourceStart)
      seeds.push(end - match.sourceStart + 1)
    } else {
      // Case 3: Range completely outside of map -> do nothing
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
const result = Math.min(...seeds.reduce((acc, value, index) => {
  if (index % 2 === 0) {
    acc.push(value)
  }
  return acc
}, []))

console.log(result)

if (isTest) {
  if (result === testResult) {
    console.log("The test seems to be successful!")
  } else {
    console.error("The test didn't go quite right...")
  }
}
