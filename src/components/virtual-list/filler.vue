<template>
  <div :style="outerStyle">
    <resize-observer @resize="handleResize">
      <div
        :style="innerStyle"
        :class="`${prefixCls}-holder-inner`">
        <slot></slot>
      </div>
    </resize-observer>
  </div>
</template>
<script>
import ResizeObserver from "../resize-observer";

export default {
  components: {
    ResizeObserver
  },
  props: {
    prefixCls: String,
    height: Number,
    offset: Number,
    onInnerResize: {
      type: Function,
      default: () => () => {}
    }
  },
  computed: {
    innerStyle() {
      let style = {
        display: 'flex',
        flexDirection: 'column'
      };
      if (this.offset !== undefined) {
        style = {
          ...style,
          transform: `translateY(${this.offset}px)`,
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0
        };
      }
      return style;
    },
    outerStyle() {
      let style = {};
      if (this.offset !== undefined) {
        style = {
          height: `${this.height}px`,
          position: 'relative',
          overflow: 'hidden'
        };
      }
      return style;
    }
  },
  methods: {
    handleResize({ offsetHeight }) {
      if (offsetHeight && this.onInnerResize) {
        this.onInnerResize();
      }
    }
  }
}
</script>