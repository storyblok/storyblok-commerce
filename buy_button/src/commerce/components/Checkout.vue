<template>
  <div class="sb-checkout">
    <div class="sb-checkout__placeholder" v-if="!checkout.order_items || checkout.order_items.length == 0">
      <div v-if="$sbState.checkoutLoading">
        {{ 'loading' | t }}
      </div>
      <div v-else>
        {{ 'cart_empty' | t }}
      </div>
    </div>
    <div v-else class="sb-checkout__container sb-flex sb-flex-wrap">
      <div class="sb-checkout__main">
        <sb-checkout-steps></sb-checkout-steps>
      </div>
      <div class="sb-checkout__sidebar">
        <div class="sb-checkout__summary">
          <a href="#" @click.prevent="emptyCart" class="sb-checkout__empty sb-u__float-right">{{ 'cart_empty_cart' | t }}</a>
          <h2 class="sb-checkout__headline">
            {{ 'cart' | t }}
          </h2>

          <sb-order-summary :order="checkout"></sb-order-summary>

          <div class="sb-coupon">
            <label class="sb-coupon__headline sb-form__label">{{ 'coupon_code' | t }}</label>
            <form class="sb-flex" @submit.prevent="applyCoupon">
              <input type="text" v-model="couponCode" class="sb-form__input sb-flex-auto" :placeholder="'insert_coupon_code' | t">
              <button type="submit" class="sb-button">
                {{ 'apply' | t }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import State from './State'
import store from '../libs/store'
import api from '../libs/api'

export default {
  data: function() {
    return {
      couponCode: ''
    }
  },

  computed: {
    checkout: function() {
      return State.checkout
    },

    itemCount: function() {
      if (State.checkout !== null && typeof State.checkout.order_items !== 'undefined') {
        return State.checkout.order_items.length
      } else {
        return 0
      }
    }
  },

  created() {

  },

  methods: {
    emptyCart() {
      State.checkout = {}
      store.set('uuid', null)
    },

    applyCoupon() {
      api().post(`/checkouts/${State.checkout.uuid}/coupons`, {
          code: this.couponCode
        })
        .then((res) => {
          State.checkout = res.data
        })
        .catch((error) => {
          if (error.response && error.response.status == 404) {
            State.errors = ['This coupon could not be found']
          } else {
            State.errors = error.response.data
          }
          console.log(error)
        })
    }
  }
}
</script>
