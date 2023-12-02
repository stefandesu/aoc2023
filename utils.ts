/**
 * Async iterator for reading a text file line by line.
 * 
 * Partly inspired by https://deno.land/x/readline@v1.1.0/mod.ts?source
 * 
 * @param filename name of text file to read
 */
export async function* readLines(filename: string) {
  const separator = "\n"
  const file = await Deno.open(filename, { read: true })
  const decoder = new TextDecoder()
  let text = ""
  for await (const chunk of file.readable) {
    text = text.concat(decoder.decode(chunk))
    let index
    while ((index = text.indexOf(separator)) >= 0) {
      const line = text.slice(0, index)
      text = text.slice(index + separator.length)
      yield line
    }
  }
  if (text) {
    yield text
  }
}
