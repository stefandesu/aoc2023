import { readLines } from "../utils.ts"
const isTest = Deno.args[0] === "test"
const isDebug = isTest || Deno.args[0] === "debug"
const testResult = 6

let result = 0, instructions = "", nodes: any = {}

for await (const line of readLines(`./${isTest ? "test1" : "input"}.txt`)) {
  if (!line) {
    continue
  }
  if (!instructions) {
    instructions = line
    continue
  }
  const [, node, L, R] = line.match(/^(.*) = \((.*), (.*)\)$/) || []
  nodes[node] = { node, L, R }
}

isDebug && console.log(nodes)

let current = "AAA", steps = 0

while (current !== "ZZZ") {
  const instruction = instructions[steps % instructions.length]
  steps += 1
  current = nodes[current][instruction]
}

result = steps

console.log(result)

if (isTest) {
  if (result === testResult) {
    console.log("The test seems to be successful!")
  } else {
    console.error("The test didn't go quite right...")
  }
}
