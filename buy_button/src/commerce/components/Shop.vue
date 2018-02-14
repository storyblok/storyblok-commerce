<template>
  <div>
    <div class="sb-head">
      <div class="sb-head__left">
        <ul class="sb-head__links">
          <li class="sb-head__link">
            <router-link :to="{name: 'SbShop', params: {locale: $sbState.locale, view: 'catalogue', id: 'me'}}">Browse catalogue</router-link>
          </li>
        </ul>
      </div>
      <div class="sb-head__right">
        <sb-account-bar></sb-account-bar>
      </div>
    </div>
    <div :is="component" :id="id"></div>
    <sb-minicart v-model="minicartOpen" @sidebar-closed="handleSidebarClosed" align="right"></sb-minicart>
    <sb-error-modal></sb-error-modal>
  </div>
</template>

<script>
/* eslint-disable */
import State from './State'

export default {
  props: ['locale', 'view', 'id'],

  data() {
    return {

    }
  },

  computed: {
    minicartOpen() {
      return State.minicartOpen
    },

    component() {
      switch(this.view) {
        case 'product':
          return 'sb-product'
        break;
        case 'account':
          return 'sb-account'
        break;
        case 'profile':
          return 'sb-profile'
        break;
        case 'register':
          return 'sb-register'
        break;
        case 'checkout':
          return 'sb-checkout'
        break;
        default:
          return 'sb-catalogue'
      }
    }
  },

  methods: {
    handleSidebarClosed(value) {
      State.minicartOpen = value
    }
  }
}
</script>
