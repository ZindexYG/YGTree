import fs from 'node:fs'
import path from 'node:path'

const getPackageJson = () => {

  const packagePath = path.join(path.resolve(__dirname, '..'), 'package.json')
  let packageJson
  // 读取文件
  try {
    packageJson = fs.readFileSync(packagePath, 'utf-8')
  } catch (err) {
    throw new Error(`The package.json file at '${packagePath}' does not exist`)
  }
  // 文件解析
  try {
    packageJson = JSON.parse(packageJson)
  } catch (err) {
    throw new Error('The package.json is malformed')
  }

  return packageJson
}

export default getPackageJson
