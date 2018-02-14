<template>
  <div class="sb-cart-item sb-flex">
    <div class="sb-cart-item__img">
      <img v-bind:src="cartItem.image | resize('70x70')" />
    </div>
    <div class="sb-cart-item__info">
      <div class="sb-cart-item__name">
        {{ cartItem.meta_data.name }} x
        <span class="sb-product-quanity">{{ cartItem.quantity }}</span>
      </div>
      <div class="sb-cart-item__options">
        <ul>
          <li v-for="(key, option) in cartItem.options">{{key}}: {{option[0]}}</li>
        </ul>
      </div>
    </div>
    <div class="sb-cart-item__price">
      <div>{{ cartItem.value * cartItem.quantity | currency(currency) }}</div>
      <a v-if="!isOrder" class="sb-cart-item__remove" href="#" v-on:click.prevent="remove(cartItem.id)">remove</a>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import State from './State'
import store from '../libs/store'
import api from '../libs/api'

export default {
  props: ['cartItem', 'isOrder', 'currency'],

  methods: {

    updateQuantity(id, e) {
      let uuid = store.get('uuid')

      let orderItem = {
        quantity: e.currentTarget.value
      }

      api().put(`/checkouts/${uuid}/order_items/${id}`, orderItem)
        .then((res) => {
          State.checkout = res.data.checkout
        })
        .catch((error) => {
          console.log(error)
          State.errors = error.response.data
        })
    },

    remove(id) {
      let uuid = store.get('uuid')

      api().delete(`/checkouts/${uuid}/order_items/${id}`)
        .then((res) => {
          State.checkout = res.data.checkout
        })
        .catch((error) => {
          console.log(error)
          State.errors = error.response.data
        })
    }
  }
}
</script>
