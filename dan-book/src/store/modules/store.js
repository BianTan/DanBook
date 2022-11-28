import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useStore = defineStore({
  id: 'store',
  state: () => ({
    records: useStorage('read-records', {}, localStorage)
  }),
  actions: {
    updateReadRecords({ bookId, chapterId }) {
      this.records[bookId] = chapterId
    }
  }
})
