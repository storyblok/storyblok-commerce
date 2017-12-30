<template>
  <div class="sb-minicart"
    style="position: fixed; top: 0; bottom: 0; height: 100%;"
    :style="[setHorizontal, { 'width': width + 'px', 'transform': translateWidth }]">
    <div v-if="visible">
      <h3>{{ 'my_cart' | t }}</h3>
      <sb-order-summary :order="checkout"></sb-order-summary>
      <div v-if="checkout.order_items && checkout.order_items.length > 0">
        <router-link class="sb-button" :to="{name: 'SbShop', params: {locale: $sbState.locale, view: 'checkout', id: 'me'}}">
          {{ 'go_to_checkout' | t }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import State from './State'

export default {
  data () {
    return {
      visible: false
    }
  },
  props: {
    value: {
      type: Boolean
    },

    align: {
      type: String,
      default: 'left'
    },

    width: {
      type: Number,
      default: 270
    },

    duration: {
      type: Number,
      default: 0.2
    },

    effect: {
      type: String,
      default: 'linear'
    }
  },

  watch: {
    'value' (val) {
      setTimeout(() => this.toggle(val))
    }
  },

  computed: {
    setHorizontal () {
      return this.align === 'right' ? { right: 0 } : { left: 0 }
    },

    translateWidth () {
      return this.align === 'right' ? 'translateX(' + (this.width+50) + 'px)' : 'translateX(-' + (this.width-50) + 'px)'
    },

    itemCount: function() {
      if (State.checkout !== null && typeof State.checkout.order_items !== 'undefined') {
        return State.checkout.order_items.length
      } else {
        return 0
      }
    },

    checkout: function() {
      return State.checkout
    }
  },

  methods: {
    clickOutside (e) {
      if (!this.$el.contains(e.target) && this.visible) {
        this.$emit('sidebar-closed', false)
        this.toggle(false)
      }
    },

    esc (e) {
      if (e.keyCode === 27) {
        this.$emit('sidebar-closed', false)
        return this.toggle(false)
      }
    },

    toggle (show) {
      if (show) {
        document.addEventListener('click', this.clickOutside)
        document.addEventListener('keydown', this.esc)

        this.$el.style.transform = 'translateX(0)'
        this.visible = true
      } else {
        this.$el.style.transform = this.align === 'right' ? 'translateX('+(this.width+50)+'px)' : 'translateX(-'+(this.width-50)+'px)'

        setTimeout(() => {
          this.visible = false
        })
      }
    }
  }
}
</script>
