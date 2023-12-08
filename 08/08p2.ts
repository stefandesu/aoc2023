import { readLines } from "../utils.ts"
const isTest = Deno.args[0] === "test"
const isDebug = isTest || Deno.args[0] === "debug"
const testResult = 6

let result = 0, instructions = "", nodes: any = {}

// Stolen from https://www.geeksforgeeks.org/javascript-program-to-find-lcm-of-two-numbers/ 🙈
function gcd(a, b) { 
  for (let temp = b; b !== 0;) { 
      b = a % b; 
      a = temp; 
      temp = b; 
  } 
  return a; 
} 
function lcmFunction(a, b) { 
  const gcdValue = gcd(a, b); 
  return (a * b) / gcdValue; 
} 

// Added myself
function lcm(array) {
  if (array.length === 2) {
    return lcmFunction(...array)
  }
  return lcmFunction(array[0], lcm(array.slice(1)))
}

for await (const line of readLines(`./${isTest ? "test2" : "input"}.txt`)) {
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

let current = Object.keys(nodes).filter(node => node.endsWith("A")), step = 0, steps = []
isDebug && console.log(current)

// We're saving the number of steps for each node, then calculate the lowest common multiple of those numbers
// (the result is so big that the brute force approach takes forever)
while (current.length) {
  const instruction = instructions[step % instructions.length]
  step += 1
  const previousLength = current.length
  current = current.map(n => nodes[n][instruction]).filter(n => !n.endsWith("Z"))
  if (current.length !== previousLength) {
    steps.push(step)
  }
}
console.log(steps)
result = lcm(steps)

console.log(result)

if (isTest) {
  if (result === testResult) {
    console.log("The test seems to be successful!")
  } else {
    console.error("The test didn't go quite right...")
  }
}
