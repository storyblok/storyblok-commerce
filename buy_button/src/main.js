import Vue from 'vue'
import App from './App.vue'
import Cart from './Cart.vue'
import Commerce from './commerce'
import State from './commerce/components/State'
import api from './commerce/libs/api'
import store from './commerce/libs/store'
import parseOptions from './commerce/libs/parseOptions'

let autoInit = function() {
  let scripts = document.getElementsByTagName("script")
  let buyButtons = document.querySelectorAll('[data-sb-buy-button]')
  let checkout = document.querySelector('[data-sb-checkout]')
  let cart = document.querySelector('[data-sb-cart]')

  for (let i=0; i < scripts.length; ++i) {
    let location = scripts[i].src
    if (location.indexOf('//commerce.storyblok.com/f/latest.js?t=') > -1) {
      let token = location.split('?t=')[1]
      Vue.use(Commerce, {token: token})
      store.init(token)
    }
  }

  if (checkout) {
    new Vue({
      el: '[data-sb-checkout]',
      beforeMount() {
        this.options = parseOptions(this.$el.dataset.sbCheckout)

        if (this.options.locale) {
          State.locale = this.options.locale
        }
      },
      render: h => h(App)
    })
  }

  if (cart) {
    new Vue({
      el: '[data-sb-cart]',
      beforeMount() {
        this.options = parseOptions(this.$el.dataset.sbCart)

        if (this.options.locale) {
          State.locale = this.options.locale
        }
      },
      render: h => h(Cart)
    })
  }

  if (buyButtons.length > 0) {
    for (var i = 0; i < buyButtons.length; i++) {
      buyButtons[i].setAttribute('data-sb-buy-button-id', i)

      new Vue({
        el: '[data-sb-buy-button-id="' + i + '"]',
        data() {
          return {
            loading: false,
            quantity: 1,
            options: {},
            product: {id: null}
          }
        },
        mounted() {
          this.options = parseOptions(this.$el.dataset.sbBuyButton)

          if (this.options.currency) {
            State.currency = this.options.currency
          }

          if (this.options.locale) {
            State.locale = this.options.locale
          }

          if (this.options.sku) {
            api().get('products', {params: {sku: this.options.sku}}).then((res) => {
              this.product = res.data[0]
            })
          } else {
            this.product.id = this.options.id
          }

          this.$el.addEventListener('click', (e) => {
            e.preventDefault()
            this.addToCart()
          })
        },
        methods: {
          addToCart() {
            this.loading = true
            let id = this.product.id
            let uuid = store.get('uuid')

            if (uuid) {
              this.addOrderItem(id, uuid)
            } else {
              api().post('checkouts', {
                  currency: State.currency,
                  origin: State.country
                })
                .then((res) => {
                  if (res.data.uuid) {
                    store.set('uuid', res.data.uuid)
                    this.addOrderItem(id, res.data.uuid)
                  } else {
                    this.loading = false
                  }
                })
                .catch((error) => {
                  this.loading = false
                  State.errors = error.response.data
                })
            }
          },

          addOrderItem(id, uuid) {
            let orderItem = {
              product_id: id,
              url: window.location.href,
              quantity: this.quantity
            }

            api().post(`checkouts/${uuid}/order_items`, orderItem)
              .then((res) => {
                State.checkout = res.data.checkout
                State.minicartOpen = true
                this.loading = false

                if (this.options.callback) {
                  let cb = this.options.callback

                  if (typeof window[cb] !== 'undefined') {
                    window[cb](res.data)
                  }
                }
              })
              .catch((error, res) => {
                this.loading = false
                State.errors = error.response.data
              })
          }
        }
      })
    }

  }
}

autoInit()
