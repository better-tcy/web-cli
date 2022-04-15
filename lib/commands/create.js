const program = require('commander')

const { createProjectAction } = require('./actions')

const createCommands = () => {
  //创建指令
  program
    .command('create <project> [others...]') // [others...] 可选参数 可跟多个
    .description('clone a repository into a folder') // 对create指令的描述
    .action((project, others) => {
      // 用户敲了create指令之后 就会执行action这里
      createProjectAction(project, others)
    })
}

module.exports = createCommands
