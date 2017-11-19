const apiBase = 'https://api.github.com'

// Added progress for showing the progress of the request
const ProgressBar = require('progress')
// library for parsing command line options
const commandLineArgs = require('command-line-args')
// Left pad for aligning text
const leftPad = require('left-pad')
const axios = require('axios')
const chalk = require('chalk')
const config = require('./config')
const http = axios.create({
  baseURL: apiBase,
  headers: {
    Authorization: `token ${config.GITHUB_PERSONAL_ACCESS_TOKEN}`,
    // added pagination so the most recent items show
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
    // GET commit comments and store user names
    const commitsUsers = await http
      .get(`/repos/${repo}/comments?per_page=100`)
      .then(res => {
        // create an array to store the login
        let users = new Array()
        // loop over each comment and add login name to users Array
        res.data.forEach(function(comment) {
          users.push(comment.user.login)
        })
        // count number of comments user made on all of the repo
        return users
      })
    // GET issues comments and store user names
    const issuesUsers = await http
      .get(`/repos/${repo}/issues/comments?per_page=100`)
      .then(res => {
        // create an array to store the login
        let users = new Array()
        // loop over each comment and add login name to users Array
        res.data.forEach(function(comment) {
          users.push(comment.user.login)
        })
        // count number of comments user made on all of the repo
        return users
      })
    // GET pull request comments and store user names
    const pullsUsers = await http
      .get(`/repos/${repo}/pulls/comments?per_page=100`)
      .then(res => {
        // create an array to store the login
        let users = new Array()
        // loop over each comment and add login name to users Array
        res.data.forEach(function(comment) {
          users.push(comment.user.login)
        })
        // count number of comments user made on all of the repo
        return users
      })
    // comments is an array with all of the instances a name shows up from comments
    const comments = commitsUsers + issuesUsers + pullsUsers
    console.log(comments)
    // GET stats of the contributors and store as object
    // GET /repos/:owner/:repo/stats/contributors
    const stats = await http
      .get(`/repos/${repo}/stats/contributors`)
      .then(res => {
        let users = new Array()
        res.data.forEach(function(contributor) {
          let user = {
            name: contributor.author.login,
            totalCommits: Number(contributor.total),
            totalComments: null,
          }
          users.push(user)
        })
        // Sort users object by number of commits
        users.sort(function(a, b) {
          return parseFloat(b.totalCommits) - parseFloat(a.totalCommits)
        })
        // return user object to be saved as const stats
        return users
        // let users = {}
        // console.log(res.data[0].total, res.data[0].author)
      })
    // console.log(stats)
    for (let user of stats) {
      for (let comment of comments) {
        
      }
      console.log(
        `${leftPad(user.totalCommits, 4)} comments, ${user.name} ( commits)`,
      )
    }
  } catch (err) {
    console.error(chalk.red(err))
    console.dir(err.response.data, { colors: true, depth: 4 })
  }
}

printComments()
