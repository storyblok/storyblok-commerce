<template>
  <div class="sb-error-modal" :class="{'sb-error-modal--open': hasErrors}">
    <div class="sb-error-modal__inner">
      <h4>
        {{ 'something_wrong' | t }}
      </h4>
      <ul>
        <li v-for="(error, key) in errors">
          {{ error }}
        </li>
      </ul>
      <div class="uk-margin-top">
        <a href="#" @click.prevent="close" class="uk-button uk-button-default">{{ 'ok' | t }}</a>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import State from './State'

export default {
  data: function() {
    return {

    }
  },

  computed: {
    errors: function() {
      return State.errors
    },

    hasErrors: function() {
      return State.errors.length > 0
    }
  },

  created() {

  },

  methods: {
    close() {
      State.errors = []
    }
  }
}
</script>
