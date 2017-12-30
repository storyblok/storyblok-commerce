<template>
  <a href="#" @click.prevent="add" class="wishbutton">
    <span :uk-icon="icon"></span>
    <span class="wishbutton__label" v-html="label"></span>
  </a>
</template>

<script>
/* eslint-disable */
import api from '../libs/api'
import store from '../libs/store'
import State from './State'

export default {
  data() {
    return {
      added: false,
      loading: false,
      wishId: null,
      properties: {}
    }
  },

  computed: {
    icon() {
      if (this.added) {
        return 'icon: check'
      }
      if (this.loading) {
        return 'icon: refresh'
      }
      return 'icon: heart'
    },
    label() {
      if (this.added) {
        return this.$options.filters.t('remove_from_whishlist');
      }
      return this.$options.filters.t('add_to_whishlist');
    }
  },

  created() {
    let uuid = store.get('wishlistUuid')

    if (uuid) {
      api().get(`/wishlists/${uuid}/wishes`)
        .then((res) => {
          let wish = res.data.filter((wish) => {
            return wish.product.id == this.properties.productId
          })

          if (wish.length) {
            this.wishId = wish[0].id
            this.added = true
          }
        })
        .catch((error) => {
          if (error.response.status == 404) {
            store.delete('wishlistUuid')
          }
        })
    }
  },

  methods: {
    add() {
      if (this.loading) {
        return
      }

      let uuid = store.get('wishlistUuid')
      let wish = {product_id: this.properties.productId}
      this.loading = true

      if (!uuid) {
        api().post('/wishlists', wish)
          .then((res) => {
            store.set('wishlistUuid', res.data.uuid)
            this.toggleWish(wish, res.data.uuid)
          })
          .catch((error) => {
            this.loading = false
            State.errors = error.response.data
          })
      } else {
        this.toggleWish(wish, uuid)
      }
    },

    toggleWish(wish, wishlistUuid) {
      if (this.wishId) {
        api().delete(`/wishlists/${wishlistUuid}/wishes/${this.wishId}`)
          .then((res) => {
            this.wishId = false
            this.loading = false
            this.added = false
          })
          .catch((error) => {
            this.loading = false
            State.errors = error.response.data
          })
      } else {
        api().post(`/wishlists/${wishlistUuid}/wishes`, wish)
          .then((res) => {
            this.loading = false
            this.added = true
            this.wishId = res.data.id
          })
          .catch((error) => {
            this.loading = false
            State.errors = error.response.data
          })
      }
    }
  }
}
</script>
