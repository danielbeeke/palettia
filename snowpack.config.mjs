export default {
  mount: {
    'docs': '/',
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
  plugins: [
    '@snowpack/plugin-sass'
  ]
}
