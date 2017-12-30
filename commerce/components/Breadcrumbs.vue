<template>
  <div class="title-bar">
    <div class="uk-container">
      <h1 class="title-bar__headline">{{ category.seo_title || category.name }}</h1>
      <ul class="uk-breadcrumb">
        <li>
          <a :href="'' | site_url">{{ 'home' | t }}</a>
        </li>
        <li v-for="category in categories">
          <a :href="category.slug | category_url">
            {{ category.name }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import State from './State'

export default {
  computed: {
    categories: function() {
      return State.categories
    },

    category: function() {
      return State.category
    }
  }
}
</script>
