<template>
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{{ article.title }}</h1>

        <!-- <div class="article-meta">
          <a href=""><img :src="article.author.image" /></a>
          <div class="info">
            <a href="" class="author">{{ article.author.username }}</a>
            <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
          </div>
          <button class="btn btn-sm btn-outline-secondary">
            <i class="ion-plus-round"></i>
            &nbsp; Follow Eric Simons <span class="counter">(10)</span>
          </button>
          &nbsp;&nbsp;
          <button class="btn btn-sm btn-outline-primary">
            <i class="ion-heart"></i>
            &nbsp; Favorite Post <span class="counter">(29)</span>
          </button>
        </div> -->
        <article-meta :article="article" />
      </div>
    </div>

    <div class="container page">
      <div class="row article-content">
        <div class="col-md-12" v-html="article.body">
          <!-- <p>
            Web development technologies have evolved at an incredible clip over
            the past few years.
          </p>
          <h2 id="introducing-ionic">Introducing RealWorld.</h2>
          <p>It's a great solution for learning how other frameworks work.</p> -->
        </div>
      </div>

      <hr />

      <div class="article-actions">
        <!-- <div class="article-meta">
          <a href="profile.html"
            ><img src="http://i.imgur.com/Qr71crq.jpg"
          /></a>
          <div class="info">
            <a href="" class="author">Eric Simons</a>
            <span class="date">January 20th</span>
          </div>

          <button class="btn btn-sm btn-outline-secondary">
            <i class="ion-plus-round"></i>
            &nbsp; Follow Eric Simons <span class="counter">(10)</span>
          </button>
          &nbsp;
          <button class="btn btn-sm btn-outline-primary">
            <i class="ion-heart"></i>
            &nbsp; Favorite Post <span class="counter">(29)</span>
          </button>
        </div> -->
        <article-meta :article="article" />
      </div>

      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <article-comment v-if="user" :article="article" />
          <article-unlogin v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getArticle } from '@/api/article.js'
import MarkdownIt from 'markdown-it'
import ArticleMeta from './components/article-meta'
import ArticleComment from './components/article-comment'
import ArticleUnlogin from './components/article-unlogin'

export default {
  name: 'articleIndex',
  components: {
    ArticleMeta,
    ArticleComment,
    ArticleUnlogin
  },
  // 针对SEO，配置网页title，meta
  // head方法可以通过`this`关键字来获取组件的数据
  // 注意：为了避免子组件中的 meta 标签不能正确覆盖父组件中相同的标签而产生重复的现象，建议利用 hid 键为 meta 标签配一个唯一的标识编号 
  head() {
    return {
      title: `${this.article.title} - RealWorld`,
      meta: [
        {
          hid: 'articleDetail',
          name: 'description',
          content: this.article.description
        }
      ]
    }
  },
  computed: {
    ...mapState(['user'])
  },
  async asyncData(context) {
    // console.log(context.params.slug)
    const { data } = await getArticle(context.params.slug)
    const { article } = data

    const md = new MarkdownIt()
    article.body = md.render(article.body) // 转化markdown为HTML

    // console.log(article)

    return {
      article: article
    }
  }
}
</script>

<style scoped>
</style>