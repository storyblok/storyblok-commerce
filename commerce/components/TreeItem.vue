<template>
  <div class="sb-tree-item__headline"
      v-bind:class="{'sb-tree-item--active': active, 'sb-tree-item--has-childs': model.children.length > 0, 'sb-tree-item__zero': model.item.doc_count == 0 && model.children.length == 0}">
    <router-link class="sb-tree-item__link" :to="{name: 'SbShop', params: {locale: $sbState.locale, view: 'catalogue', id: model.item.slug}}">
      {{ model.item.name }} <span class="sb-tree-item__headline-count">({{ model.item.doc_count }})</span>
      <span uk-icon="icon: chevron-right"></span>
    </router-link>
  </div>
</template>

<script>
/* eslint-disable */
import State from './State'

export default {
  props: {
    model: Object
  },

  computed: {
    active() {
      return State.category.id === this.model.item.id
    }
  },

  data: function () {
    return {
      open: false
    }
  },

  methods: {
    doFilter() {
      this.$emit('category-selected', this.model)
      this.$emit('selected', 'categories.id', '0', this.model.item.id)
    },

    passSelection(key, parent, id) {
      this.$emit('selected', key, parent, id)
    }
  }
}
</script>
