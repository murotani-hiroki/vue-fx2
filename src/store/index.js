import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      trades : [],
      currentId : 0,
      currencies: [
          'USD/JPY', 'EUR/JPY', 'GBP/JPY', 'AUD/JPY', 'NZD/JPY', 'CAD/JPY', 'ZAR/JPY', 'TRY/JPY', 'CHN/JPY', 'EUR/USD', 'GBP/USD', 'AUD/USD'
      ]
  },
  mutations: {
      // mutationの 第一引数： sate   第二引数： payload （ store.commitで指定した第二引数 )
      save(state, trade) {
          if (trade.id) {
              const i = state.trades.findIndex(e => e.id === trade.id)
              state.trades.splice(i, 1, trade)
          } else {
              trade.id = ++state.currentId
              state.trades.push(trade)
          }
          this.dispatch('save')
      },
      deleteTrades(state, deleteIds) {
          let notDeleted = state.trades.filter(trade => !deleteIds.includes(trade.id))
          state.trades.splice(0)
          notDeleted.forEach(trade => state.trades.push(trade))
          this.dispatch('save')
      },
      load(state, data) {
          state.trades.splice(0)
          data.trades.forEach(
              e => {
                  state.trades.push(e)
              }
          )
          if (state.trades.length) {
              state.currentId = data.currentId 
          }
      }
  },
  actions: {
      // actionsの引数: コンテキストオブジェクト（ state, getters, dispatchメソッド, commitメソッド ）
      save(ctx) {
          const data = {
              trades: ctx.state.trades,
              currentId: ctx.state.currentId
          }
          localStorage.setItem('mrtnfx-data', JSON.stringify(data))
      },
      load(ctx) {
          const json = localStorage.getItem('mrtnfx-data')
          const data = JSON.parse(json)
          ctx.commit('load', data)
      }
  },
  modules: {
  }
})
