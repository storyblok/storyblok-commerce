<template>
  <div class="sb-quantity-input">
    <button class="sb-quantity-input__changer" v-on:click.prevent="sub">-</button>
    <input ref="input" class="sb-quantity-input__input" id="quantity_input" name="quantity" v-bind:value="value" v-on:input="updateValue($event.target.value)">
    <button class="sb-quantity-input__changer" v-on:click.prevent="add">+</button>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: ['value'],

  methods: {
    add() {
      this.updateValue(this.value + 1)
    },
    sub() {
      this.updateValue(this.value - 1)
    },
    updateValue(quantity) {
      quantity = parseInt(quantity)

      if (isNaN(quantity)) {
        quantity = 1
      }

      if (quantity < 1) {
        this.$emit('input', 1)
      } else {
        this.$emit('input', quantity)
        this.$refs.input.value = quantity
      }
    }
  }
}
</script>
