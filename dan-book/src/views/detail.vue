<template>
  <div class="chapter-detail">
    <template v-if="chapterDetail">
      <div class="title">{{ chapterDetail.name }}</div>
      <div class="content">
        <p
          v-for="(item, index) in passages"
          :key="index"
        >{{ item }}</p>
      </div>
    </template>
    <div class="touch-container">
      <div class="top" @click="() => handleClick(1)" />
      <div class="middle" @click="() => handleClick(2)" />
      <div class="bottom" @click="() => handleClick(3)" />
    </div>
    <van-popup
      v-model:show="showChapterList"
      position="left"
      style="width: 90%;height: 100%;overflow: hidden; display: flex; flex-direction: column;"
    >
      <div class="chapter-list__header">
        <van-icon
          name="arrow-left"
          class="icon"
          @click="() => showChapterList = false"
        />
      </div>
      <van-tabs v-model:active="chapterActiveTab" shrink>
        <van-tab title="章节">
          <div class="chapter-list">
            <div
              v-for="item in chapterList"
              :key="item.chapterId"
              class="chapter-item"
              @click="() => handleChapterItemClick(item.chapterId)"
            >
              <div class="left van-ellipsis">{{ item.name }}</div>
              <div class="right">{{ item.word_number }} 字</div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </van-popup>
  </div>
</template>

<script lang='ts' setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store/modules/store'
import axios from 'axios'

const route = useRoute()
const store = useStore()
const bookId = ref(0)

const chapterList = ref([])
const chapterDetail = ref()
const chapterActiveTab = ref(0)

const showChapterList = ref(false)
const passages = computed(() => {
  if (!chapterDetail.value) return []
  return chapterDetail.value.content.split('\n')
})

const getChapterList = async () => {
  try {
    const result = await axios.get('http://192.168.2.101:3000/book/chapter/list', {
      params: {
        bookId: bookId.value
      }
    })
    const { code, data } = result.data
    if (code === 200) {
      chapterList.value = data
    }
  } catch (e) {
    console.log(e)
  }
}
const getChapterDetail = async (chapterId) => {
  try {
    const result = await axios.get('http://192.168.2.101:3000/book/chapter/detail', {
      params: {
        bookId: bookId.value,
        chapterId
      }
    })
    const { code, data } = result.data
    if (code === 200) {
      chapterDetail.value = data
      // 更新最新阅读章节
      store.updateReadRecords({
        bookId: bookId.value,
        chapterId
      })
    }
  } catch (e) {
    console.log(e)
  }
}

const handleClick = (type) => {
  console.log(type)
  switch (type) {
    case 1: {
      break
    }
    case 2: {
      showChapterList.value = true
      break
    }
    case 3: {
      break
    }
  }
}
// 章节被点击
const handleChapterItemClick = (chapterId) => {
  // 获取章节详情
  getChapterDetail(chapterId)
  // 回到顶部
  scrollTo({
    top: 0,
    left: 0
  })
  // 隐藏章节边栏
  showChapterList.value = false
}

const init = async () => {
  const { bookId: id } = route.params
  if (!id) return
  bookId.value = id
  // 获取章节列表
  await getChapterList()
  // 章节列表为空
  if (!chapterList.value.length) return
  // 章节 ID
  const chapterId = store.records[bookId.value] || chapterList.value[0].chapterId
  getChapterDetail(chapterId)
}
init()

</script>

<style lang='scss' scoped>
.chapter-detail {
  min-height: 100vh;
  background-color: #e5d5ab;
  padding: 12px;
  position: relative;
  .title {
    font-size: 28px;
    margin: 12px 0;
    font-family: SmileySans;
  }
  .content {
    font-size: 18px;
    line-height: 28px;
    white-space: pre-line;
    font-family: SmileySans;
    p {
      margin: 12px 0;
      letter-spacing: 1px;
    }
  }
  .touch-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    .top, .middle, .bottom {
      flex: 1;
    }
  }
  .chapter-list__header {
    flex-shrink: 0;
    height: 48px;
    .icon {
      color: #333;
      font-size: 24px;
      padding: 0 8px;
    }
  }
  :deep(.van-tabs) {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .van-tabs__wrap {
      flex-shrink: 0;
      .van-tabs__nav {
        box-sizing: border-box;
      }
    }
    .van-tabs__content {
      flex: 1;
      overflow: auto;
    }
  }
  .chapter-list {
    .chapter-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
      padding: 12px;
      box-sizing: border-box;
      .left {
        flex: 1;
      }
      .right {
        flex-shrink: 0;
        color: #666;
        font-size: 12px;
        width: 64px;
        text-align: right;
      }
      &:not(:last-child) {
        border-bottom: 1px solid #eee;
      }
    }
  }
}
</style>
