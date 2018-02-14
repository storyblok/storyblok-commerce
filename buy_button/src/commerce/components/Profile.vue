<template>
  <div>
    <div class="uk-grid">
      <div class="uk-width-1-2@m">
        <div class="panel">
          <h3 class="panel__title">{{ 'my_orders' | t }}</h3>
          <div class="panel__body">
            <div v-if="noOrders">
              {{ 'no_orders_yet' | t }}
            </div>
            <div class="uk-overflow-auto" v-else>
              <table class="uk-table uk-table-striped">
                <thead>
                  <tr>
                    <th>{{ 'order_number' | t }}</th>
                    <th>{{ 'order_status' | t }}</th>
                    <th>{{ 'order_total' | t }}</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="order in orders">
                    <td><a href="#" @click.prevent="openOrder(order.order_number)">{{ order.order_number }}</a></td>
                    <td>{{ order.status }}</td>
                    <td>{{ order.total | currency(order.currency) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="uk-width-1-2@m">
        <div class="panel">
          <a href="#" @click.prevent="edit" class="uk-float-right">
            {{ 'edit' | t }}
          </a>
          <h3 class="panel__title">{{ 'account_information' | t }}</h3>
          <div class="panel__body">
            <div v-if="!isEditing">
              <div v-if="customer.company && customer.company.length > 0">{{ customer.company }}</div>
              {{ customer.firstname }} {{ customer.lastname }}<br>
              {{ customer.email }}
              <div>
                <a href="#" @click.prevent="showResetPassword = !showResetPassword">
                  {{ 'reset_password' | t }}
                </a>
                <form @submit.prevent="resetPassword" class="uk-margin-small-top uk-form-stacked" v-if="showResetPassword">
                  <div class="uk-margin">
                    <label class="uk-form-label">{{ 'current_password' | t }}</label>
                    <div class="uk-form-controls">
                      <input class="uk-input" type="password" v-model="passwordForm.current_password" />
                    </div>
                  </div>
                  <div class="uk-margin">
                    <label class="uk-form-label">{{ 'new_password' | t }}</label>
                    <div class="uk-form-controls">
                      <input class="uk-input" type="password" v-model="passwordForm.password" />
                    </div>
                  </div>
                  <div class="uk-margin">
                    <label class="uk-form-label">{{ 'password_confirmation' | t }}</label>
                    <div class="uk-form-controls">
                      <input class="uk-input" type="password" v-model="passwordForm.password_confirmation" />
                    </div>
                  </div>
                  <button type="submit" class="uk-button uk-button-default">
                    {{ 'submit' | t }}
                  </button>
                </form>
              </div>
            </div>
            <div v-else>
              <form @submit.prevent="update" class="uk-form-stacked">
                <div class="uk-margin">
                  <div class="uk-form-controls uk-grid-small uk-child-width-auto uk-grid">
                    <label><input name="gender" class="uk-radio" type="radio" :value="false" v-model="customer.sex" /> {{ 'mr' | t }}</label>
                    <label><input name="gender" class="uk-radio" type="radio" :value="true" v-model="customer.sex" /> {{ 'mrs' | t }}</label>
                  </div>
                </div>
                <div class="uk-margin">
                  <label class="uk-form-label">{{ 'firstname' | t }}</label>
                  <div class="uk-form-controls">
                    <input class="uk-input" type="text" v-model="customer.firstname" />
                  </div>
                </div>
                <div class="uk-margin">
                  <label class="uk-form-label">{{ 'lastname' | t }}</label>
                  <div class="uk-form-controls">
                    <input class="uk-input" type="text" v-model="customer.lastname" />
                  </div>
                </div>
                <div class="uk-margin">
                  <label class="uk-form-label">{{ 'email' | t }}</label>
                  <div class="uk-form-controls">
                    <input class="uk-input" type="text" v-model="customer.email" />
                  </div>
                </div>
                <button type="submit" class="uk-button uk-button-default">
                  {{ 'submit' | t }}
                </button>
                <button @click.prevent="isEditing = false" type="button" class="uk-button uk-button-default">
                  {{ 'cancel' | t }}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div class="panel uk-margin-top" v-if="address">
          <a href="#" @click.prevent="editAddress" class="uk-float-right">
            {{ 'edit' | t }}
          </a>
          <h3 class="panel__title">{{ 'address1' | t }}</h3>
          <div class="panel__body">
            <div v-if="!isEditingAddress">
              {{ address.address1 }} {{ address.address2 }}<br>
              <span v-if="address.zip != '0'">{{ address.zip }} </span>{{ address.city }}<br>
              {{ address.country }}
            </div>
            <div v-else>
              <form @submit.prevent="updateAddress(address.id)" class="uk-form-stacked">
                <div class="uk-margin" v-if="address.company && address.company.length > 0">
                  <label class="uk-form-label">{{ 'clinic_name' | t }}</label>
                  <div class="uk-form-controls uk-position-relative">
                    <input v-model="address.company" class="uk-input" type="text" autocomplete="off">
                  </div>
                </div>
                <div class="uk-margin">
                  <label class="uk-form-label">{{ 'firstname' | t }}</label>
                  <div class="uk-form-controls">
                    <input class="uk-input" type="text" v-model="address.firstname" />
                  </div>
                </div>
                <div class="uk-margin">
                  <label class="uk-form-label">{{ 'lastname' | t }}</label>
                  <div class="uk-form-controls">
                    <input class="uk-input" type="text" v-model="address.lastname" />
                  </div>
                </div>
                <div class="uk-margin">
                  <label class="uk-form-label">{{ 'address1' | t }}</label>
                  <div class="uk-form-controls">
                    <input class="uk-input" type="text" v-model="address.address1" />
                  </div>
                </div>
                <div class="uk-margin">
                  <label class="uk-form-label">{{ 'address2' | t }}</label>
                  <div class="uk-form-controls">
                    <input class="uk-input" type="text" v-model="address.address2" />
                  </div>
                </div>
                <div class="uk-margin">
                  <label class="uk-form-label">{{ 'zip' | t }}</label>
                  <div class="uk-form-controls">
                    <input class="uk-input" type="text" v-model="address.zip" />
                  </div>
                </div>
                <div class="uk-margin">
                  <label class="uk-form-label">{{ 'city' | t }}</label>
                  <div class="uk-form-controls">
                    <input class="uk-input" type="text" v-model="address.city" />
                  </div>
                </div>
                <div class="uk-margin">
                  <label class="uk-form-label">{{ 'country' | t }}</label>
                  <div class="uk-form-controls">
                    {{ address.country }}
                  </div>
                </div>
                <button type="submit" class="uk-button uk-button-default">
                  {{ 'submit' | t }}
                </button>
                <button @click.prevent="isEditingAddress = false" type="button" class="uk-button uk-button-default">
                  {{ 'cancel' | t }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import api from '../libs/api'
import State from './State'

export default {
  data() {
    return {
      isEditing: false,
      isEditingAddress: false,
      orders: [],
      address: null,
      ordersLoaded: false,
      showResetPassword: false,
      passwordForm: {}
    }
  },

  computed: {
    customer: function() {
      return State.customer
    },
    noOrders: function() {
      return this.ordersLoaded && this.orders.length == 0
    }
  },

  created() {
    this.loadOrders()
    State.waitUntil('customerLoaded')
         .then(this.loadAddresses)
  },

  methods: {
    openOrder(id) {
      State.goTo(`order/${id}`)
    },

    edit() {
      this.isEditing = true
    },

    editAddress() {
      this.isEditingAddress = true
    },

    updateAddress(id) {
      api().put(`/customer_addresses/${id}`, this.address)
        .then((res) => {
          this.address = res.data
          this.isEditingAddress = false
          UIkit.notification(this.$options.filters.t('action_success'))
        })
        .catch((error) => {
          State.errors = error.response.data
        })
    },

    loadAddresses() {
      if (this.customer.default_shipping_address == null) {
        return
      }

      api().get(`/customer_addresses/${this.customer.default_shipping_address}`)
        .then((res) => {
          this.address = res.data
        })
        .catch((error) => {
          State.errors = error.response.data
        })
    },

    loadOrders() {
      this.ordersLoaded = false

      api().get('/customer_orders')
        .then((res) => {
          this.ordersLoaded = true
          this.orders = res.data
        })
        .catch((error) => {
          State.errors = error.response.data
        })
    },

    resetPassword() {
      this.doUpdate(this.passwordForm)
    },

    doUpdate(form) {
      api().put('/customer_accounts/me', form)
        .then((res) => {
          State.customer = res.data
          this.isEditing = false
          this.showResetPassword = false
          UIkit.notification(this.$options.filters.t('action_success'))
        })
        .catch((error) => {
          console.log(error)
          State.errors = error.response.data
        })
    },

    update() {
      this.doUpdate(this.customer)
    }
  }
}
</script>
