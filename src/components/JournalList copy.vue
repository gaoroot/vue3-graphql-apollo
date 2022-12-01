<template>
  <div>
    <input type="text" v-model="title" placeholder="Заголовок" />
    <input type="text" v-model="body" placeholder="Текст" />
    <button @click="addPost">Добавить запись</button>
    <div v-if="loading">
      <h2>Загрузка...</h2>
    </div>
     <div v-else-if="error">
      <h2>{{error}}</h2>
    </div>
    <div v-else>
      <h2>Журнал</h2>
      <div v-for="p in result.allPosts" :key="p.id">
        ID: {{ p.id }} <br>
        Заголовок: {{ p.title }} <br>
        Запись: {{ p.body }} <br>
        Дата: {{ p.date }}<br>
      </div>
    </div>
  </div>
</template>

<script>
import { useQuery, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
  
const All_POST_LIST = gql`
  {
    allPosts {
      id
      title
      body
      date
    }
  }
`;

const ADD_POST_MUTATION = gql`
  mutation createPost ($title: String, $body: String, $date: DateTime) {
    createPost(postData: {title: $title, body: $body, date: $date}) {
      post {
        id
        title
        body
        date
      }
    }
  }
`;

export default {
  name: "JournalList",
  setup() {
    // QUERY
    const { result, loading, error } = useQuery(
      All_POST_LIST
    );

    const {
      loading: mLoading,
      error: mError,
      mutate: createPost
    } = useMutation(ADD_POST_MUTATION, {
      update: (cache, { data: { createPost } }) => {
        // get the posts from the cache...
        const data = cache.readQuery({ query: All_POST_LIST });
        // add the new post to the cache
        data.allPosts.push(createPost);
        // write results back to cache
        cache.writeQuery({ query: All_POST_LIST, data });
      }
    });

    return {
      result,
      loading: loading || mLoading,
      error: error || mError,       
      createPost                    
    };
  },

  data(){
    return {
      title: "",
      body: "",
      date: new Date(),
    };
  },

  methods: {
    addPost : function() {
      let date = new Date();
      this.createPost({
        title:this.title,
        body:this.body,
        date,
      })
    }
  },
  created(){
        document.title = "Страница | Journal" //title
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
  