<template>
  <div class="variants">
    <h4>{{ 'choose_variant' | t }}</h4>
    <div class="variants__list uk-flex">
      <a @click.prevent="setOption(variant.id)" v-for="variant in variants"
         class="variant"
         :class="{'variant--active': active(variant.id)}">
        {{ variant.name }}
      </a>
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
      properties: {},
      childs: [],
      options: [],
      selection: []
    }
  },

  computed: {
    variants() {
      return this.options.filter((option) => {
        return this.childs.filter((child) => {
          return child.category_ids.indexOf(option.id) > -1
        }).length > 0
      })
    }
  },

  watch: {
    'properties.optionIds': function() {
      this.setupVariations()
    },

    selection() {
      let product = this.childs.filter((child) => {
        return this.selection.filter((option) => {
          return child.category_ids.indexOf(option) > -1
        }).length > 0
      })

      if (product.length === 1) {
        State.variant = product[0]
        this.updateVariantData()
      }
    }
  },

  methods: {
    updateVariantData() {
      let variantPrice = document.querySelector('[data-variant="price"]')
      if (variantPrice) {
        variantPrice.innerHTML = this.$options.filters.currency(State.variant.realprice)
      }
    },

    setOption(id) {
      // TODO implement logic to handle multiple option groups
      this.selection = [id]
    },

    active(id) {
      return this.selection.indexOf(id) > -1
    },

    setupVariations() {
      api().get('properties', {
          params: {parent_id: this.properties.optionIds}
        })
        .then((res) => {
          this.options = res.data
        })
        .catch((error) => {
          State.errors = error.response.data
        })

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
