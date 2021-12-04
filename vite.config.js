import { resolve } from 'path'
export default () =>  {
  return {
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.js'),
        name: 'utils',
        fileName: 'utils',
        formats: ['es', 'umd', 'iife'],
      },
      outDir: "lib",
    },
  }
}