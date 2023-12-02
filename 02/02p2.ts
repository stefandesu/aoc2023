const isTest = Deno.args[0] === "test"
const testResult = 2286

const input = await Deno.readTextFile(`./${isTest ? "test" : "input"}.txt`)

let sum = 0

for (const line of input.split("\n").filter(Boolean)) {
  const [_, content] = line.match(/^Game \d+:(.*)$/) || []
  if (!content) {
    throw new Error(`Issue on line ${line}.`)
  }
  const mins:any = {
    red: 0,
    green: 0,
    blue: 0,
  }
  const draws = content.replaceAll(",", ";").split(";")
  for (const draw of draws) {
    const [_, num, color] = draw.trim().match(/^(\d+) (.*)$/) || []
    if (parseInt(num) > mins[color]) {
      mins[color] = parseInt(num)
    }
  }
  const power = mins.red * mins.green * mins.blue
  sum += power
  isTest && console.log(line, power)
}

console.log(sum)

if (isTest) {
  if (sum === testResult) {
    console.log("The test seems to be successful!")
  } else {
    console.error("The test didn't go quite right...")
  }
}
