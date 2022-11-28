<template>
  <div class="home">
    <van-nav-bar title="DanBook" />
    <div class="book-list mode-2">
      <div
        v-for="item in bookList"
        :key="item.bookId"
        class="book-item"
        @click="() => handleItemClick(item.bookId)"
      >
        <img :src="item.cover" alt="cover" class="cover">
        <div class="detail">
          <div class="name">{{ item.name }}</div>
          <div class="author">{{ item.author }}</div>
          <div class="other">共章 {{ item.chapterCount }} 节</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const bookList = ref([])
const router = useRouter()

// 获取书籍列表
const getBookList = async () => {
  try {
    const result = await axios.get('http://192.168.2.101:3000/book/list')
    const { code, data } = result.data
    if (code === 200) {
      bookList.value = data
    }
  } catch (e) {
    console.log(e)
  }
}
// 书籍点击
const handleItemClick = (bookId) => {
  router.push({
    name: 'BookDetail',
    params: {
      bookId
    }
  })
}

getBookList()

</script>

<style lang='scss' scoped>
.home {
  min-height: 100vh;
  background-color: #F8F8F8;
  .book-list {
    display: flex;
    flex-wrap: wrap;
    .book-item {
      width: 33.33%;
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: white;
      .cover {
        width: 75px;
        height: 100px;
        margin: 6px 0;
      }
      .detail {
        flex: 1;
        color: #333;
        font-size: 16px;
        .other {
          font-size: 14px;
          color: #999;
        }
      }
    }
    &.mode-2 {
      flex-direction: column;
      padding: 4px 16px;
      box-sizing: border-box;
      .book-item {
        width: 100%;
        flex-direction: row;
        margin: 6px 0;
        padding: 12px 12px;
        box-sizing: border-box;
        border-radius: 8px;
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
        .cover {
          margin: 0;
          border-radius: 8px;
          object-fit: cover;
        }
        .detail {
          align-self: start;
          padding: 6px 12px;
          .author {
            color: #666;
            margin-top: 12px;
          }
          .other {
            margin-top: 4px;
          }
        }
      }
    }
  }
}
</style>
