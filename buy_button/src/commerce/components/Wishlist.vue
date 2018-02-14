<template>
  <div class="uk-margin-top uk-margin-bottom">
    <div v-if="!wishes.length && !loading" class="uk-margin-large-top uk-text-center">{{ 'no_items_in_wishlist' | t }}</div>
    <div class="uk-grid">
      <div class="uk-width-1-4@m" v-for="wish in wishes">
        <div class="uk-position-relative">
          <a class="product-list__item-link" :href="wish.product.slug | product_url"></a>
          <figure class="product-list__item-image">
              <img :src="wish.product.primary_image | resize('370x370')">
          </figure>
          <div class="product-list__item-data">
            <h3 class="product-list__item-name">{{ wish.product.name }}</h3>
            <h4 class="product-list__item-price">
              {{ wish.product.price | currency }}
              <del v-if="wish.product.saleprice">{{ wish.product.saleprice | currency }}</del>
            </h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import api from '../libs/api'
import store from '../libs/store'

export default {
  data() {
    return {
      wishes: [],
      loading: false
    }
  },

  created() {
    let uuid = store.get('wishlistUuid')

    if (uuid) {
      this.loading = true

      api().get(`/wishlists/${uuid}/wishes`)
        .then((res) => {
          this.wishes = res.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  },

  methods: {

  }
}
</script>
