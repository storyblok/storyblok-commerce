<template>
  <div class="sb-filter-bar">
    <div v-if="term" class="sb-filter-bar__term">
      <div class="sb-filter-bar__headline">{{ 'search' | t }}</div>
      <div>
        {{ 'searching_for' | t }} <strong>"{{ term }}"</strong>
        <div class="sb-filter-bar__reset">
          <a @click="resetTerm">{{ 'reset' | t}}</a>
        </div>
      </div>
    </div>
    <div class="sb-filter-bar__headline">{{ 'categories' | t }}</div>
    <div class="sb-filter-bar__reset" v-if="rootSelected">
      <router-link :to="{name: 'SbShop', params: {locale: $sbState.locale, view: 'catalogue', id: 'all'}}">
        {{ 'all' | t }}
      </router-link>
      <router-link :key="category.id" v-for="category in parentCats"
        :to="{name: 'SbShop', params: {locale: $sbState.locale, view: 'catalogue', id: category.slug}}">
        {{ category.name }}
      </router-link>
    </div>

    <ul class="sb-filter-bar__list">
      <li>
        <div v-if="rootSelected" class="sb-tree-item--sub">
          <sb-tree-item @selected="setSelection" :key="activeCategory.item.id" :model="activeCategory" v-if="activeCategory.item.id"></sb-tree-item>
          <div class="sb-tree-item__list">
            <sb-tree-item @selected="setSelection" :key="model.item.id" v-for="model in activeCategory.children" :model="model"></sb-tree-item>
          </div>
        </div>
        <div v-else class="sb-tree-item--root">
          <sb-tree-item @selected="setSelection" :key="model.item.id" v-for="model in categories" :model="model"></sb-tree-item>
        </div>
      </li>
    </ul>

    <div :key="model.item.id" v-for="model in properties">
      <div v-if="model.item.name != 'Size'">
        <div class="sb-filter-bar__headline">{{ model.item.name }}</div>
        <div v-if="selection['properties.id'][model.item.id]">
          <a class="sb-filter-bar__reset" @click="unselect('properties.id', model.item.id)">{{ 'reset' | t}}</a>
        </div>
        <div class="sb-filter-bar__box">
          <ul class="sb-filter-bar__list">
            <li :key="property.item.id" v-for="property in model.children">
              <label>
                <input class="sb-form__checkbox" :data-prop-id="model.item.id" type="checkbox" @change="setSelection('properties.id', model.item.id, property.item.id)">
                <span class="sb-form__checkbox-label">{{ property.item.name }}</span> ({{ property.item.doc_count }})
              </label>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import api from '../libs/api'
import each from '../libs/each'
import State from './State'

