# Ecommerce SPA built on top of Vuejs

Status: Pre-Alpha. Get a demo on [www.storyblok.com/commerce](https://www.storyblok.com/commerce)

## Requirements

* Requires vue-router

## Install

1. Import the javascript

```
import Commerce from 'storyblok-commerce'
Vue.use(Commerce, {token: 'EfFxEv57hp0SB4riYTYocwtt'})
```

2. Optionally import the styles

```
@import '../node_modules/storyblok-commerce/scss/styles.scss';
```

3. Create a container component

```
<template>
  <div class="my-shop">
    <sb-shop locale="en"
             :view="$route.params.view"
             :id="$route.params.id"></sb-shop>
  </div>
</template>

<script>
export default {
  name: 'Shop'
}
</script>
```

4. Add the SbShop route to your vue-router configuration

```
// Example
import Shop from '@/components/Shop'

export default new Router({
  routes: [
    {
      path: '/shop/:locale/:view/:id',
      name: 'SbShop',
      component: Shop
    }
  ]
})
```


## Usage

```
<sb-shop locale="en"
  :view="$route.params.view"
  :id="$route.params.id"></sb-shop>
```
