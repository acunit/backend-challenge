const apiBase = 'https://api.github.com'

// Added progress for showing the progress of the request
const ProgressBar = require('progress')
// library for parsing command line options
const commandLineArgs = require('command-line-args')
const axios = require('axios')
const chalk = require('chalk')
const config = require('./config')
const http = axios.create({
  baseURL: apiBase,
  headers: {
    Authorization: `token ${config.GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
})

// Defining the command line arguments
const optionDefinitions = [
  { name: 'repo', alias: 'r', type: String },
  { name: 'period', type: String },
]

// Setting number patter for removing the letter from the period request
const numberPattern = /\d+/g

// Parsing the options from the command line and assign to variables
const options = commandLineArgs(optionDefinitions)
const repo = options.repo
const period = !options.period
  ? 'all comments'
  : `comments for past ${options.period.match(numberPattern)[0]} day(s)`

// Log request with the parameters specified
console.log(`  Fetching ${period} for "${repo}"...`)

// Progress Bar rendering
const bar = new ProgressBar(':bar', { total: 10 })
const timer = setInterval(function() {
  bar.tick()
  if (bar.complete) {
    console.log('\ncomplete\n')
    clearInterval(timer)
  }
}, 100)

async function printComments() {
  try {
    // GET commit comments
    // const commitCommentsPromise = await http.get(`/repos/${repo}/comments`)
    // console.dir(commitComments)
    // GET issues comments
    const issuesCommentsPromise = await http.get(`/repos/${repo}/issues/comments`)
    console.dir(issuesComments.data)
    // GET pull request comments
    // const pullRequestComments = await http.get(`/repos/${repo}/pulls/comments`)
    // console.dir(pullRequestComments)
  } catch (err) {
    console.error(chalk.red(err))
    console.dir(err.response.data, { colors: true, depth: 4 })
  }
}

printComments()
