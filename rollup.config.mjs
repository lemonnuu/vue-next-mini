import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
// import typescript from 'rollup-plugin-typescript2'
import typescript from '@rollup/plugin-typescript'

console.log('的骄傲肯定是 ')

export default [
  {
    input: './packages/vue/src/index.ts',
    output: {
      file: './packages/vue/dist/vue.js',
      format: 'iife',
      name: 'Vue',
      sourcemap: true
    },
    plugins: [
      typescript({
        sourceMap: true
      }),
      commonjs(),
      resolve()
    ]
  }
]
