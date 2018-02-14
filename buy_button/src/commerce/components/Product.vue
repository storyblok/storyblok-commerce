<template>
  <div class="product uk-margin-large-bottom" v-if="product">
    <div class="uk-container uk-container-center uk-margin-top">
      <div class="sb-grid">
        <div class="sb-width-1-2@m">
          <div class="slider">
            <div class="frame js_frame">
              <ul class="slides js_slides">
                <li class="js_slide" v-for="product_image in product.images">
                  <div>
                    <a :href="product_image.filename" uk-toggle-custom="#product-detail-modal">
                      <span class="product__image-wrapper">
                        <img class="product__image" :src="product_image.filename">
                        <span class="product__image-overlay"></span>
                        <span class="uk-position-center">
                          <span class="product__icon" uk-icon="icon: search; ratio: 2.5"></span>
                        </span>
                      </span>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
            <div v-if="product.images.length > 1">
              <span class="js_prev prev">
                <span uk-icon="icon: chevron-left; ratio: 2.5"></span>
              </span>
              <span class="js_next next">
                <span uk-icon="icon: chevron-right; ratio: 2.5"></span>
              </span>
            </div>
          </div>
        </div>
        <div class="sb-width-1-2@m sb-grid-margin">
          <div class="product__price uk-clearfix">
            <span data-variant="price"><sb-price></sb-price></span>
            <sb-buy-button :product="product"></sb-buy-button>
          </div>
          <hr>

          <div v-if="product.product_type == 'variantable'">
            <sb-variations :option-ids="product.product_option_ids"></sb-variations>
            <hr>
          </div>

          <h4 class="product__sku">{{ 'article_nr' | t }} {{ product.sku }}</h4>
          {{ product.excerpt | markdown }}

          <div class="uk-margin-top">
            <div v-if="product.description">
              <h3>{{ 'description' | t }}</h3>
              <p>{{ product.description }}</p>
            </div>
          </div>

          <div v-if="product.product_type == 'packageable'">
            <sb-child-products></sb-child-products>
          </div>
          <hr>
          <p>
            <sb-social-share></sb-social-share>
            <sb-wish-button></sb-wish-button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import api from '../libs/api'

export default {
  props: ['id'],

  data() {
    return {
      product: null
    }
  },

  created() {
    this.getProduct()
  },

  watch: {
    'id': function() {
      this.getProduct()
    }
  },

  methods: {
    getProduct() {
      api().get(`products`, {params: {sku: this.id}})
        .then((res) => {
          this.product = res.data[0]
        })
    }
  }
}
</script>
