# Ecommerce SPA built on top of Vuejs

Status: Pre-Alpha. Get a demo on [www.storyblok.com/commerce](https://www.storyblok.com/commerce)

## Requirements

* Requires vue-router

## Install

Javascript

```
import Commerce from 'storyblok-commerce'
Vue.use(Commerce, {token: 'EfFxEv57hp0SB4riYTYocwtt'})
```

Styles

```
@import '../node_modules/storyblok-commerce/scss/styles.scss';
```

## Usage

```
<sb-shop locale="en"
  :view="$route.params.view"
  :id="$route.params.id"></sb-shop>
```
