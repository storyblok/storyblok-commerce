<template>
  <section class="product-list" :class="'product-list--' + products.length" v-if="products.length > 0">
    <div class="uk-container uk-container-center">
      <h2 class="product-list__headline">{{ properties.headline }}</h2>
      <div class="uk-position-relative">
        <div class="slider js_slider" :class="{'product-list__slider': products.length > 4}">
          <div class="frame js_frame">
            <ul class="slides js_slides">
              <li class="js_slide" v-for="p in products">
                <div class="product-list__item">
                  <figure class="product-list__item-image">
                    <img :src="p.primary_image | resize('372x372')" alt="Product Image">
                  </figure>
                  <div class="product-list__item-data">
                    <h3 class="product-list__item-name">{{ p.name }}</h3>
                    <h4 class="product-list__item-price">
                      <span v-if="p.saleprice > 0">
                        {{ p.saleprice | currency(p.currency) }}
                        <del class="product-list__item-price--sale">{{ p.price | currency(p.currency) }}</del>
                      </span>
                      <span v-else>
                        {{ p.price | currency(p.currency) }}
                      </span>
                    </h4>
                  </div>
                  <a class="product-list__item-link" :href="p.slug | product_url"></a>
                </div>
              </li>
            </ul>
          </div>
          <span class="js_prev prev">
              <span uk-icon="icon: chevron-left"></span>
          </span>
          <span class="js_next next">
              <span uk-icon="icon: chevron-right"></span>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
/* eslint-disable */
import api from '../libs/api'
import {lory} from 'lory.js'

export default {
  data() {
    return {
      properties: {},
      products: []
    }
  },

  methods: {
    loadProducts(filter) {
      this.loading = true

      api().get('products', {params: filter})
        .then((res) => {
          this.loading = false
          this.products = res.data
          this.$nextTick(this.initSlider)
        })
        .catch((error) => {
          this.loading = false
          console.log(error.response.data)
        })
    },

    initSlider() {
      let productListSlider = this.$el.querySelector('.product-list__slider')

      if (productListSlider) {
        lory(productListSlider, {
          enableMouseEvents: true,
          infinite: 4,
          slidesToScroll: 1
        })
      }
    }
  },

  watch: {
    'properties.productIds': function() {
      if (this.properties.productIds) {
        this.loadProducts({product_ids: this.properties.productIds})
      }
    },

    'properties.bestsellers': function() {
      if (this.properties.bestsellers) {
        this.loadProducts({sort_by: 'sales:desc', per_page: 8})
      }
    },

    'properties.categoryId': function() {
      if (this.properties.categoryId) {
        this.loadProducts({filter_by: this.properties.categoryId})
      }
    }
  }
}
</script>
