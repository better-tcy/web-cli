// 从github拉取项目的函数
const download = require('download-git-repo')

const ora = require('ora')
const inquirer = require('inquirer')

const fs = require('fs')

// github地址
const { reactCmsAddress, vueCmsAddress } = require('../assets/projectAddress')

// 开启子进程 执行对应的命令
const { commandSpawn } = require('../utils/instructions')

const createProjectAction = async (project, others) => {
  let warehouse = others[0]
  let command = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  let templateAddress = ''
  let startUp = ''

  if (warehouse !== 'react' && warehouse !== 'vue2') {
    console.log(`下载失败 ${warehouse}不存在 目前只支持输入react和vue2`)
    return
  }

  if (warehouse === 'react') {
    templateAddress = reactCmsAddress
    startUp = 'start'
  } else if (warehouse === 'vue2') {
    templateAddress = vueCmsAddress
    startUp = 'serve'
  }

  const processTips = ora(`${warehouse}版本基础模板开始下载...`)
  processTips.start()
  processTips.color = 'yellow'
  processTips.text = `${warehouse}版本基础模板正在下载..... `

  // 1.clone项目

  try {
    await new Promise((resolve, reject) => {
      download(
        templateAddress,
        project,
        {
          clone: false
        },
        function (err) {
          if (err) {
            processTips.color = 'red'
            processTips.text = `下载失败 可能是网络问题,请再次重试`
            processTips.fail()
            reject(err)
          } else {
            resolve()
          }
        }
      )
    })
  } catch (err) {
    // console.log(err)
    return
  }

  // 检测项目中 是否有package.json
  try {
    await new Promise((resolve, reject) => {
      fs.access(`./${project}/package.json`, fs.constants.F_OK, (err) => {
        if (err) {
          reject()
        } else {
          processTips.color = 'green'
          processTips.text = `${warehouse}版本基础模板下载成功,准备安装依赖...过程可能稍长,请耐心等待`
          processTips.succeed()
          resolve()
        }
      })
    })
  } catch (err) {
    processTips.color = 'red'
    processTips.text = `下载失败 可能是网络问题,请再次重试`
    processTips.fail()
    return
  }

  if (warehouse === 'react') {
    const yarnOptions = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'useYarn',
        message:
          '您当前下载的是react模板,是否使用yarn来操作？（如果您电脑没有安装yarn,cli会帮您自动安装）',
        default: true
      }
    ])

    if (yarnOptions.useYarn) {
      command = process.platform === 'win32' ? 'yarn.cmd' : 'yarn'
      try {
        await commandSpawn(command, ['-v'])
      } catch (err) {
        await commandSpawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', [
          'install',
          'yarn',
          '-g'
        ])
      }
    }
  }

  // install
  const taobaoOptions = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'taobao',
      message: '是否临时切换到淘宝镜像去安装依赖？（淘宝镜像可能会存在同步依赖库不及时）',
      default: true
    }
  ])

  if (taobaoOptions.taobao) {
    await commandSpawn(command, ['--registry', 'https://registry.npm.taobao.org', 'install'], {
      cwd: `./${project}`
    })
  } else {
    await commandSpawn(command, ['install'], {
      cwd: `./${project}`
    })
  }

  // 启动项目
  commandSpawn(command, ['run', startUp], {
    cwd: `./${project}`
  })
}

module.exports = {
  createProjectAction
}
