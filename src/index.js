const apiBase = 'https://api.github.com'

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
