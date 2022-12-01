<template>
  <Suspense>
  <div class="journal">
    <JournalList />
  </div>
</Suspense>
</template>

<script>
// @ is an alias to /src
import JournalList from '@/components/JournalList.vue'

export default {
  name: 'JournalView',
  components: {
      JournalList
  }
}
</script>