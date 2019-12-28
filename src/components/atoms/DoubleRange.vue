<template>
  <div class="doubleRange">
    {{test1}}
    <div ref="ruler" class="ruler">
      <div class="thumb" @click="activeThumb = 1" @mousemove="thumbMinMove" @mousedown="thumbMinMD" @mouseup="thumbMinMU" :style="{left: ((minThumb - lowest) * 100 / range) + '%', backgroundColor: activeThumb == 1 ? 'red' : '#000b'}">{{minThumb}}</div>
      <div class="thumb" @click="activeThumb = 2" :style="{left: ((maxThumb - lowest) * 100 / range) + '%', backgroundColor: activeThumb == 2 ? 'red' : '#000b'}">{{maxThumb}}</div>
    </div>
    <div class="scalebar">
      <div class="valueLabel">{{lowest}}</div>
      <div class="valueLabel">{{highest}}</div>
    </div>
  </div>
</template>

<script>
//панелька справа с выбором фильтрации
export default {
  name: 'DoubleRange',
  props: {
    lowest: {type: Number, default: 150},
    highest: {type: Number, default: 550}
  },
  data: ()=>{return {
    minThumb: 155,
    maxThumb: 339,
    mousedownMin: false,
    test1: -1,
    activeThumb: 0
  }},
  computed: {
    range: function() {
      return this.highest - this.lowest
    },
  },
  created: function() {
    if (this.minThumb >= this.maxThumb) this.maxThumb = this.minThumb + 1
    if (this.lowest > this.minThumb) this.minThumb = this.lowest
    if (this.lowest > this.maxThumb) this.maxThumb = this.lowest + 100
    if (this.highest < this.minThumb) this.minThumb = this.highest
    if (this.highest < this.maxThumb) this.maxThumb = this.highest
  },
  methods: {
    piece: function() {
      return this.$refs.ruler.offsetWidth / this.range
    },
    thumbMinMD: function(e) {
      this.mousedownMin = true
    },
    thumbMinMU: function(e) {
      this.mousedownMin = false
    },
    thumbMinMove: function(e) {
      if (this.mousedownMin = true) {
        
      }
    }
  },
  watch: {
    lowest: function() {
      if (this.minThumb >= this.maxThumb) this.maxThumb = this.minThumb + 1
      if (this.lowest > this.minThumb) this.minThumb = this.lowest
      if (this.lowest > this.maxThumb) this.maxThumb = this.lowest + (this.range / 2)  
    },
    highest: function() {
      if (this.highest < this.minThumb) this.minThumb = this.highest
      if (this.highest < this.maxThumb) this.maxThumb = this.highest
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.doubleRange
  width 100%
  --thumbHeight 25px
  .ruler
    height 3px
    background-color #ccc
    box-shadow 0 0 3px 2px #aaa
    border-radius 25px
    box-sizing border-box
    margin 18px 10px
    position relative
  .scalebar
    display flex
    justify-content space-between
  .thumb
    margin-top -12px
    height var(--thumbHeight)
    min-width var(--thumbHeight)
    max-width var(--thumbHeight)
    line-height var(--thumbHeight)
    border-radius 100%
    background-color #000b
    box-shadow 0 0 3px 0px #999
    cursor pointer
    position absolute
    color white
    font-size 9px
    &:hover
      box-shadow 0 0 3px 1px white
  *
    margin 0
  .line
    display flex
    justify-content space-between
  .alignRight
      align-self flex-end
</style>
