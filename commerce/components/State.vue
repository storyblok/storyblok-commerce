<script>
/* eslint-disable */
import Vue from 'vue'
import api from '../libs/api'
import store from '../libs/store'

let state = new Vue({
  data: function() {
    return {
      token: '',
      rootId: null,
      locale: 'en',
      currency: 'USD',
      country: 'at',
      minicartOpen: false,
      checkout: {},
      errors: [],
      loggedIn: false,
      checkingUserStatus: true,
      customer: {},
      categories: [],
      categoryList: [],
      category: {title: '-'},
      resolvedEvents: {},
      productQuantity: 1,
      variant: null
    }
  },

  created() {
    this.$nextTick(() => {
      this.loadCheckout()
      this.loadCustomer()
    })
  },

  methods: {
    loadCheckout() {
      let uuid = store.get('uuid')

      if (uuid !== null && uuid !== '') {
        api().get(`checkouts/${uuid}`)
          .then((res) => {
            state.checkout = res.data

            if (state.checkout.status == 'Closed') {
              state.checkout = {}
              store.set('uuid', '')
            }
          })
          .catch((error) => {
            if (error.response.status === 404) {
              store.set('uuid', '')
            }
          })
      }
    },

    loadCustomer() {
      api().get('customer_accounts/me')
      .then((res) => {
        state.customer = res.data
        state.loggedIn = true
        state.checkingUserStatus = false
        state.resolve('customerLoaded')
      })
      .catch((error) => {
        state.customer = {}
        state.loggedIn = false
        state.checkingUserStatus = false
      })
    },

    waitUntil(event) {
      return new Promise((resolve, reject) => {
        if (this.resolvedEvents[event]) {
          return resolve()
        }

        var ready = function() {
          this.$off(event, this)
          resolve()
        }

        this.$on(event, ready)
      })
    },

    resolve(event) {
      this.resolvedEvents[event] = true
      this.$emit(event)
    }
  }
})


export default state
</script>
