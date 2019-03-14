const rollup = require('rollup')
const style = require('../dist')

async function build (params) {
  const bundle = await rollup.rollup({
    input: 'test/demo/index.js',
    plugins: [
      style({
        output: 'file',
        dest: 'test/demo/dist/css/test.css',
        compile: function (code, extname) {
          return new Promise(function (resolve) {
            console.log(code, extname)
            resolve(code)
          })
        }
      })
    ]
  })

  await bundle.write({
    format: 'umd',
    file: 'test/demo/dist/index.js'
  })
  console.log('Build done')
}

build()
