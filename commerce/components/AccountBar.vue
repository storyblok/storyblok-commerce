<template>
  <ul class="sb-account-bar sb-flex sb-flex-middle">
    <li class="sb-account-bar__item">
      <router-link class="sb-account-bar__link" :to="{name: 'SbShop', params: {locale: $sbState.locale, view: 'account', id: 'me'}}">
        {{ 'my_account' | t }}
      </router-link>
    </li>
    <li class="sb-account-bar__item">
      <a class="sb-account-bar__link" href="#" @click.prevent="openCart">
        {{ 'cart' | t }}
        <span class="sb-account-bar__badge" v-if="checkout.order_items && checkout.order_items.length">{{ checkout.order_items.length }}</span>
      </a>
    </li>
    <li class="sb-account-bar__item" v-if="loggedIn">
      <a href="#" @click.prevent="logout">{{ 'logout' | t }}</a>
    </li>
  </ul>
</template>

<script>
/* eslint-disable */
import api from '../libs/api'
import State from './State'

export default {
  data() {
    return {

    }
  },

  computed: {
    loggedIn: function() {
      return State.loggedIn
    },

    checkout: function() {
      return State.checkout
    }
  },

  methods: {
    openCart() {
      State.minicartOpen = true
    },

    logout() {
      api().delete('customer_sessions/me')
        .then((res) => {
          State.loggedIn = false
        })
        .catch((error) => {
          State.errors = error.response.data
        })
    }
  }
}
</script>
