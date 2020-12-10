<template>
<div id="app">
  <h1 class="title">じどりのFX</h1>
  <div class="margin-left10" style="display:flex">
      <input type="text" id="from" v-model.lazy="range.from"><span>〜</span><input type="text" v-model.lazy="range.to">
      <button id="search" v-on:click="load">search</button>
      <button v-on:click="modalOpenNew">add</button>
      <button v-on:click="deleteTrades">delete</button>
  </div>

  <div class="margin-left10" style="margin-top: 10px;">
  <span style="">損益合計</span>
  <span v-bind:class="{ minus : totalYen < 0 }">¥{{totalYen}}</span>
  <span v-bind:class="{ minus : totalDollar < 0 }">${{totalDollar}}</span>
  </div>

  <div id="trade-list-box">
  <table id="trade-list">
      <th></th>
      <th>取引日</th>
      <th>決済日</th>
      <th>通過ペア</th>
      <th>Ask/Bid</th>
      <th>数量</th>
      <th>Entry</th>
      <th>Exit</th>
      <th>S/L</th>
      <th>損益</th>
      <th><input type="checkbox" @click="selectAll"></th>
      <tr v-for="trade in trades" v-bind:key="trade.id">
          <td><a href="#" v-on:click="modalOpen($event)">{{ trade.id }}</a></td>
          <td>{{ trade.entryDate }}</td>
          <td>{{ trade.exitDate }}</td>
          <td>{{ trade.pair }}</td>
          <td>{{ trade.type }}</td>
          <td>{{ trade.amount }}</td>
          <td>{{ trade.entry }}</td>
          <td>{{ trade.exit }}</td>
          <td>{{ trade.stoploss }}</td>
          <td><span v-bind:class="{ minus : trade.profit < 0 }">{{ trade.profit }}</span></td>
          <td><input type="checkbox" v-bind:value="trade.id" v-model="selectedTrades"></td>
      </tr>
  </table>
  </div>


  <modal-window ref='modal' @modal-close="load"></modal-window>

</div>
</template>


<script>
import ModalWindow from './components/ModalWindow.vue'

export default {
    name: 'App',
    data: function() {
        return {
            range: {from: null, to: null},
            trades: [],
            selectedTrades: [],
            allSelected: false,
            tradeDefault: {
                amount: 10000
            }
        };
    },
    computed: {
        totalYen() {
            return this.trades.filter(trade => trade.pair.endsWith('JPY'))
                                .reduce((sum, i) => sum + parseInt(i.profit | 0), 0);
        },
        totalDollar() {
            const total = this.trades.filter(trade => trade.pair.endsWith('USD'))
                                .reduce((sum, i) => sum + parseFloat(isNaN(i.profit) ? 0 : i.profit), 0);
            return Math.round(total * 100) / 100;
        }
    },
    methods: {
        modalOpen: function(e) {
            const selectedTrade = this.trades.filter(trade => trade.id == e.target.text).pop();
            const copy = Object.assign({}, selectedTrade);
            this.$refs.modal.modalOpen(copy);
        },
        modalOpenNew: function() {
            const copy = Object.assign({}, this.tradeDefault);
            this.$refs.modal.modalOpen(copy);
        },
        deleteTrades() {
            this.$store.commit('deleteTrades', this.selectedTrades)
        },
        selectAll() {
            this.allSelected = !this.allSelected
            this.selectedTrades.splice(0)
            if (this.allSelected) {
                this.trades.forEach(trade => this.selectedTrades.push(trade.id))
            }
            console.log(this.selectedTrades)
            console.log(this.allSelected)
        },
        load() {
            //store.dispatch('load')
            //this.trades = store.state.trades
            this.search()
        },
        defaultRange() {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            this.range.from = this.yyyymmdd(startOfMonth);
            this.range.to = this.yyyymmdd(endOfMonth);
        },
        yyyymmdd(date) {
            return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
        },
        search() {
            const from = this.range.from || '00000000'
            const to = this.range.to || '99999999'
            this.trades = this.trades.filter(trade => trade.entryDate >= from && trade.entryDate <= to)
        }
    },
    components: {
        'modal-window': ModalWindow
    },
    created: function() {
        this.defaultRange()
        this.load()
    }
}
</script>

<style>
html, body {
    height: 100%;
}

body {
    margin: 0;
    padding: 0;
    min-width: 600px;
    min-height: 400px;
    background-color: aliceblue;
    height: 100%;
}

#main>.title {
    margin: 10px 10px;
}

.modal {
    padding: 10px;
    position: absolute;
    margin: -250px 0 0 -250px;
    top: 50%;
    left: 50%;
    min-width: 600px;
    min-height: 500px;
    border: 1px solid #000000;
    z-index: 10;
    background-color: aliceblue;
    
    /* うまくいかない 
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    */
}

.modal>div>textarea {
    margin-top: 3px;
}

.label1 {
    display: inline-block;
    width: 80px;
}

.overlay {
    top: 0px;
    height: 100%;
    width: 100%;
    position: fixed;
    background: rgba(0, 0, 0, 0.8);
/*    display: none; */
    z-index: 5;
}

#trade-list {
    border-collapse: collapse;
    background-color: white
}
#trade-list th, td {
    border: 1px solid #000000;
    padding: 10px;
}
#trade-list-box {
    margin: 10px auto;
    height: 80%;
    width: 65%;
    overflow: scroll;
}

.minus {
    color: red;
}

.margin-left10>* {
    margin-left: 10px;
}
</style>
