import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'

export default [
  {
    input: './src/index.ts',
    output: {
      file: './dist/index.js',
      format: 'cjs',
      banner: '#!/usr/bin/env node',
    },
    plugins: [resolve(), commonjs(), typescript()],
  },
]
