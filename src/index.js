import path from 'path'
import fs from 'fs'
import mkdirp from 'mkdirp'

import { createFilter } from 'rollup-pluginutils'

function compileStyle (code, type) {
  return code
}

function joinStyle (list) {
  const styleList = []

  for (let id in list) {
    list[id].code && styleList.push(compileStyle(list[id].code, list[id].extname))
  }

  if (styleList.length === 0) return null

  return styleList.join('')
}

export default function plugin (options = {}) {
  options.include = options.include || ['**/*.css']
  options.exclude = options.exclude || []
  options.output = options.output || 'inline' // style, file, inline

  const filter = createFilter(options.include, options.exclude)
  const styles = {}

  return {
    name: 'style',
    intro () {
      if (options.output !== 'style') return null

      const styleText = joinStyle(styles)

      return `function __insertStyle (css) {
        const style = document.createElement('style')
        style.innerHTML = css
        style.type = 'text/css'
        document.head.appendChild(style)
      };
      __insertStyle(${JSON.stringify(styleText)});
      `
    },
    transform (code, id) {
      if (!filter(id)) return
      const extname = path.extname(id)
      if (options.output === 'inline') {
        return {
          code: 'export default ' + JSON.stringify(compileStyle(code, extname)),
          map: { mappings: '' }
        }
      }

      if (styles[id] !== code) {
        styles[id] = {
          extname,
          code
        }
      }
      // 返回空字符串
      return ''
    },
    generateBundle (opts, bundle, isWrite) {
      if (options.output === 'inline') {
        return null
      }

      const styleText = joinStyle(styles)

      if (options.output !== 'file') return null

      const filePath = options.dest ? options.dest : opts.file.replace(path.extname(opts.file), '.css')
      const dir = path.dirname(filePath)

      return new Promise(function (resolve, reject) {
        mkdirp(dir, function (err) {
          if (err) reject(err)

          fs.writeFile(filePath, styleText, function (err) {
            if (err) reject(err)

            resolve()
          })
        })
      })
    }
  }
}
