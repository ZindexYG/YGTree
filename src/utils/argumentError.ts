import fs, { Dirent } from 'node:fs'
import { InvalidArgumentError } from 'commander'

// level
export const LevelInvalidArgumentError = (value: string): string => {
  const parsedValue = parseInt(value, 10)
  if (isNaN(parsedValue)) {
    throw new InvalidArgumentError('Not a number.')
  }
  return value
}

// pattern
export const PattenInvalidArgumentError = (value: string): string => {
  try {
    fs.readdirSync(value, { withFileTypes: true })
    return value
  } catch (error) {
    throw new InvalidArgumentError('No such file or directory')
  }
}
export {}
