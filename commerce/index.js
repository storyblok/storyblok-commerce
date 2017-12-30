/* eslint-disable */
import 'core-js/es6/promise'
import 'core-js/fn/promise'
import 'core-js/fn/object/assign'
import 'core-js/fn/object/keys'
import 'core-js/fn/array/for-each'
import 'core-js/fn/array/filter'
import 'core-js/fn/array/find'
import Accounting from 'accounting'
import Vue from 'vue'
import Shop from './components/Shop'
import Catalogue from './components/Catalogue'
import Price from './components/Price'
import Variations from './components/Variations'
import CheckoutSteps from './components/CheckoutSteps'
import OrderSummary from './components/OrderSummary'
import TreeItem from './components/TreeItem'
import WishButton from './components/WishButton'
import Breadcrumbs from './components/Breadcrumbs'
import SearchForm from './components/SearchForm'
import Wishlist from './components/Wishlist'
import AccountBar from './components/AccountBar'
import ChildProducts from './components/ChildProducts'
import Account from './components/Account'
import Minicart from './components/Minicart'
import Checkout from './components/Checkout'
import CartItem from './components/CartItem'
import ErrorModal from './components/ErrorModal'
import ErrorBox from './components/ErrorBox'
import BuyButton from './components/BuyButton'
import QuantityInput from './components/QuantityInput'
import SocialShare from './components/SocialShare'
import NotFound from './components/NotFound'
import Review from './components/Review'
import State from './components/State'
import Order from './components/Order'
import ProductList from './components/ProductList'
import Product from './components/Product'
import FilterBar from './components/FilterBar'
import ProductSlider from './components/ProductSlider'
import Register from './components/Register'
import Profile from './components/Profile'
import Loading from './components/Loading'
import PasswordReset from './components/PasswordReset'

const vues = {}

Vue.filter('resize', function(image, option) {
  if (!image) {
    return 'https://a.storyblok.com/f/39898/500x500/61c220429b/placeholder.gif'
  }
  var imageService = '//img3.storyblok.com/'
  return imageService + (option ? (option + '/') : '') + image
})

Vue.filter('currency', function(value, currency) {
  let currencies = {
    'HKD': 'HK$',
    'TWD': 'TW$',
    'USD': '$',
    'EUR': '€'
  }
  let _currency = currency || USD
  return Accounting.formatMoney(value, currencies[_currency] || '$', 2, ',', '.')
})

let langCountry

Vue.filter('product_url', function(value) {
  return '#/' + langCountry + '/product/' + value
})

Vue.filter('category_url', function(value) {
  let page = window.location.pathname.split('/')[2]
  return '#/' + langCountry + '/' + page + '/' + value
})

Vue.filter('site_url', function(value) {
  return '#/' + langCountry + '/' + value
})

Vue.filter('markdown', function(value) {
  return value
})

Vue.filter('t', function(value) {
  window.SITE_TRANSLATIONS = window.SITE_TRANSLATIONS || {}

  if (window.SITE_TRANSLATIONS[value]) {
    return window.SITE_TRANSLATIONS[value]
  }
  return value
})

Vue.filter('date', function (date, format) {
  if (typeof date === 'undefined') {
    return ''
  }

  var dateObj = new Date(date)

  if (format === 'date_only') {
    return dateObj.toLocaleDateString()
  }
  if (format === 'time_only') {
    return dateObj.toLocaleTimeString()
  }
  return dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString()
})

let vueElements = document.querySelectorAll('[data-vue]')

for (var i = 0; i < vueElements.length; i++) {
  vueElements[i].setAttribute('data-ivue', i);

  let component = vueElements[i].getAttribute('data-vue')
  let properties = vueElements[i].getAttribute('data-vue-props')
  vues[component].el = `[data-ivue="${i}"]`

  let vueInstance = new Vue(vues[component])

  if (properties) {
    properties = JSON.parse(properties)
    vueInstance.properties = properties
  }
}

export default {
  install: function(VueInstance, options) {
    window.SITE_LANG = 'en'
    window.SITE_COUNTRY = 'en'
    langCountry = window.SITE_LANG + '-' + window.SITE_COUNTRY

    VueInstance.prototype.$sbState = State

    VueInstance.component('sb-shop', Shop)
    VueInstance.component('sb-catalogue', Catalogue)
    VueInstance.component('sb-account', Account)
    VueInstance.component('sb-checkout-steps', CheckoutSteps)
    VueInstance.component('sb-filter-bar', FilterBar)
    VueInstance.component('sb-tree-item', TreeItem)
    VueInstance.component('sb-product-list', ProductList)
    VueInstance.component('sb-product', Product)
    VueInstance.component('sb-price', Price)
    VueInstance.component('sb-buy-button', BuyButton)
    VueInstance.component('sb-social-share', SocialShare)
    VueInstance.component('sb-wish-button', WishButton)
    VueInstance.component('sb-quantity-input', QuantityInput)
    VueInstance.component('sb-minicart', Minicart)
    VueInstance.component('sb-account-bar', AccountBar)
    VueInstance.component('sb-checkout', Checkout)
    VueInstance.component('sb-order-summary', OrderSummary)
    VueInstance.component('sb-cart-item', CartItem)
    VueInstance.component('sb-error-box', ErrorBox)
    VueInstance.component('sb-error-modal', ErrorModal)
    VueInstance.component('sb-register', Register)
    VueInstance.component('sb-profile', Profile)
    VueInstance.component('sb-loading', Loading)
    VueInstance.component('sb-password-reset', PasswordReset)

    State.token = options.token
  }
}
