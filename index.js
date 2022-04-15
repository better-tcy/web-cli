#!/usr/bin/env node
const program = require('commander')

const createCommands = require('./lib/commands/create')

// 在终端里输入 node index.js --version
program.version(require('./package.json').version) // 回应版本号

createCommands()

program.parse(process.argv) // 解析终端里面传过来的参数
