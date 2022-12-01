module.exports = {
    client: {
      service: {
        name: 'vue3-graphql-apollo',
        // URL to the GraphQL API
        url: 'http://127.0.0.1:8000/graphql',
      },
      // Files processed by the extension
      includes: [
        'src/**/*.vue',
        'src/**/*.js',
      ],
    },
  }