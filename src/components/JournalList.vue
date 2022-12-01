<template>
  <div>
    <input type="text" v-model="title" placeholder="Заголовок" required />
    <textarea type="text" v-model="body" placeholder="Текст" required></textarea>
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
        <button class="btn btn-sm btn-danger ms-2" @click="onDeleteClicked(p.id)">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// import DELETE_POST from "@/graphql/deletePost.mutation.gql";
import { useQuery, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
// import { ref } from 'vue'
  
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

const DELETE_POST = gql`
  mutation deletePost($id: ID!) {
    deletePost(id: $id) {
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
  async setup() {
    // QUERY
    const { result, loading, error } = useQuery(All_POST_LIST);

    const { mutate: deletePost } = useMutation(DELETE_POST);

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
    // Detelete Post
    // let postToDelete = ref("");

    // const onDeleteClicked = (item) => {
    //   postToDelete.value = item;
    //   deletePost();
    // };

    // const { mutate: deletePost, onDone } = useMutation(DELETE_POST, () => ({
    //   variables: {
    //     id: postToDelete.value,
    //   },
    //   update(cache) {
    //     const normalizedId = cache.evict({
    //       id: cache.identify({ id: postToDelete.value, __typename: "Post" }),
    //     });
    //     cache.gc();
    //     console.log("normalizedId: ", normalizedId);
    //   },
    // }));
    // onDone(() => console.log("Updated cache: ", result));
    ///
    return {
      result,
      loading: loading || mLoading,
      error: error || mError,       
      createPost,
      // onDeleteClicked
      deletePost
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
        title: this.title,
        body: this.body,
        date,
      })
    },
    onDeleteClicked : function() {
      this.deletePost({
        id: this.id,
        title: this.title,
        body: this.body,
        date: this.date
      })
    }
  },
  created(){
        document.title = "Страница | Journal" //title
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
  