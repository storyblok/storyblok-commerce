<template>
  <div class="order">
    <a href="#/profile"><span uk-icon="icon: arrow-left"></span> {{ 'back' | t }}</a>
    <h2>{{ 'order' | t }} #{{ order.order_number }}</h2>
    <div v-if="order.id">
      <div class="uk-margin-bottom">
        <p>
          {{ 'ordered_on' | t }}: {{ order.ordered_on | date }}<br>
          {{ 'order_status' | t }}: {{ order.status }}<br>
          <span v-if="order.tracking_number.length > 0">
            {{ 'tracking_number' | t }}: {{ order.tracking_number }}
          </span><br>
          <a href="#" @click.prevent="reOrder">{{ 'reorder' | t }}</a>
        </p>
      </div>
      <hr>
      <div class="uk-grid uk-margin-bottom">
        <div class="uk-width-1-2@m">
          <h3>{{ 'cart_ship_address' | t }}</h3>
          <p>
            {{ order.ship_address.firstname }} {{ order.ship_address.lastname }}<br>
            {{ order.ship_address.address1 }} {{ order.ship_address.address2 }}<br>
            {{ order.ship_address.zip }} {{ order.ship_address.city }}<br>
            {{ order.ship_address.country }}
          </p>
        </div>
        <div class="uk-width-1-2@m">
          <h3>{{ 'cart_bill_address' | t }}</h3>
          <p>
            {{ order.bill_address.firstname }} {{ order.bill_address.lastname }}<br>
            {{ order.bill_address.address1 }} {{ order.bill_address.address2 }}<br>
            {{ order.bill_address.zip }} {{ order.bill_address.city }}<br>
            {{ order.bill_address.country }}
          </p>
        </div>
      </div>
      <hr>
      <div>
        <h3>{{ 'summary' | t }}</h3>
        <order-summary :is-order="true" :order="order"></order-summary>
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
  data() {
    return {
      order: {},
      loading: false
    }
  },

  props: ['id'],

  computed: {
    customer: function() {
      return State.customer
    }
  },

  created() {
    this.loadOrder()
  },

  methods: {
    reOrder() {
      api().post('checkouts', {
          currency: window.SITE_CURRENCY,
          origin: window.SITE_COUNTRY
        })
        .then((res) => {
          if (res.data.uuid) {
            store.set('uuid', res.data.uuid)
            this.order.order_items.forEach((item) => {
              this.addOrderItem(item, res.data.uuid)
            })
          } else {
            this.loading = false
          }
        })
        .catch((error) => {
          console.log(error)
          this.loading = false
          State.errors = error.response.data
        })
    },

    addOrderItem(item, uuid) {
      let orderItem = {
        product_id: item.product_id,
        url: window.location.href,
        quantity: item.quantity
      }

      api().post(`checkouts/${uuid}/order_items`, orderItem)
        .then((res) => {
          State.checkout = res.data.checkout
          UIkit.offcanvas(document.getElementById('offcanvas-cart')).show()
          this.loading = false
        })
        .catch((error, res) => {
          this.loading = false
          State.errors = error.response.data
        })
    },

    loadOrder() {
      if (!this.id.length) {
        this.order = {}
        return
      }

      api().get(`/customer_orders/${this.id}`)
        .then((res) => {
          this.order = res.data
        })
        .catch((error) => {
          State.errors = error.response.data
        })
    }
  },

  watch: {
    id() {
      this.loadOrder()
    }
  }
}
</script>
