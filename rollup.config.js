const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const Eslint = require('rollup-plugin-eslint')
const babel = require('rollup-plugin-babel')
// const Uglify = require('rollup-plugin-uglify')
const pkg = require('./package.json')

const banner =
  '/*!\n' +
  ' * Build version v' + pkg.version + '\n' +
  ' * Create by lanyue@qq.com\n' +
  ' * Created at ' + new Date() + '\n' +
  ' */'

// const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      banner: banner,
      sourcemap: false
    }
  ],
  external: [
    'rollup-pluginutils',
    'mkdirp',
    'path',
    'fs',
    '@babel/runtime/regenerator',
    '@babel/runtime/helpers/asyncToGenerator'
  ],
  plugins: [
    Eslint.eslint({
      exclude: ['node_modules/**']
    }),
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
      // externalHelpers: false
    })
  ]
}
