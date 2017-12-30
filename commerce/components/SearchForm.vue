<template>

</template>

<script>
/* eslint-disable */
import api from '../libs/api'

export default {
  data: function() {
    return {
      products: [],
      term: '',
      searched: false
    }
  },

  computed: {
    message() {
      if (!this.products.length) {
        return 'No products with this term found'
      }
      return ''
    }
  },

  methods: {
    openSearch() {
      window.location.href = '/' + window.SITE_LANG + '/category/' +
                             window.SITE_ROOT_SLUG + '?term=' + this.term
    },

    search() {
      api().post('/searches', {search: this.buildQuery()})
        .then((res) => {
          this.products = res.data.products
          setTimeout(() => {
            this.searched = true
            this.$el[0].focus()
          }, 100)
        })
        .catch((error) => {
          console.log(error)
        })
    },

    blur() {
      setTimeout(() => {
        this.searched = false
      }, 300)
    },

    buildQuery() {
      let must = []

      must.push({
        multi_match: {
          query: this.term,
          fields: ['name^4', 'sku^3', 'excerpt', 'description', 'categories.name^2', 'properties.name^1'],
          type: 'phrase_prefix'
        }
      })

      let query = {
        size: 5,
        query: {
          bool: {
            must: must,
            filter: [
              {term: {'categories.id': window.SITE_ROOT_ID}},
              {term: {enabled: true}}
            ]
          }
        }
      }

      return query
    }
  },

  watch: {
    term() {
      this.search()
    }
  },

  created() {

  }
}
</script>
