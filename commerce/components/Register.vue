<template>
  <div class="sb-grid sb-register">
    <div class="sb-width-1-1 sb-width-1-2@s">
      <div class="sb-register__box">
        <h3>{{ 'already_registered' | t }}</h3>

        <form @submit.prevent="doLogin">
          <div class="sb-form sb-form-stacked">
            <div class="sb-form__row">
              <label class="sb-form__label" for="user_email">{{ 'email' | t }}</label>
              <div class="sb-form__controls">
                <input id="user_email" v-model="login.email" class="sb-form__input" type="email" name="email" placeholder="example@youremail.com">
              </div>
            </div>

            <div v-if="!showRestorePassword">
              <div class="sb-form__row">
                <label class="sb-form__label" for="user_password">{{ 'password' | t }}</label>
                <div class="sb-form__controls">
                  <input id="user_password" v-model="login.password" class="sb-form__input" type="password" name="password">
                </div>
              </div>

              <div class="sb-form__row">
                <a href="#" @click.prevent="showRestorePassword = true" class="sb-u__float-right">
                  {{ 'forgot_password' | t }}
                </a>
                <button type="submit" :disabled="loading" class="sb-button">{{ 'login' | t }}</button>
              </div>
            </div>

            <div v-else>
              <div class="sb-form__row">
                <a href="#" @click.prevent="showRestorePassword = false" class="sb-u__float-right">
                  {{ 'back_to_login' | t }}
                </a>
                <button type="submit" :disabled="loading" class="sb-button">{{ 'restore_password' | t }}</button>

                <p v-if="restorePasswordSent">
                  {{ 'password_sent_successfully' | t }}
                </p>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
    <div class="sb-width-1-1 sb-width-1-2@s">
      <div class="sb-register__box">
        <h3 class="panel-title">{{ 'create_new_account' | t }}</h3>

        <form @submit.prevent="doRegister">
          <div class="sb-form sb-form-stacked">
            <div class="sb-form__row">
              <label class="sb-form__label" for="register_email">{{ 'email_address' | t }} *</label>
              <div class="sb-form__controls sb-u__relative">
                <input id="register_email" v-model="registration.email" class="sb-form__input" type="email" name="email" placeholder="example@youremail.com" autocomplete="email">
                <span class="invalid" v-if="invalid.email">{{ 'field_required' | t }}</span>
              </div>
            </div>
            <div v-if="!registerOpen" class="sb-form__row">
              <button @click.prevent="showRegister" class="sb-button">{{ 'continue' | t }}</button>
            </div>
            <div v-if="registerOpen">
              <div class="sb-form__row">
                <div class="sb-form__controls sb-u__relative sb-grid-small uk-child-width-auto sb-grid">
                  <label><input name="gender" class="uk-radio" type="radio" :value="false" v-model="registration.sex" /> {{ 'mr' | t }}</label>
                  <label><input name="gender" class="uk-radio" type="radio" :value="true" v-model="registration.sex" /> {{ 'mrs' | t }}</label>
                </div>
              </div>
              <div class="sb-form__row">
                <label class="sb-form__label">{{ 'firstname' | t }} *</label>
                <div class="sb-form__controls sb-u__relative">
                  <input class="sb-form__input" type="text" v-model="registration.firstname" name="fname" autocomplete="given-name" />
                  <span class="invalid" v-if="invalid.firstname">{{ 'field_required' | t }}</span>
                </div>
              </div>
              <div class="sb-form__row">
                <label class="sb-form__label">{{ 'lastname' | t }} *</label>
                <div class="sb-form__controls sb-u__relative">
                  <input class="sb-form__input" type="text" v-model="registration.lastname" name="lname" autocomplete="family-name" />
                  <span class="invalid" v-if="invalid.lastname">{{ 'field_required' | t }}</span>
                </div>
              </div>
              <div class="sb-form__row">
                <label class="sb-form__label" for="register_password">{{ 'password' | t }} *</label>
                <div class="sb-form__controls sb-u__relative">
                  <input id="register_password" v-model="registration.password" class="sb-form__input" type="password" autocomplete="off">
                  <span class="invalid" v-if="invalid.password">{{ 'field_required' | t }}</span>
                </div>
              </div>
              <div class="sb-form__row">
                <label class="sb-form__label" for="password_confirmation">{{ 'password_confirmation' | t }} *</label>
                <div class="sb-form__controls sb-u__relative">
                  <input id="password_confirmation" v-model="registration.password_confirmation" class="sb-form__input" type="password" autocomplete="off">
                  <span class="invalid" v-if="invalid.password_confirmation">{{ 'field_required' | t }}</span>
                </div>
              </div>
              <div class="sb-form__row">
                <label class="sb-form__label">{{ 'phone' | t }} *</label>
                <div class="sb-form__controls sb-u__relative">
                  <input v-model="registration.mobile" class="sb-form__input" name="phone" autocomplete="tel">
                  <span class="invalid" v-if="invalid.mobile">{{ 'field_required' | t }}</span>
                </div>
              </div>
              <div class="sb-form__row">
                <label class="sb-form__label">{{ 'address1' | t }} *</label>
                <div class="sb-form__controls sb-u__relative">
                  <input v-model="registration.default_address1" class="sb-form__input" name="ship-address" autocomplete="shipping street-address">
                  <span class="invalid" v-if="invalid.default_address1">{{ 'field_required' | t }}</span>
                </div>
              </div>
              <div class="sb-form__row">
                <div class="sb-grid">
                  <div class="sb-width-1-2@m register__address-details">
                    <label class="sb-form__label">{{ 'zip' | t }}</label>
                    <div class="sb-form__controls sb-u__relative">
                      <input v-model="registration.default_zip" class="sb-form__input" name="ship-zip" autocomplete="shipping postal-code">
                    </div>
                  </div>
                  <div class="sb-width-1-2@m">
                    <label class="sb-form__label">{{ 'city' | t }} *</label>
                    <div class="sb-form__controls sb-u__relative">
                      <input v-model="registration.default_city" class="sb-form__input" name="ship-city" autocomplete="shipping locality">
                      <span class="invalid" v-if="invalid.default_city">{{ 'field_required' | t }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="sb-form__row">
                <label class="sb-form__label">{{ 'country' | t }} *</label>
                <div class="sb-form__controls sb-u__relative">
                  <select id="sb-f-14" class="sb-form__select" v-model="registration.default_country_id">
                    <option v-for="country in countries" v-bind:value="country.id">{{ country.name }}</option>
                  </select>
                  <span class="invalid" v-if="invalid.default_country_id">{{ 'field_required' | t }}</span>
                </div>
              </div>
              <div class="sb-form__row">
                <label>
                  <input type="checkbox" v-model="registration.email_subscribe" class="uk-checkbox" v-bind:false-value="0" v-bind:true-value="1"  />
                  {{ 'want_to_receive_newsletter' | t }}
                </label>
              </div>
              <div class="sb-form__row">
                <p>
                  * {{ 'required_fields' | t }}
                </p>
                <button type="submit" :disabled="loading" class="sb-button">{{ 'register' | t }}</button>
                <p v-if="!isValid" class="invalid">
                  {{ 'fill_fields' | t }}
                </p>
              </div>
            </div>
          </div>
        </form>
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
      loading: false,
      registerOpen: false,
      login: {
        email: '',
        password: ''
      },
      registration: {
        sex: false,
        email: '',
        password: '',
        customer_type: 'Default',
        default_country_id: 0,
        email_subscribe: 0,
        origin: 'en'
      },
      invalid: {},
      isValid: true,
      showRestorePassword: false,
      restorePasswordSent: false
    }
  },

  created() {
    api().get('/countries?active=1')
      .then((res) => {
        this.countries = res.data

        if (this.countries.length > 0) {
          this.registration.default_country_id = this.countries[0].id
        }
      })
  },

  methods: {
    showRegister() {
      this.registerOpen = true
    },

    forgot() {
      if (!this.login.email.length) {
        alert('Please fill in your email address')
        return
      }

      api().post('/customer_resets', {
          email: this.login.email,
          redirect: window.location.origin + window.location.pathname + '#/password-reset/'
        })
        .then(() => {
          this.restorePasswordSent = true
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          State.errors = error.response.data
        })
    },

    requiredFields() {
      return [
        'email',
        'firstname',
        'lastname',
        'password',
        'password_confirmation',
        'mobile',
        'default_address1',
        'default_city'
      ]
    },

    valid() {
      let fields = this.requiredFields()
      this.isValid = true
      this.invalid = {}

      fields.forEach((item) => {
        if (typeof this.registration[item] === 'undefined' || !this.registration[item].length) {
          this.invalid[item] = 1
          this.isValid = false
        }
      })

      return this.isValid
    },

    doRegister() {
      if (!this.valid()) {
        return
      }

      this.loading = true

      api().post('/customer_accounts', this.registration)
        .then((res) => {
          State.customer = res.data
          State.loggedIn = true
          this.loading = false
          State.resolve('customerLoaded')
          this.$router.push({name: 'SbShop', params: {locale: this.$sbState.locale, view: 'profile', id: 'me'}})
        })
        .catch((error) => {
          this.loading = false
          State.errors = error.response.data
        })
    },

    doLogin() {
      this.loading = true

      if (this.showRestorePassword) {
        return this.forgot()
      }

      api().post('/customer_sessions', this.login)
        .then((res) => {
          State.customer = res.data
          State.loggedIn = true
          this.loading = false
          State.resolve('customerLoaded')
          this.$router.push({name: 'SbShop', params: {locale: this.$sbState.locale, view: 'profile', id: 'me'}})
        })
        .catch((error) => {
          this.loading = false
          State.errors = error.response.data
        })
    }
  }
}
</script>
