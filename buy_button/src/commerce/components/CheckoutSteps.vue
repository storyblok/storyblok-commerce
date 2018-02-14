<template>
  <div class="sb-steps">
    <div class="sb-modal" v-if="processingPayment">
      <div class="sb-modal__container">
        <div class="sb-modal__box">
          {{ 'will_redirect' | t }}
        </div>
      </div>
    </div>
    <div class="sb-steps__step" v-bind:class="{'sb-steps--active': currentStep > 0}">
      <div class="sb-steps__count">01</div>
      <div class="sb-steps__content">
        <div v-if="!$sbState.disableSignup">
          <h2>{{ 'cart_signup_login' | t }}</h2>
          <div class="sb-steps__email" v-if="!loggedIn">
            <div class="sb-form__row">
              <label class="sb-form__radio-label" for="sb-f-4"><input id="sb-f-4" class="sb-form__radio" value="yes" type="radio" v-model="signup"> {{ 'cart_want_signup' | t }}</label>
              <label class="sb-form__radio-label" for="sb-f-5"><input id="sb-f-5" class="sb-form__radio" value="no" type="radio" v-model="signup"> {{ 'cart_want_login' | t}}</label>
            </div>

            <div class="sb-form__row">
              <label class="sb-form__label" for="sb-f-1">{{ 'email' | t }} *</label>
              <input id="sb-f-1" type="email" class="sb-form__input" v-model="customerForm.email" name="cart[customer][email]">
              <div class="sb-u__mtl">
                <label class="sb-form__label" for="sb-f-2">
                  <input id="sb-f-2" type="checkbox" v-model="customerForm.email_subscribe" class="sb-form__checkbox" v-bind:false-value="0" v-bind:true-value="1"  />
                  {{ 'want_to_receive_newsletter' | t }}
                </label>
              </div>
            </div>

            <div class="sb-form__row">
              <label class="sb-form__label" for="sb-f-3">{{ 'password' | t }}</label>
              <input id="sb-f-3" type="password" class="sb-form__input" v-model="customerForm.password">
            </div>

            <sb-error-box :messages="messages.login"></sb-error-box>
            <sb-error-box :messages="messages.signup"></sb-error-box>

            <a href="#" class="sb-button" v-if="signup == 'no'" v-bind:class="{'sb-u__disabled': loader.login}" v-on:click.prevent="doLogin">{{ 'login' | t }}</a>
            <div v-if="signup == 'yes'">
              <a href="#" class="sb-button" v-bind:class="{'sb-u__disabled': loader.signup}" v-on:click.prevent="doSignup">{{ 'signup' | t }}</a>
              {{ 'or' | t }}
              <a href="#" class="sb-button" v-bind:class="{'sb-u__disabled': loader.signup}" v-on:click.prevent="doGuestSignup">{{ 'cart_guest_checkout' | t }}</a>
            </div>
          </div>
          <div class="sb-steps__logged-in" v-if="loggedIn">
            {{ 'cart_logged_in_as' | t }} <span v-text="customer.email"></span>
            <br>
            <br>
            <a href="#" class="sb-button" v-on:click.prevent="doLogout">{{ 'logout' | t }}</a>
          </div>
        </div>

        <div v-else>
          <h2>{{ 'cart_choose_email' | t }}</h2>
          <form class="sb-steps__email" v-on:submit.prevent="doGuestSignup">
            <div class="sb-form__row">
              <label class="sb-form__label" for="sb-f-1">{{ 'email' | t }} *</label>
              <input id="sb-f-1" type="email" :placeholder="'placeholder_email' | t" class="sb-form__input" v-model="customerForm.email" name="email" autocomplete="email">
            </div>

            <sb-error-box :messages="messages.login"></sb-error-box>
            <sb-error-box :messages="messages.signup"></sb-error-box>

            <a href="#" class="sb-button" v-bind:class="{'sb-u__disabled': loader.signup}" v-on:click.prevent="doGuestSignup">{{ 'cart_next_step' | t }}</a>
          </form>
        </div>
      </div>
    </div>
    <a name="sb-step02"></a>
    <div class="sb-steps__step" v-bind:class="{'sb-steps--active': currentStep > 1}">
      <div class="sb-steps__overlay"></div>
      <div class="sb-steps__count">02</div>
      <div class="sb-steps__content">
        <a href="#" class="sb-button sb-u__float-right" v-if="!showAddressForm" v-on:click.prevent="doEditAddress">{{ 'cart_edit' | t }}</a>
        <h2>{{ 'cart_choose_address' | t }}</h2>
        <div v-if="!showAddressForm" class="sb-grid">
          <div class="sb-width-1-2@m">
            <h3>{{ 'cart_ship_address' | t }}</h3>
            <p v-html="shipAddress"></p>
          </div>
          <div class="sb-width-1-2@m">
            <h3 class="sb-u__pt@s">{{ 'cart_bill_address' | t }}</h3>
            <p v-html="billAddress"></p>
          </div>
        </div>
        <form v-if="showAddressForm" v-on:submit.prevent="setAddress">
          <h3>{{ 'cart_ship_address' | t }}</h3>
          <div class="sb-form__row">
            <label class="sb-form__radio-label" for="sb-f-6"><input id="sb-f-6" class="sb-form__radio" :value="false" name="sb-f-6" type="radio" v-model="form.ship_address_attributes.sex"> {{ 'mr' | t}}</label>
            <label class="sb-form__radio-label" for="sb-f-7"><input id="sb-f-7" class="sb-form__radio" :value="true" name="sb-f-6" type="radio" v-model="form.ship_address_attributes.sex"> {{ 'mrs' | t}}</label>
          </div>
          <div class="sb-grid sb-form__row">
            <div class="sb-width-1-2@m">
              <label class="sb-form__label" for="sb-f-8">{{ 'firstname' | t }} *</label>
              <input id="sb-f-8" class="sb-form__input" type="text" v-model="form.ship_address_attributes.firstname" name="fname" autocomplete="given-name">
            </div>
            <div class="sb-width-1-2@m">
              <label class="sb-form__label" for="sb-f-9">{{ 'lastname' | t }} *</label>
              <input id="sb-f-9" class="sb-form__input" type="text" v-model="form.ship_address_attributes.lastname" name="lname" autocomplete="family-name">
            </div>
          </div>
          <div class="sb-grid sb-form__row">
            <div class="sb-width-1-2@m">
              <label class="sb-form__label" for="sb-f-10">{{ 'address1' | t }} *</label>
              <input id="sb-f-10" class="sb-form__input" type="text" v-model="form.ship_address_attributes.address1" name="ship-address" autocomplete="shipping street-address">
            </div>
            <div class="sb-width-1-2@m">
              <label class="sb-form__label" for="sb-f-11">{{ 'address2' | t }}</label>
              <input id="sb-f-11" class="sb-form__input" type="text" v-model="form.ship_address_attributes.address2">
            </div>
          </div>
          <div class="sb-grid sb-form__row">
            <div class="sb-width-1-2@m">
              <label class="sb-form__label" for="sb-f-12">{{ 'zip' | t }} *</label>
              <input id="sb-f-12" class="sb-form__input" type="text" v-model="form.ship_address_attributes.zip" name="ship-zip" autocomplete="shipping postal-code">
            </div>
            <div class="sb-width-1-2@m">
              <label class="sb-form__label" for="sb-f-13">{{ 'city' | t }} *</label>
              <input id="sb-f-13" class="sb-form__input" type="text" v-model="form.ship_address_attributes.city" name="ship-city" autocomplete="shipping address-level2">
            </div>
          </div>
          <div class="sb-form__row">
            <label class="sb-form__label" for="sb-f-14">{{ 'country' | t }} *</label>
            <select id="sb-f-14" class="sb-form__select" v-model="form.ship_address_attributes.country_id" name="ship-country">
              <option v-for="country in countries" v-bind:value="country.id">{{ country.name }}</option>
            </select>
          </div>
          <div class="sb-form__row">
            <label class="sb-form__label" for="sb-f-15">{{ 'phone' | t }}</label>
            <input id="sb-f-15" class="sb-form__input" type="text" v-model="form.ship_address_attributes.phone" name="phone" autocomplete="tel">
          </div>

          <div class="sb-form__row">
            <label class="sb-form__label" for="sb-f-16"><input id="sb-f-16" class="sb-form__checkbox" type="checkbox" v-bind:false-value="false" v-bind:true-value="true" v-model="form.ship_as_bill"> {{ 'use_ship_as_bill' | t }}</label>
          </div>

          <div v-if="!form.ship_as_bill">
            <h3>{{ 'cart_bill_address' | t }}</h3>
            <div class="sb-form__row">
              <label class="sb-form__radio-label" for="sb-f-17"><input id="sb-f-17" class="sb-form__radio" :value="false" name="sb-f-17" type="radio" v-model="form.bill_address_attributes.sex"> {{ 'mr' | t }}</label>
              <label class="sb-form__radio-label" for="sb-f-18"><input id="sb-f-18" class="sb-form__radio" :value="true" name="sb-f-17" type="radio" v-model="form.bill_address_attributes.sex"> {{ 'mrs' | t}}</label>
            </div>
            <div class="sb-grid sb-form__row">
              <div class="sb-width-1-2@m">
                <label class="sb-form__label" for="sb-f-19">{{ 'firstname' | t }} *</label>
                <input id="sb-f-19" class="sb-form__input" type="text" v-model="form.bill_address_attributes.firstname" name="fname" autocomplete="given-name">
              </div>
              <div class="sb-width-1-2@m">
                <label class="sb-form__label" for="sb-f-20">{{ 'lastname' | t }} *</label>
                <input id="sb-f-20" class="sb-form__input" type="text" v-model="form.bill_address_attributes.lastname" name="lname" autocomplete="family-name">
              </div>
            </div>
            <div class="sb-grid sb-form__row">
              <div class="sb-width-1-2@m">
                <label class="sb-form__label" for="sb-f-21">{{ 'address1' | t }} *</label>
                <input id="sb-f-21" class="sb-form__input" type="text" v-model="form.bill_address_attributes.address1" name="bill-address" autocomplete="shipping street-address">
              </div>
              <div class="sb-width-1-2@m">
                <label class="sb-form__label" for="sb-f-22">{{ 'address2' | t }}</label>
                <input id="sb-f-22" class="sb-form__input" type="text" v-model="form.bill_address_attributes.address2">
              </div>
            </div>
            <div class="sb-grid sb-form__row">
              <div class="sb-width-1-2@m">
                <label class="sb-form__label" for="sb-f-23">{{ 'zip' | t }} *</label>
                <input id="sb-f-23" class="sb-form__input" type="text" v-model="form.bill_address_attributes.zip" name="bill-zip" autocomplete="billing postal-code">
              </div>
              <div class="sb-width-1-2@m">
                <label class="sb-form__label" for="sb-f-24">{{ 'city' | t }} *</label>
                <input id="sb-f-24" class="sb-form__input" type="text" v-model="form.bill_address_attributes.city" name="bill-city" autocomplete="billing address-level2">
              </div>
            </div>
            <div class="sb-form__row">
              <label class="sb-form__label" for="sb-f-25">{{ 'country' | t }} *</label>
              <select id="sb-f-25" class="sb-form__select" v-model="form.bill_address_attributes.country_id" name="bill-country">
                <option v-for="country in countries" v-bind:value="country.id">{{ country.name }}</option>
              </select>
            </div>
            <div class="sb-form__row">
              <label class="sb-form__label" for="sb-f-26">{{ 'phone' | t }}</label>
              <input id="sb-f-26" class="sb-form__input" type="text" v-model="form.bill_address_attributes.phone" name="phone" autocomplete="tel">
            </div>
          </div>

          <sb-error-box :messages="messages.setAddress"></sb-error-box>

          <a href="#sb-step02" v-bind:class="{'sb-u__disabled': loader.setAddress}" class="sb-button" v-on:click.prevent="setAddress">{{ 'cart_next_step' | t }}</a>
        </form>
      </div>
    </div>
    <div class="sb-steps__step" v-bind:class="{'sb-steps--active': currentStep > 2}">
      <div class="sb-steps__overlay"></div>
      <div class="sb-steps__count">03</div>
      <div class="sb-steps__content">
        <h2>{{ 'cart_shipping' | t }}</h2>
        <div class="sb-alert sb-alert--info" v-if="!shippingMethodsLoaded">
          {{ 'cart_fill_out_address' | t }}
        </div>
        <div v-for="method in checkout.shipping_methods" class="sb-form__option-wrap">
          <label>
            <input class="sb-form__radio" type="radio" v-on:change="setShipMethod" v-model="form.shipping_method" v-bind:value="method.id">
            {{ method.name }} <span class="sb-form__number-in-radio">{{ method.num | currency(checkout.currency) }}</span>
          </label>
        </div>
      </div>
    </div>
    <a name="sb-step04"></a>
    <div class="sb-steps__step" v-bind:class="{'sb-steps--active': currentStep > 3}">
      <div class="sb-steps__overlay"></div>
      <div class="sb-steps__count">04</div>
      <div class="sb-steps__content">
        <h2>{{ 'cart_payment' | t }}</h2>
        <div v-for="module in checkout.payment_methods" class="sb-form__option-wrap">
          <label>
            <input class="sb-form__radio" type="radio" v-model="form.payment_method" v-bind:value="module.id">
            {{ module.name | t }}
            <span class="sb-form__help">{{ module.name + '_description' | t }}</span>
          </label>

          <div v-if="form.payment_method == module.id">
            <component :ref="module.id" :is="module.id" :module="module"></component>
          </div>
        </div>

        <div class="sb-form__row sb-steps__terms">
          <label for="sb-f-29">
            <input id="sb-f-29" class="sb-form__checkbox" type="checkbox" v-model="form.accept_terms">
            {{ 'cart_accept_shop_terms' | t }}
          </label>
          <a :href="checkout.terms_link" target="_blank">{{ 'open_terms_of_use' | t }}</a>
        </div>

        <div class="sb-form__row">
          * {{ 'required_fields' | t }}
        </div>

        <sb-error-box :messages="messages.order"></sb-error-box>

        <a href="#sb-step04" v-bind:class="{'sb-u__disabled': loader.createOrder}" class="sb-button" v-on:click.prevent="createOrder">{{ 'cart_place_order' | t }}</a>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import State from './State'
