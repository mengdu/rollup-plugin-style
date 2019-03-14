import path from 'path'
import fs from 'fs'
import mkdirp from 'mkdirp'

import { createFilter } from 'rollup-pluginutils'

export default function plugin (options = {}) {
  options.include = options.include || ['**/*.css']
  options.exclude = options.exclude || []
  options.output = options.output || 'inline' // style, file, inline
  options.compile = options.compile || async function (code, type) {
    return code
  }

  async function joinStyle (list) {
    const styleList = []

    for (let id in list) {
      list[id].code && styleList.push(await options.compile(list[id].code, list[id].extname))
    }

    return styleList.join('')
  }

  const filter = createFilter(options.include, options.exclude)
  const styles = {}

  return {
    name: 'style',
    async intro () {
      if (options.output !== 'style') return null

      const styleText = await joinStyle(styles)

      return `
        ;(function () {
          function __insertStyle (css) {
            var style = document.createElement('style')
            style.innerHTML = css
            style.type = 'text/css'
            document.head.appendChild(style)
          };
          __insertStyle(${JSON.stringify(styleText)});
        })();
      `
    },
    async transform (code, id) {
      if (!filter(id)) return
      const extname = path.extname(id)
      if (options.output === 'inline') {
        return {
          code: 'export default ' + JSON.stringify(await options.compile(code, extname)),
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
    async generateBundle (opts, bundle, isWrite) {
      if (options.output === 'inline') {
        return null
      }

      const styleText = await joinStyle(styles)

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
