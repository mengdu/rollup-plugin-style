const rollup = require('rollup')
const style = require('../dist')

async function build (params) {
  const bundle = await rollup.rollup({
    input: 'test/demo/index.js',
    plugins: [
      style({
        output: 'file',
        dest: 'test/demo/dist/css/test.css'
      })
    ]
  })

  await bundle.write({
    format: 'umd',
    file: 'test/demo/dist/index.js'
  })
}

build()
