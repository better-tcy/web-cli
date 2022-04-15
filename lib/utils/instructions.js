// 执行终端命令相关的代码

// 开启子进程模块
const {
  spawn
} = require('child_process'); // node内置模块

const commandSpawn = (...args) => {
  return new Promise((resolve, reject) => {
    // 本质上install的时候是开启另一个进程 在另一个进程里面执行的
    // 会返回执行这个命令所在的进程
    const childProcess = spawn(...args);
    // 返回的进程里面有一个流 里面有这个进程执行当中所有的信息 也就是install安装的一些信息
    // 然后把这些信息 给主进程也就是process的流 
    // 然后主进程就可以获取到子进程执行的所有信息了 
    // 然后在控制台 主进程中 就可以看到子进程(install) 执行过程中的所有信息了

    childProcess.stdout.pipe(process.stdout); //安装信息
    childProcess.stderr.pipe(process.stderr); //错误信息

    childProcess.on("error", () => {
      reject()
    })

    // 进程执行完毕
    childProcess.on("close", () => {
      resolve();
    })
  })

}

module.exports = {
  commandSpawn
}