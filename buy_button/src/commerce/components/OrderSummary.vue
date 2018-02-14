<template>
  <div class="sb-order-summary" v-if="order">
    <div v-if="!order.order_items || !order.order_items.length">
      {{ 'cart_empty' | t }}
    </div>
    <div v-else>
      <div class="sb-products">
        <sb-cart-item :is-order="isOrder" :currency="order.currency" :key="cartItem.id" v-for="cartItem in order.order_items" :cart-item="cartItem"></sb-cart-item>
      </div>
      <div class="sb-sums">
        <div class="sb-sums__row sb-flex">
          <div class="sb-sums__title">
            {{ 'subtotal' | t }}
          </div>
          <div class="sb-sums__nr">
            {{ order.subtotal | currency(order.currency) }}
          </div>
        </div>
        <div class="sb-sums__row sb-flex" v-if="order.coupon_discount">
          <div class="sb-sums__title">
            {{ 'coupon_discount' | t }}
          </div>
          <div class="sb-sums__nr">
            -{{ order.coupon_discount | currency(order.currency) }}
          </div>
        </div>
        <div class="sb-sums__row sb-flex" v-if="order.shipping">
          <div class="sb-sums__title">
            {{ 'shipping' | t }}
          </div>
          <div class="sb-sums__nr">
            {{ order.shipping | currency(order.currency) }}
          </div>
        </div>
        <div class="sb-sums__row sb-flex" v-if="order.tax">
          <div class="sb-sums__title">
            {{ 'tax' | t }}
          </div>
          <div class="sb-sums__nr">
            {{ order.tax | currency(order.currency) }}
          </div>
        </div>
        <div class="sb-sums__row sb-sums__total sb-flex">
          <div class="sb-sums__title">
            <strong>{{ 'grand_total' | t }}</strong>
          </div>
          <div class="sb-sums__nr">
            <strong>{{ order.total | currency(order.currency) }}</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: ['order', 'isOrder'],

  computed: {
    itemCount: function() {
      if (this.order !== null && typeof this.order.order_items !== 'undefined') {
        return this.order.order_items.length
      } else {
        return 0
      }
    }
  }
}
</script>
