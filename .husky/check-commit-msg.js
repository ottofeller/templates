const {HUSKY_DEBUG} = process.env

function debug(debugMessage) {
  if (HUSKY_DEBUG === '1') {
    console.log(`husky (debug) - ${debugMessage}`)
  }
}

const pattern = /^\w{2,4}-\d+\s/
const message = process.argv[2]
debug(`Test message "${message}" with pattern "${pattern}".`)

if (!pattern.test(message)) {
  console.error(`"${message}" - malformed commit message. Prepend the message with the task ID (e.g. pla-123).`)
  process.exit(1)
}
