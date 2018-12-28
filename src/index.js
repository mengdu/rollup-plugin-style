import path from 'path'
import fs from 'fs'
import mkdirp from 'mkdirp'

import { createFilter } from 'rollup-pluginutils'
console.log(process.env.NODE_ENV)
export default function plugin (options) {
  options = options || {
    include: ['**/*.css'],
    exclude: []
  }
  const filter = createFilter(options.include, options.exclude)
  const styles = {}

  return {
    name: 'style',
    intro () {
      console.log('intro')
      return '// intro'
    },
    outro () {
      console.log('outro', styles)
      return '// outro'
    },
    transform (code, id) {
      if (!filter(id)) return
      // const extname = path.extname(id)

      console.log('transform', id)
      if (options.output === false) {
        return {
          code: 'export default ' + JSON.stringify(code),
          map: { mappings: '' }
        }
      }

      if (styles[id] !== code) {
        styles[id] = code
      }
      // 返回空字符串
      return ''
    },
    generateBundle (opts, bundle, isWrite) {
      console.log('generateBundle')
      console.log(opts, bundle)

      if (options.output === false) {
        return null
      }

      let entry = null

      for (let key in bundle) {
        if (bundle[key].isEntry) {
          entry = bundle[key]
        }
      }

      if (!entry) return null

      const styleList = []
      for (let id in entry.modules) {
        if (filter(id)) {
          if (styles[id]) styleList.push(styles[id])
        }
      }

      console.log(styleList)

      const filePath = typeof options.output === 'string' ? options.output : opts.file.replace(path.extname(opts.file), '.css')
      const dir = path.dirname(filePath)

      return new Promise(function (resolve, reject) {
        mkdirp(dir, function (err) {
          if (err) reject(err)

          fs.writeFile(filePath, styleList.join(''), function (err) {
            if (err) reject(err)

            resolve()
          })
        })
      })
    }
  }
}
