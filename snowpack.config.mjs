export default {
  mount: {
    'src': '/',
    'scss': '/'
  },
  optimize: {
    bundle: true,
    minify: true,
    target: 'es2018',
  },
  routes: [
    {
      match: 'routes',
      src: '.*',
      dest: '/index.html',
    },
  ],
  devOptions: {
    out: 'docs'
  },
  plugins: [
    '@snowpack/plugin-sass'
  ]
}