import api from '../libs/api'
import store from '../libs/store'
import smoothScroll from '../libs/smoothScroll'
import loadScript from '../libs/loadScript'

var lang = function(val) {
  return val
}

export default {
  data: function() {
    return {
      title: 'Checkout',
      signup: 'yes',
      userCountry: 'US',
      loader: {
        init: false,
        signup: false,
        login: false,
        setAddress: false,
        createOrder: false,
      },
      validateStep: 'init',
      login: {
        emailChecked: false,
        emailExists: false
      },
      customerForm: {
        email: '',
        password: '',
        email_subscribe: 0,
        origin: 'US'
      },
      form: {
        accept_terms: false,
        shipping_method: '',
        payment_method: 'paypal_express',
        email: '',
        password: '',
        ship_address_attributes: {
          country_id: 0,
          sex: false
        },
        bill_address_attributes: {
          country_id: 0,
          sex: false
        },
        ship_as_bill: true,
        is_guest: false
      },
      orderNumber: '',
      orderWasCreated: false,
      editAddress: false,
      countries: [],
      customerAddresses: [],
      messages: {
        signup: null,
        login: null,
        order: null,
        setAddress: null,
      },
      processingPayment: false,
      paymentParams: {}
    }
  },

  computed: {
    checkout: function() {
      return State.checkout
    },
    loggedIn: function() {
      return State.loggedIn
    },
    customer: function() {
      return State.customer
    },
    shippingMethodsLoaded: function() {
      var methods = this.checkout.shipping_methods
      return typeof methods !== 'undefined' && methods.length
    },
    currentStep: function() {
      var step = 1
      var step2 = this.loggedIn || this.checkout.is_guest === true
      var step3 = this.checkout.ship_address
      var step4 = this.checkout.shipping_method

      if (step2) {
        step = 2
      }

      if (step2 && step3) {
        step = 3
      }

      if (step2 && step3 && step4) {
        step = 4
      }

      return step
    },
    newCustomer: function() {
      return this.login.emailChecked && !this.login.emailExists
    },
    showAddressForm: function() {
      return this.checkout.ship_address == undefined || this.editAddress
    },
    shipAddress: function() {
      if (this.checkout.ship_address) {
        return this.formattedAddress(this.checkout.ship_address)
      }
      return ''
    },
    billAddress: function() {
      if (this.checkout.bill_address) {
        return this.formattedAddress(this.checkout.bill_address)
      }
      return ''
    },
    uuid: function() {
      return store.get('uuid')
    }
  },
  methods: {
    lang(val) {
      return val
    },
    orderCreated(res) {
      this.orderWasCreated = true
      this.orderNumber = res.data.order_number
      this.processPayment()
    },
    processPayment() {
      this.processingPayment = true

      if (typeof this.$refs[this.form.payment_method][0].process !== 'undefined') {
        this.$refs[this.form.payment_method][0].process((params) => {
          this.paymentParams = params
          this.createPayment()
        }, () => {
          this.processingPayment = false
          this.unsetLoader()
        })
      } else {
        this.paymentParams = {payment_method: this.form.payment_method}
        this.createPayment()
      }
    },
    createPayment() {
      api().post(`orders/${this.orderNumber}/payments`, this.paymentParams)
        .then((res) => {
          if (res.data.redirect_url) {
            window.location.href = res.data.redirect_url
          } else {
            window.location.href = res.data
                                      .completed_url
                                      .replace('{order_number}', this.orderNumber)
                                      .replace('{url_prefix}', this.urlPrefix)
          }
        })
        .catch((error) => {
          this.processingPayment = false

          console.log(error)
          State.errors = error.response.data
        })
    },
    toLogin() {
      this.login.emailExists = true
      this.newCustomer = false
    },
    createOrder() {
      if (!this.form.accept_terms) {
        this.messages.order = [this.$options.filters.t('please_accept_terms')]
        return
      }

      if (!this.form.payment_method) {
        this.messages.order = [this.$options.filters.t('please_choose_a_payment_method')]
        return
      }

      this.validateStep = 'createOrder'
      this.setLoader()

      if (this.orderWasCreated) {
        this.processPayment()
      } else {
        api().post(`checkouts/${this.uuid}/orders`)
          .then((res) => {
            this.unsetLoader()
            this.orderCreated(res)
          })
          .catch((error) => {
            this.unsetLoader()
            console.log(error)
            State.errors = error.response.data
          })
      }
    },
    unsetLoader() {
      this.loader[this.validateStep] = false
    },
    setShipMethod() {
      this.updateCheckout({
          shipping_method: this.form.shipping_method
        })
        .then(() => {
          this.scrollTo('sb-step04')
        })
    },
    doEditAddress() {
      this.editAddress = true

      if (this.checkout.ship_address !== null) {
        this.form.ship_address_attributes = this.checkout.ship_address
      }

      if (this.checkout.bill_address !== null) {
        this.form.bill_address_attributes = this.checkout.bill_address
      }
    },
    formattedAddress(a) {
      return a.firstname + ' ' + a.lastname + '<br />' +
             a.address1 + '<br />' +
             (a.address2 ? a.address2 + '<br />' : '') +
             (a.zip != '0' ? a.zip + ' ' : '') + a.city + '<br />' +
             a.country
    },
    setAddress() {
      this.validateStep = 'setAddress'
      this.setLoader()

      let data = {
        ship_address_attributes: this.form.ship_address_attributes,
        ship_as_bill: this.form.ship_as_bill
      }

      if (!this.form.ship_as_bill) {
        data.bill_address_attributes = this.form.bill_address_attributes
      }

      this.updateCheckout(data)
          .then(() => {
            this.scrollTo('sb-step02')
            this.editAddress = false
            this.addCustomerAddress()
          })
    },
    addCustomerAddress() {
      if (this.loggedIn && !this.customerAddresses.length) {
        let address = Object.assign({is_default_ship: true}, this.form.ship_address_attributes)
        api().post('customer_addresses', address)
          .catch((error) => {
            State.errors = error.response.data
          })
      }
    },
    scrollTo(name) {
      smoothScroll(document.querySelector(`[name="${name}"]`))
    },
    updateCheckout(data) {
      return new Promise((resolve, reject) => {
        api().put(`/checkouts/${this.uuid}`, data)
             .then((res) => {
               this.setCartContents(res)
               resolve(res)
             })
             .catch((res) => {
               this.setError(res)
               reject(res)
             })
      })
    },
    doLogin() {
      this.validateStep = 'signup'
      this.setLoader()

      api().post('customer_sessions', this.customerForm)
        .then((res) => {
          State.customer = res.data
          State.loggedIn = true
          this.unsetLoader()
          this.getCustomerAddresses()
        })
        .catch((res) => {
          this.unsetLoader()
          this.setError(res)
        })
    },
    doLogout() {
      api().delete('/customer_sessions/me')
        .then((res) => {
          State.loggedIn = false
          State.customer = {}
        })
        .catch((error) => {
          State.errors = error.response.data
        })
    },
    doGuestSignup() {
      this.validateStep = 'signup'
      this.setLoader()
      this.form.is_guest = true

      this.updateCheckout({
          email: this.customerForm.email,
          is_guest: this.form.is_guest
        })
        .then(() => {
          this.scrollTo('sb-step02')
        })
    },
    doSignup() {
      this.validateStep = 'signup'
      this.setLoader()
      this.form.is_guest = false

      api().post('customer_accounts', this.customerForm)
        .then((res) => {
          State.customer = res.data
          State.loggedIn = true
          this.unsetLoader()
        })
        .catch(this.setError)
    },
    setError(error) {
      this.loader[this.validateStep] = false
      this.messages[this.validateStep] = error.response.data
    },
    setCartContents(res) {
      State.checkout = res.data

      this.loader[this.validateStep] = false
      this.messages[this.validateStep] = null
      this.form.is_guest = res.data.is_guest
      this.form.ship_as_bill = res.data.ship_as_bill
      this.form.shipping_method = res.data.shipping_method
      this.form.payment_method = res.data.payment_method

      State.resolve('checkoutLoaded')

      if (this.form.is_guest) {
        this.customerForm.email = res.data.email
      }
    },
    setLoader() {
      this.loader[this.validateStep] = true
    },
    getCustomerAddresses() {
      api().get('/customer_addresses')
        .then((res) => {
          State.waitUntil('checkoutLoaded').then(() => {
            this.customerAddresses = res.data

            if (this.customerAddresses.length && State.checkout.ship_address === null) {
              delete this.customerAddresses[0].id
              this.form.ship_address_attributes = Object.assign({}, this.customerAddresses[0])
            }
          })
        })
        .catch(() => {})
    }
  },
  created() {
    api().get(`/checkouts/${this.uuid}`)
      .then(this.setCartContents)
      .catch(this.setError)

    api().get('/countries?active=1')
      .then((res) => {
        this.countries = res.data

        State.waitUntil('checkoutLoaded').then(() => {
          this.userCountry = res.request.getResponseHeader('Country')

          let userCountries = this.countries.filter((country) => {
            return country.iso_code_2 == this.userCountry
          })

          if (userCountries.length) {
            this.form.ship_address_attributes.country_id = userCountries[0].id
          } else if (this.countries.length) {
            this.form.ship_address_attributes.country_id = this.countries[0].id
          }
        })
      })

    if (!this.$sbState.disableSignup) {
      this.getCustomerAddresses()
    }
  },

  watch: {
    'form.ship_as_bill': function(val) {
      if (val) {
        this.form.bill_address_attributes = {}
      } else {
        if (this.form.bill_address_attributes.id && this.form.ship_address_attributes.id) {
          this.form.bill_address_attributes = {}
        }
      }
    },

    'currentStep': function(val) {
      if (typeof dataLayer != 'undefined') {
        dataLayer.push({'event': 'checkout_step_' + val})
      }

      if (typeof ga != 'undefined') {
        ga('ec:setAction', 'checkout', {
          'step': val
        })
        ga('send', 'event')
      }
    }
  },

  components: {
    'alipay': {
      template: '<div></div>'
    },
    'stripe-sofort': {
      template: '<div></div>',
      props: ['module'],
      methods: {
        process(cb) {
          let countryCode = State.checkout.bill_address.country_code

          cb({
            payment_method: 'stripe',
            payment_token: {},
            module_payment_method: 'sofort',
            module_payment_country: countryCode
          })
        }
      }
    },
    'stripe-alipay': {
      template: '<div></div>',
      props: ['module'],
      methods: {
        process(cb) {
          cb({
            payment_method: 'stripe',
            payment_token: {},
            module_payment_method: 'alipay'
          })
        }
      }
    },
    'stripe-creditcard': {
      template: `
      <div class="sb-form__option-wrap-content">
        <div id="card-element">
        </div>
        <div class="sb-alert" v-if="error">
          {{ error }}
        </div>
      </div>
      `,
      props: ['module'],
      data() {
        return {
          stripe: null,
          card: null,
          error: ''
        }
      },
      created() {
        loadScript('https://js.stripe.com/v3/', () => {
          const style = {
            base: {
              color: '#32325d',
              lineHeight: '18px',
              fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
              fontSmoothing: 'antialiased',
              fontSize: '16px',
              '::placeholder': {
                color: '#808080'
              }
            },
            invalid: {
              color: '#fa755a',
              iconColor: '#fa755a'
            }
          }

          this.stripe = Stripe(this.module.public_key)
          const elements = this.stripe.elements()
          this.card = elements.create('card', {style: style})
          this.card.mount('#card-element')
        })
      },
      methods: {
        process(cb, errorCb) {
          this.error = ''

          this.stripe.createToken(this.card).then((result) => {
            if (result.error) {
              this.error = result.error.message
              errorCb()
            } else {
              cb({
                payment_method: 'stripe',
                payment_token: result.token,
                module_payment_method: 'credit_card'
              })
            }
          }).catch((error) => {
            console.log(error)
            errorCb()
          })
        }
      }
    },
    'payunity': {
      template: '<div></div>'
    },
    'cod': {
      computed: {
        description() {
          return this.module.description.replace(/(?:\r\n|\r|\n)/g, '<br />')
        }
      },
      template: '<div><div class="sb-form__option-wrap-content" v-if="description" v-html="description"></div></div>',
      props: ['module']
    },
    'paypal_express': {
      template: '<div></div>'
    },
    'ingenico': {
      template: '<div></div>'
    }
  }
}
</script>
