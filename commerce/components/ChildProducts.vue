<template>
  <div v-if="childs.length > 0" class="childs">
    <h3>{{ 'part_of_this_solution' | t }}</h3>

    <div class="uk-flex uk-flex-wrap">
      <div v-for="product in childs" class="childs__item">
        <img
          :src="product.primary_image | resize('120x120')"
          class="childs__img">
        <div class="childs__name">
          {{ product.sku }} - {{ product.name }}
        </div>
        <a :href="product.slug | product_url" class="uk-position-cover"></a>
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
      properties: {productId: null},
      childs: []
    }
  },

  watch: {
    'properties.productId': function() {
      api().get('products', {
          params: {parent_id: this.properties.productId}
        })
        .then((res) => {
          this.childs = res.data
        })
        .catch((error) => {
          State.errors = error.response.data
        })
    }
  }
}
</script>