export default {
  data() {
    return {
      selection: {
        'properties.id': {},
        'categories.id': {}
      },
      categories: [],
      properties: [],
      activeCategory: {item: {}, children: []},
      flattenCategories: {},
      searchTerm: '',
      propCountLoaded: false
    }
  },

  props: ['res', 'term'],

  computed: {
    parentCats() {
      let categories = []
      let addParent = (parentId) => {
        if (parentId > 0) {
          let category = this.flattenCategories[parentId]
          categories.push(category)
          addParent(category.parent_id)
        }
      }

      if (typeof this.activeCategory.item.parent_id !== 'undefined' &&
        this.activeCategory.item.parent_id != 0) {
        addParent(this.activeCategory.item.parent_id)
      }

      return categories.reverse()
    },

    rootSelected() {
      return typeof this.selection['categories.id']['0'] !== 'undefined'
    }
  },

  methods: {
    doFilter() {
      this.$emit('filter-changed', this.selection)
    },

    unselect(key, parent) {
      if (key == 'categories.id') {
        this.$delete(this.selection[key], parent)
      } else {
        this.$delete(this.selection[key], parent)

        var checkboxes = this.$el.querySelectorAll('[data-prop-id="' + parent + '"]');

        for (var index = 0, max = checkboxes.length; index < max; index++) {
          var checkbox = checkboxes[index]
          checkbox.checked = false
        }

        this.searchTerm = ''
      }
    },

    getCategories() {
      api().get('/categories', {params: {per_page: 500}})
        .then((res) => {
          this.categories = this.formatCategories(res.data, 0)
          State.categoryList = res.data
          State.resolve('catsLoaded')
        })
        .catch((error) => {
          console.log(error)
        })

      api().get('/properties')
        .then((res) => {
          this.properties = this.formatCategories(res.data)
          State.resolve('propsLoaded')
        })
        .catch((error) => {
          console.log(error)
        })
    },

    setActiveCategoryById(id, items) {
      items.forEach((item) => {
        if (item.item.id === parseInt(id)) {
          this.activeCategory = item
          this.setCategoryToState(item.item)
        } else {
          this.setActiveCategoryById(id, item.children)
        }
      })
    },

    setSelection(key, parent, value) {
      if (key == 'categories.id') {
        this.selection[key][parent] = [value]
        this.selection[key] = Object.assign({}, this.selection[key])
        this.setActiveCategoryById(value, this.categories)
        return
      }

      if (this.selection[key][parent]) {
        let index = this.selection[key][parent].indexOf(value)
        if (index > -1) {
          this.selection[key][parent].splice(index)

          if (this.selection[key][parent].length == 0) {
            delete this.selection[key][parent]
          }
        } else {
          this.selection[key][parent].push(value)
        }
      } else {
        this.selection[key][parent] = [value]
        this.selection[key] = Object.assign({}, this.selection[key])
      }
    },

    formatCategories(cats, rootId) {
      let tree = {}

      cats.forEach((cat) => {
        cat.doc_count = 0
        if (typeof rootId === 'undefined') {
          cat.type = 'properties.id'
        } else {
          cat.type = 'categories.id'
        }
        this.flattenCategories[cat.id] = cat

        if (!tree[cat.parent_id]) {
          tree[cat.parent_id] = []
        }

        tree[cat.parent_id].push(cat)
      })


      return this.generateTree(rootId || 0, tree)
    },

    generateTree(parent, items) {
      let tree = {}

      if (items[parent]) {
        let result = items[parent]

        result.forEach((cat) => {
          if (!tree[cat.id]) {
            tree[cat.id] = {item: {}, children: []}
          }
          tree[cat.id].item = cat
          tree[cat.id].children = this.generateTree(cat.id, items)
        })
      }

      return Object.keys(tree).map(e => tree[e])
    },

    addDocCount(type) {
      each(this.flattenCategories, (v, k) => {
        if (v.type === type) {
          let bucket = this.res.aggregations[type].buckets.filter((cat) => {
            return parseInt(k) === parseInt(cat.key)
          })
          if (bucket.length) {
            this.flattenCategories[k].doc_count = bucket[0].doc_count
          } else {
            this.flattenCategories[k].doc_count = 0
          }
        }
      })
    },

    setCategoryToState(category) {
      State.category = category
    },

    resetTerm() {
      this.$emit('reset-term')
    },

    handleCategorySelection() {
      State.waitUntil('catsLoaded')
        .then(() => {
          let list = State.categoryList.filter((category) => {
            return category.slug == this.$route.params.id
          })

          if (list.length > 0) {
            State.rootId = list[0].id
            this.setSelection('categories.id', '0', list[0].id)
          } else {
            this.unselect('categories.id', '0')
            State.rootId = null
          }
        })
    }
  },

  watch: {
    selection: {
      handler: function() {
        this.doFilter()
      },
      deep: true
    },

    '$route.params.id'() {
      this.handleCategorySelection()
    },

    parentCats: function(val) {
      State.categories = JSON.parse(JSON.stringify(val))
      if (State.category.id != this.activeCategory.item.id && this.activeCategory.item.parent_id != 0) {
        State.categories.push(this.activeCategory.item)
      }
    },

    res: function() {
      State.waitUntil('catsLoaded').then(() => {
        this.addDocCount('categories.id')
      })

      State.waitUntil('propsLoaded').then(() => {
        if (!this.propCountLoaded) {
          this.addDocCount('properties.id')
          this.propCountLoaded = true
        }
      })
    }
  },

  created() {
    this.getCategories('properties.id')
    this.handleCategorySelection()
  }
}
</script>
