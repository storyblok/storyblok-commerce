<template>
  <div class="uk-grid">
    <div class="uk-width-1-1 uk-width-1-2@s">
      <div class="uk-panel uk-panel-box">
        <h3>{{ 'reset_password' | t }}</h3>

        <form @submit.prevent="resetPassword">
          <div class="uk-form uk-form-stacked">
            <div class="uk-margin">
              <label class="uk-form-label" for="register_password">{{ 'password' | t }} *</label>
              <div class="uk-form-controls uk-position-relative">
                <input required id="register_password" v-model="form.password" class="uk-input" type="password" autocomplete="off">
              </div>
            </div>

            <div class="uk-margin">
              <label class="uk-form-label" for="password_confirmation">{{ 'password_confirmation' | t }} *</label>
              <div class="uk-form-controls uk-position-relative">
                <input required id="password_confirmation" v-model="form.password_confirmation" class="uk-input" type="password" autocomplete="off">
              </div>
            </div>

            <div class="uk-margin">
              <a href="#/register" class="uk-float-right">
                {{ 'back_to_login' | t }}
              </a>

              <button type="submit" :disabled="loading" class="uk-button uk-button-default">{{ 'reset_password' | t }}</button>
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
      form: {
        password_confirmation: '',
        password: '',
        reset_password_token: ''
      },
      loading: false
    }
  },

  props: ['id'],

  methods: {
    resetPassword() {
      this.loading = true
      this.form.reset_password_token = this.id

      api().put('/customer_resets/me', this.form)
        .then(() => {
          this.loading = false
          State.goTo('register')
          UIkit.notification(this.$options.filters.t('action_success'))
        })
        .catch((error) => {
          this.loading = false
          console.log(error.response.data)
          State.errors = error.response.data
        })
    }
  }
}
</script>
