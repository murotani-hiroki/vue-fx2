<template>
<div class="modal" v-show="modalVisible">
    <div><div class="label1">ID</div><span>{{trade.id}}</span></div>
    <div><div class="label1">取引日</div><input type="text" id="entryDate" v-model.lazy="trade.entryDate"></div>
    <div><div class="label1">決済日</div><input type="text" id="exitDate" v-model.lazy="trade.exitDate"></div>
    <div>
        <div class="label1">通貨ペア</div>
        <select id="pair" v-model="trade.pair">
            <option v-for="currency in currencies" :value="currency" v-bind:key="currency">{{currency}}</option>
        </select>
    </div>
    <div>
        <div class="label1">ask/bid</div>
        <input type="radio" id="type" value="ask" v-model="trade.type">ask
        <input type="radio" id="type" value="bid" v-model="trade.type">bid
    </div>
    <div><div class="label1">数量</div><input type="text" id="amount" v-model.lazy="trade.amount"></div>
    <div><div class="label1">Entry</div><input type="text" id="entry" v-model.lazy="trade.entry"></div>
    <div><div class="label1">Exit</div><input type="text" id="exit" v-model.lazy="trade.exit"></div>
    <div><div class="label1">S/L(pips)</div><input type="text" id="stoploss" v-model.lazy="trade.stoploss"></div>
    <div><div class="label1">損益</div><input type="text" id="profit" v-model.lazy="trade.profit"></div>
    <div><div class="label1">コメント</div><textarea cols=60 rows=10 id="comment" v-model.lazy="trade.comment"></textarea></div>
    <div>
        <div class="label1">画像</div><input type="text" id="img" v-model.lazy="imageFile"><button v-on:click="addImage">＋</button> 
        <span v-for="img in imageFiles" v-bind:key="img">
            <a v-bind:href="'upload/' + img" target="_blank">{{img}}</a>
            <a href="#" v-on:click="deleteImage(img)">×</a>
            &nbsp;&nbsp;
        </span>
    </div>
    <div style="margin-top: 10px"><button v-on:click="save">save</button></div>
</div>
</template>

<script>
export default {
    data: function() {
        return {
            modalVisible: false,
            trade: {},
            currencies: this.$store.state.currencies,
            imageFile: null,
            imageFiles: []
        }
    }, 
    methods: {
        modalOpen: function(trade) {
            this.trade = trade
            this.imageFile = null
            this.imageFiles = trade.imageFiles || []
            this.modalVisible = true
        },
        modalClose: function() {
            this.modalVisible = false
            this.$emit('modal-close')
        },
        save() {
            this.trade.imageFiles = this.imageFiles
            this.$store.commit('save', this.trade)
        },
        addImage() {
            this.imageFiles.push(this.imageFile)
        },
        deleteImage(imageFile) {
            this.imageFiles = this.imageFiles.filter(i => i !== imageFile)
        },
    },
}
</script>

<style scoped>
</style>
