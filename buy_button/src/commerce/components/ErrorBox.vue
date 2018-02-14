<template>
  <div class="sb-alert" v-if="messages">
    <div v-for="(error, key) in messages">
      {{ error }}
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: ['messages'],

  data: function() {
    return {

    }
  }
}
</script>
