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
        <div class="sb-price-row sb-clearfix">
          <div class="sb-price-title">
            {{ 'subtotal' | t }}
          </div>
          <div class="sb-price-nr">
            {{ order.subtotal | currency(order.currency) }}
          </div>
        </div>
        <div class="sb-price-row sb-clearfix" v-if="order.coupon_discount">
          <div class="sb-price-title">
            {{ 'coupon_discount' | t }}
          </div>
          <div class="sb-price-nr">
            -{{ order.coupon_discount | currency(order.currency) }}
          </div>
        </div>
        <div class="sb-price-row sb-clearfix" v-if="order.shipping">
          <div class="sb-price-title">
            {{ 'shipping' | t }}
          </div>
          <div class="sb-price-nr">
            {{ order.shipping | currency(order.currency) }}
          </div>
        </div>
        <div class="sb-price-row sb-clearfix" v-if="order.tax">
          <div class="sb-price-title">
            {{ 'tax' | t }}
          </div>
          <div class="sb-price-nr">
            {{ order.tax | currency(order.currency) }}
          </div>
        </div>
        <div class="sb-price-row sb-price-total sb-clearfix">
          <div class="sb-price-title">
            <strong>{{ 'grand_total' | t }}</strong>
          </div>
          <div class="sb-price-nr">
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
