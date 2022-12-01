// import { createApp } from 'vue'
// import App from './App.vue'
// import './registerServiceWorker'
import router from './router'
import store from './store'

// createApp(App).use(store).use(router).mount('#app')

import { createApp } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import App from './App.vue'

const httpLink = createHttpLink({
  uri: 'http://192.168.100.9:8000/graphql',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})
const cache = new InMemoryCache()
const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
})

createApp(App)
    .use(store)
    .use(router)
    .provide(DefaultApolloClient, apolloClient)
    .mount('#app')