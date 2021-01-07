<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="user" class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'your_feed'
                  }"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'your_feed'
                    }
                  }"
                >
                  Your Feed
                </nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'global_feed'
                  }"
                  exact
                  :to="{
                    name: 'home'
                  }"
                >
                  Global Feed
                </nuxt-link>
              </li>
              <li v-if="tag" class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'tag'
                  }"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'tag',
                      tag: tag
                    }
                  }"
                >
                  # {{ tag }}
                </nuxt-link>
              </li>
            </ul>
          </div>

          <div
            class="article-preview"
            v-for="item in articles"
            :key="item.slug"
          >
            <div class="article-meta">
              <nuxt-link
                :to="{
                  name: 'profile',
                  params: {
                    username: item.author.username,
                  },
                }"
              >
                <img :src="item.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link
                  class="author"
                  :to="{
                    name: 'profile',
                    params: {
                      username: item.author.username,
                    },
                  }"
                >
                  {{ item.author.username }}
                </nuxt-link>
                <span class="date">{{ item.createdAt | date('MMM DD, YYYY') }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{
                  active: item.favorited,
                }"
                :disabled="item.isDisabled"
                @click="onFavorite(item)"
              >
                <i class="ion-heart"></i> {{ item.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              class="preview-link"
              :to="{
                name: 'article',
                params: {
                  slug: item.slug,
                },
              }"
            >
              <h1>{{ item.title }}</h1>
              <p>{{ item.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>

          <nav>
            <ul class="pagination">
              <li
                class="page-item"
                :class="{ active: item == page }"
                v-for="item in totalPage"
                :key="item"
              >
                <!-- <a class="page-link" :href="'/?page=' + item">{{ item }}</a> -->
                <nuxt-link
                  class="page-link"
                  :to="{
                    name: 'home',
                    query: {
                      page: item,
                      tag: tag,
                      tab: tab
                    },
                  }"
                >
                  {{ item }}
                </nuxt-link>
              </li>
            </ul>
          </nav>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link
                class="tag-pill tag-default"
                :to="{
                  name: 'home',
                  query: {
                    tag: item,
                    tab: 'tag'
                  },
                }"
                v-for="item in tags"
                :key="item"
              >
                {{ item }}
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticles, getYourFeedArticles, addFavorite, delFavorite } from '@/api/article.js'
import { getTags } from '@/api/tag.js'
import { mapState } from 'vuex'

export default {
  name: 'HomeIndex',

  /**
   * 服务端渲染期间 和 客户端路由更新之前 都会调用这个方法
   * 当你想要动态页面内容有利于 SEO 或者是提升首屏渲染速度的时候，就在 asyncData 中发请求拿数据
   */
  async asyncData(context) {
    // console.log(context.query)
    // console.log(context.params)
    const page = parseInt(context.query.page || 1)
    const limit = 20
    const tag = context.query.tag
    const tab = context.query.tab || 'global_feed'
    // const { data } = await getArticles({
    //   limit: limit,
    //   offset: (page - 1) * limit
    // })
    // console.log(data) // {articles:: [], articlesCount:: 500}
    // 这里返回的数据会和 data() {} 中的数据合并到一起给页面使用
    // 类似 data() { return { articles: [], articlesCount: 500 } }

    // const { data: tagData } = await getTags() // 对象解构取别名
    const loadArticles = tab === 'global_feed' 
      ? getArticles
      : getYourFeedArticles
    const [articleRes, tagRes] = await Promise.all([
      loadArticles({
        limit: limit,
        offset: (page - 1) * limit,
        tag: tag
      }),
      getTags()
    ])

    const { articles, articlesCount } = articleRes.data
    const { tags } = tagRes.data

    articles.forEach(item => {
      item.isDisabled = false
    })

    return {
      articles: articles, // 文章列表
      articlesCount: articlesCount, // 文章总数
      page, // 页码
      limit, // 每页大小
      tags: tags, // 标签列表
      tab: tab, // 选项卡
      tag: tag // 数据标签
    }
  },

  /**
   * 使用watchQuery属性可以监听参数字符串的更改
   * 如果定义的字符串发生变化，将调用所有组件方法(asyncData, fetch, validate, layout, ...)
   */
  watchQuery: ['page', 'tag', 'tab'],

  computed: {
    ...mapState(['user']),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit)
    }
  },

  /**
   * 如果是非异步数据或普通数据，则正常的初始化到 data 中
   */
  data() {
    return {
      title: '首页'
    }
  },
  methods: {
    async onFavorite(item) {
      item.isDisabled = true
      if (item.favorited) {
        // 取消点赞
        await delFavorite(item.slug)
        item.favorited = false
        item.favoritesCount += -1
      } else {
        // 添加点赞
        await addFavorite(item.slug)
        item.favorited = true
        item.favoritesCount += 1
      }
      item.isDisabled = false
    }
  }
}
</script>

<style scoped>
</style>