<template>
  <div>
  </div>
</template>

<script>
/* eslint-disable */
import State from './State'

export default {
  watch: {
    checkingUserStatus(val) {
      if (!val) {
        this.redirect()
      }
    },
    loggedIn() {
      this.redirect()
    }
  },

  methods: {
    redirect() {
      if (State.loggedIn) {
        this.$router.push({name: 'SbShop', params: {locale: this.$sbState.locale, view: 'profile', id: 'me'}})
      } else {
        this.$router.push({name: 'SbShop', params: {locale: this.$sbState.locale, view: 'register', id: 'me'}})
      }
    }
  },

  created() {
    this.redirect()
  },

  computed: {
    checkingUserStatus: function() {
      return State.checkingUserStatus
    },
    loggedIn: function() {
      return State.loggedIn
    }
  }
}
</script>
