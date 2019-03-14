# rollup-plugin-style

A style plugin for rollup.

**use**

```ls
...
plugins: [
  ...
  style(options)
]
```

### options

+ **options.include** Include file; default `['**/*.css']`
+ **options.exclude** Exclude file; default `[]`
+ **options.output** Output type; `style`, `inline`, `file`; default `inline`.
  
  - `style` The style tag will be automatically generated and inserted into head.
  - `inline` Use for `import cssText from './xxx.css`.
  - `file` Output to file.

+ **options.dest** Output file dir.
+ **options.compile = async (code, extname) => {}** Compiler handler support.
