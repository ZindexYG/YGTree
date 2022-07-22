import { Command } from 'commander'
import YGTree from './main'
import getPkg from './utils/getPkg'
import {
  LevelInvalidArgumentError,
  PattenInvalidArgumentError,
} from './utils/argumentError'

const program = new Command()

// 错误
if (process.argv.length <= 2) {
  console.log(
    '无效命令： %s\n —help 或者 -h 获取可用命令的列表',
    program.args.join(' '),
  )
  process.exit()
}
// 选项定义
program
  .name(getPkg().name)
  .description(getPkg().description)
  .version(getPkg().version)
  .option('-A, --all', '打印所有目录')
  .option<string>(
    '-L, --level <levelNum>',
    '仅下降级到 level 目录深处',
    LevelInvalidArgumentError,
    '-1',
  )
  .option<string | null>(
    '-P, --pattern <path>',
    '指定目录',
    PattenInvalidArgumentError,
    null,
  )
  .option('--gitignore', '使用 .gitignore 文件过滤')


program.on('command:*', () => {
  console.log(
    '无效命令： %s\n —help 或者 -h 获取可用命令的列表',
    program.args.join(' '),
  )
  return
})

program.parse()

const opts = program.opts()
const MdTree = new YGTree(opts)

// All
if (opts.all) {
  const tree = MdTree.Readdir()
  console.log(tree)
}

// Level
if (opts.level !== '-1' && !opts.pattern) {
  console.log(MdTree.Readdir())
}

// pattern
if (opts.pattern) {
  console.log(MdTree.Readdir())
}

// gitignore
if (opts.gitignore) {
  console.log(MdTree.Readdir())
}
