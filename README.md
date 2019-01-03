# rollup-plugin-style

A style plugin for rollup.

> unpublish

**use**

```ls
...
plugins: [
  ...
  style(options)
]
```

### options

+ **options.include** include file; default `['**/*.css']`
+ **options.exclude** exclude file; default `[]`
+ **options.output** output type; `style`, `inline`, `file`; default `inline`.
  
  - `style` will create a style tag.
  - `inline` use for `import cssText from './xxx.css`.
  - `file` output to file.

+ **options.dest** output file dir.
+ **options.compile** compile handler.
