<template>
  <span v-if="product">
    <span v-if="product.saleprice > 0">
      {{ product.saleprice | currency(product.currency) }}
      <del>{{ product.price | currency(product.currency) }}</del>
    </span>
    <span v-else>
      {{ product.price | currency(product.currency) }}
    </span>
  </span>
</template>

<script>
/* eslint-disable */
export default {
  props: ['product']
}
</script>
