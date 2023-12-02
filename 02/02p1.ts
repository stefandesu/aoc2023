const isTest = Deno.args[0] === "test"
const testResult = 8

const input = await Deno.readTextFile(`./${isTest ? "test" : "input"}.txt`)

const load:any = {
  red: 12,
  green: 13,
  blue: 14,
}

let sum = 0

for (const line of input.split("\n").filter(Boolean)) {
  const [_, id, content] = line.match(/^Game (\d+):(.*)$/) || []
  if (!content) {
    throw new Error(`Issue on line ${line}.`)
  }
  let valid = true
  const draws = content.replaceAll(",", ";").split(";")
  for (const draw of draws) {
    const [_, num, color] = draw.trim().match(/^(\d+) (.*)$/) || []
    if (parseInt(num) > load[color]) {
      valid = false
    }
  }
  if (valid) {
    sum += parseInt(id)
  }
  isTest && console.log(line, valid)
}

console.log(sum)

if (isTest) {
  if (sum === testResult) {
    console.log("The test seems to be successful!")
  } else {
    console.error("The test didn't go quite right...")
  }
}
