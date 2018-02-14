<template>
  <div class="sb-catalogue">
    <div class="sb-grid">
      <div class="sb-width-2-3@s">
        <div class="sb-flex sb-flex-middle sb-catalogue__sort-bar">
          <div class="sb-catalogue__count" v-if="res && !loading">
            {{res.total}} {{ 'products_found' | t }}
          </div>
          <div class="sb-catalogue__sort">
            <select v-model="sortBy" class="sb-form__select">
              <option value="default">{{ 'sort_by_relevance' | t }}</option>
              <option value="sales_asc">{{ 'sort_by_bestseller' | t }}</option>
              <option value="price_asc">{{ 'sort_by_price_asc' | t }}</option>
              <option value="price_desc">{{ 'sort_by_price_desc' | t }}</option>
            </select>
          </div>
        </div>

        <sb-product-list :products="res.products" v-if="!loading"></sb-product-list>
        <div v-if="loading || loadingMore">
          <div class="sb-grid sb-grid-medium">
            <div v-for="placeholder in ['1', '2', '3']" class="uk-width-1-2 uk-width-1-3@m">
              <div class="uk-position-relative uk-clearfix">
                <figure class="sb-product-list__item-image">
                  <canvas></canvas>
                </figure>
                <div class="sb-product-list__item-data">
                  <h3 class="sb-product-list__item-name"><span class="holder holder--100"></span></h3>
                  <h4 class="sb-product-list__item-price">
                    <span class="holder"></span>
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <infinite-scroll :handler="nextPage" :should-handle="!loadingMore && !loading">
        </infinite-scroll>

      </div>

      <div class="uk-width-1-3@s sb-catalogue__filter">
        <sb-filter-bar @reset-term="resetTerm" :term="term" :res="aggregations" @filter-changed="doFilter" class="catalogue__filter"></sb-filter-bar>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import State from './State'
import FilterBar from './FilterBar'
import ProductList from './ProductList'
import api from '../libs/api'
import each from '../libs/each'
import param from '../libs/param'
import InfiniteScroll from 'vue-mugen-scroll'

let termParam = param('term')
let oldQuery = null
const sorting = {
  default: '_score',
  sales_asc: {sales: 'desc'},
  price_asc: {realprice: 'asc'},
  price_desc: {realprice: 'desc'}
}

export default {
  data() {
    return {
      page: 0,
      term: '',
      sortBy: 'default',
      res: {
        total: 0,
        products: []
      },
      perPage: 24,
      aggregations: null,
      selection: {
        'properties.id': {},
        'categories.id': {}
      },
      open: false,
      loading: true,
      loadingMore: false
    }
  },

  computed: {
    sorting: function() {
      return sorting[this.sortBy]
    }
  },

  created() {
    oldQuery = null
    this.term = termParam
    this.doFilter()
  },

  watch: {
    sortBy() {
      this.doFilter()
    }
  },

  methods: {
    nextPage() {
      if (this.res && this.res.total > (this.page + 1) * this.perPage) {
        this.page = this.page + 1
        this.loadingMore = true

        api().post('/searches', {search: this.buildQuery()})
          .then((res) => {
            res.data.products.forEach((item) => {
              this.res.products.push(item)
            })
            this.loadingMore = false
          })
          .catch((error) => {
            console.log(error)
          })
      }
    },

    doFilter(selection) {
      if (typeof selection !== 'undefined') {
        this.selection = selection
      }

      this.page = 0
      this.loading = true

      api().post('/searches', {search: this.buildQuery()})
        .then((res) => {
          this.res.total = res.data.total
          this.res.products = res.data.products
          this.loading = false
        })
        .catch((error) => {
          console.log(error)
        })

      let aggQuery = this.buildAggQuery()
      let aggQueryString = JSON.stringify(aggQuery)

      if (oldQuery != aggQueryString) {
        api().post('/searches', {search: aggQuery})
          .then((res) => {
            this.aggregations = res.data
            oldQuery = aggQueryString
          })
          .catch((error) => {
            console.log(error)
          })
      }
    },

    buildAggQuery() {
      let query = {
        size: 0,
        query: {
          bool: {
            must: this.mustFilters(),
            filter: this.buildFilters({byCategory: false})
          }
        },
        aggs: {
          'categories.id': {
            terms: {
              field: 'categories.id',
              size: 1000
            }
          },
          'properties.id': {
            terms: {
              field: 'properties.id',
              size: 1000
            }
          },
          maxPrice: {
            max: {field: 'realprice'}
          },
          minPrice: {
            min: {field: 'realprice'}
          }
        }
      }

      return query
    },

    buildFilters(options) {
      let filters = []

      each(this.selection, (item, key) => {
        each(item, (filterItem) => {
          let term = {terms: {}}

          if (options.byCategory || key != 'categories.id') {
            term.terms[key] = filterItem
            filters.push(term)
          }
        })
      })

      let enabledFilter = {term: {enabled: true}}
      filters.push(enabledFilter)

      return filters
    },

    mustFilters() {
      let must = []

      if (this.term.length > 0) {
        must.push({
          multi_match: {
            query: this.term,
            fields: ['name^4', 'sku^3', 'excerpt', 'description', 'categories.name^2', 'properties.name^1'],
            type: 'phrase_prefix'
          }
        })
      }

      return must
    },

    buildQuery() {
      let query = {
        _source: false,
        from: this.page * this.perPage,
        size: this.perPage,
        query: {
          bool: {
            must: this.mustFilters(),
            filter: this.buildFilters({byCategory: true})
          }
        },
        sort: this.sorting
      }

      return query
    },

    resetTerm() {
      this.term = ''
      this.doFilter()
    }
  },

  components: {
    'infinite-scroll': InfiniteScroll
  }
}
</script>
