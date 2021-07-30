export default {
  mount: {
    'src': '/',
    'scss': '/'
  },
  packageOptions: {
    source: 'remote',
    types: true,
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
