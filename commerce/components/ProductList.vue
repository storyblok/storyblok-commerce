<template>
  <div class="sb-grid sb-grid-medium" v-if="products.length > 0">
    <div :key="p.id" v-for="p in products" class="sb-width-1-2 sb-width-1-3@m">
      <div class="sb-u__relative">
        <figure class="sb-product-list__item-image">
          <img
            :src="p.primary_image | resize('372x372')"
            class="sb-product-list__img"
            alt="">
          <div class="sb-product-list__item-badge" v-if="p.track_stock && p.quantity == 0">
            {{ 'out_of_stock' | t }}
          </div>
        </figure>
        <div class="sb-product-list__item-data">
          <div class="sb-product-list__item-name">{{ p.name }}</div>
          <div class="sb-product-list__item-price">
            <span v-if="p.saleprice > 0">
              {{ p.saleprice | currency(p.currency) }}
              <del>{{ p.price | currency(p.currency) }}</del>
            </span>
            <span v-else>
              {{ p.price | currency(p.currency) }}
            </span>
          </div>
        </div>
        <router-link class="sb-product-list__item-link" :to="{name: 'SbShop', params: {locale: 'de', view: 'product', id: p.slug}}"></router-link>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: ['products']
}
</script>
