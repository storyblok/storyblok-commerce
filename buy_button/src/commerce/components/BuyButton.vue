<template>
  <div class="sb-buy-btn sb-flex">
    <sb-quantity-input v-model="quantity"></sb-quantity-input>
    <div class="sb-buy-btn__form">
      <button :class="{'sb-buy-btn--loading': loading}" :disabled="outOfStock" class="sb-button" @click.prevent="addToCart">
        <span class="sb-buy-btn__loading">{{ 'add_to_cart_loading' | t }}</span>
        <span class="sb-buy-btn__text">{{ 'add_to_cart' | t }}</span>
      </button>
      <div v-if="product.type == 'variantable'">
        <div class="sb-buy-btn__hint" v-if="variant !== null && outOfStock">
          {{ 'out_of_stock' | t }}
        </div>
        <div class="sb-buy-btn__hint" v-if="variant === null">
          {{ 'choose_variant' | t }}
        </div>
      </div>
      <div v-else>
        <div class="sb-buy-btn__hint" v-if="outOfStock">
          {{ 'out_of_stock' | t }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import store from '../libs/store'
import api from '../libs/api'
import State from './State'

export default {
  props: ['product'],

  data() {
    return {
      loading: false,
      stock: 0,
      productId: null,
      quantity: 1
    }
  },

  created() {
    this.stock = this.product.quantity
    this.productId = this.product.id
  },

  computed: {
    outOfStock: function() {
      return this.product.track_stock && this.product.quantity <= 0
    },

    checkout: function() {
      return State.checkout
    },

    variant: function() {
      return State.variant
    }
  },

  watch: {
    variant() {
      if (this.variant !== null) {
        this.stock = this.variant.quantity
        this.productId = this.variant.id
      }
    }
  },

  methods: {
    addToCart() {
      this.loading = true
      let id = this.productId
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
        product_id: window.location.search == '?local=1' ? 42411 : id,
        url: window.location.href.indexOf('localhost:') > -1 ? window.location.href.replace('localhost:4440', '0387bdac.me.storyblok.com') : window.location.href,
        quantity: this.quantity
      }

      api().post(`checkouts/${uuid}/order_items`, orderItem)
        .then((res) => {
          State.checkout = res.data.checkout
          State.minicartOpen = true
          this.loading = false
        })
        .catch((error, res) => {
          this.loading = false
          State.errors = error.response.data
        })
    }
  }
}
</script>
