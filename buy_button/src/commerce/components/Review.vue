<template>
  <div>
    <a href="#/profile"><span uk-icon="icon: arrow-left"></span> {{ 'back' | t }}</a>
    <h2>{{ 'review' | t }}</h2>
    <div v-if="sent">
      {{ 'review_sent' | t }}
    </div>
    <form @submit.prevent="sendReview" class="uk-margin-small-top uk-form-stacked" v-else>
      <div class="uk-margin">
        <label class="uk-form-label">{{ 'testinomial_rating' | t }}</label>
        <div class="uk-form-controls">
          <p>
            <label><input class="uk-radio" v-model="review.rating_total" name="rating_total" type="radio" value="1" />1 {{ 'star' | t }}</label><br>
            <label><input class="uk-radio" v-model="review.rating_total" name="rating_total" type="radio" value="2" />2 {{ 'stars' | t }}</label><br>
            <label><input class="uk-radio" v-model="review.rating_total" name="rating_total" type="radio" value="3" />3 {{ 'stars' | t }}</label><br>
            <label><input class="uk-radio" v-model="review.rating_total" name="rating_total" type="radio" value="4" />4 {{ 'stars' | t }}</label><br>
            <label><input class="uk-radio" v-model="review.rating_total" name="rating_total" type="radio" value="5" />5 {{ 'stars' | t }}</label>
          </p>
        </div>
      </div>
      <div class="uk-margin">
        <label class="uk-form-label">{{ 'testimonial_firstname' | t }}</label>
        <div class="uk-form-controls">
          <input class="uk-input" v-model="review.firstname" />
        </div>
      </div>
      <div class="uk-margin">
        <label class="uk-form-label">{{ 'testimonial_message' | t }}</label>
        <div class="uk-form-controls">
          <textarea required class="uk-textarea" v-model="review.message" rows="5"></textarea>
        </div>
      </div>
      <button type="submit" class="uk-button uk-button-default">
        {{ 'submit' | t }}
      </button>
    </form>
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
      sent: false,
      review: {
        rating_total: '1',
        message: '',
        product_id: ''
      }
    }
  },

  props: ['id'],

  computed: {
    customer: function() {
      return State.customer
    }
  },

  methods: {
    sendReview() {
      if (!this.id.length) {
        return
      }

      this.review.product_id = this.id
      this.loading = true

      api().post('/testimonials', this.review)
        .then((res) => {
          this.loading = false
          this.sent = true
        })
        .catch((error) => {
          State.errors = error.response.data
        })
    }
  }
}
</script>
