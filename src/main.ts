import fs, { Dirent } from 'node:fs'
import type { OptionValues } from 'commander'

type FileType = {
  name: string
  type: string
  contents?: FileType[]
}

class YGTree {
  constructor(opts: OptionValues) {
    this.path = opts.pattern || '.'
    this.level = Number(opts.level) || 0

    if (opts.gitignore) {
      const gitgnore = this.FilterIgnoresFile(this.path)
      this.ignores = gitgnore
    }
  }

  private _path: string = '.'
  public get path(): string {
    return this._path
  }
  public set path(value: string) {
    this._path = value
  }
  private _level: number = 0
  public get level(): number {
    return this._level
  }
  public set level(value: number) {
    this._level = value
  }

  // private write: string
  private _ignores: Array<RegExp> = []
  public get ignores(): Array<RegExp> {
    return this._ignores
  }
  public set ignores(value: Array<RegExp>) {
    this._ignores = value
  }

  public Readdir(): string {
    const files = this.ContentsFilter(this.path)
    const write = this.WiteFileConsole(files)
    return write
  }
  // 排
  private ContentsFilter(path: string): FileType[] {
    const ignores = this.ignores
    const files = fs.readdirSync(path, {
      withFileTypes: true,
    })
    const fileFilter = files.filter(item => {
      let bol = true
      for (let index = 0; index < ignores.length; index++) {
        const element = ignores[index]
        bol = !element.test(item.name)
        if (!bol) return
      }
      return bol
    })

    const folder = fileFilter
      .filter(
        item =>
          !item.isFile() &&
          !item.isSymbolicLink() &&
          item.name.indexOf('.') !== 0,
      )
      .sort(this.compare)
      .map(item => {
        const contents = this.ContentsFilter(`${path}/${item.name}`)
        return {
          name: item.name,
          type: 'directory',
          contents: contents,
        }
      })
    const documented = fileFilter
      .filter(item => item.isFile() && !item.isSymbolicLink())
      .sort(this.compare)
      .map(item => ({ name: item.name, type: 'file' }))

    const fileSort = (folder as FileType[]).concat(documented)

    return fileSort
  }

  // 写
  private WiteFileConsole(
    files: FileType[],
    level: number = 1,
    isLast: boolean = false,
  ): string {
    const arr = files.map((item, index) => {
      let levelStr = isLast
        ? `${new Array(level - 1).join('│   ')}    `
        : new Array(level).join('│   ')

      if (
        item.contents &&
        item.contents.length &&
        level !== 0 &&
        level !== this.level
      ) {
        const symbol =
          item.contents.length === 1 && index === files.length - 1
            ? `${levelStr}└── `
            : `${levelStr}├── `
        const isLast = item.contents.length === 1 && index === files.length - 1

        return `${symbol}${item.name}\n${this.WiteFileConsole(
          item.contents,
          level + 1,
          isLast,
        )}`
      }

      if (index === files.length - 1) {
        return `${levelStr}└── ${item.name}`
      }
      return `${levelStr}├── ${item.name}`
    })

    return arr.join('\n')
  }
  // 过滤 .gitignore
  private FilterIgnoresFile(path: string): RegExp[] {
    const files = fs.readdirSync(path, {
      withFileTypes: true,
    })
    const gitignore = files.find(item => item.name === '.gitignore')?.name
    if (!gitignore) {
      return []
    }
    const gitignoreContext = fs.readFileSync(gitignore as string, 'utf-8')
    const gitignoreContextNames = gitignoreContext
      .toString()
      .split('\n')
      .filter(item => item.length)
      .filter(item => item.indexOf('#') !== 0)
      .map(item => {
        let str =
          item.indexOf('*') === 0
            ? `/${item}`
            : item.lastIndexOf('/') === item.length - 1
            ? item.split('/')[0]
            : item

        return new RegExp(str)
      })
    return gitignoreContextNames
  }
  private compare(a: Dirent, b: Dirent) {
    const AName = a.name.toLocaleLowerCase()
    const BName = b.name.toLocaleLowerCase()
    if (AName < BName) {
      return -1
    }
    if (AName > BName) {
      return 1
    }
    return 0
  }
}

export default YGTree
