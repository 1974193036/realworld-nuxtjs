import Vue from 'vue'
import dayjs from 'dayjs'

const formatDate = (value, format='YYYY-MM-DD HH:mm:ss') => {
  return dayjs(value).format(format)
}

Vue.filter('date', formatDate)