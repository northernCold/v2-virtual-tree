<template>
  <div
    ref="scrollbar"
    :class="[`${prefixCls}-scrollbar`, canScroll ? 'show' : '']"
    :style="{
      width: '8px',
      top: 0,
      bottom: 0,
      right: 0,
      position: 'absolute',
      display: mergedVisible ? null : 'none'
    }"
    @mousedown="onContainerMouseDown"
    @mousemove="delayHidden"
  >
    <div
      ref="thumb"
      :class="{
        [`${prefixCls}-scrollbar-thumb`]: true,
        [`${prefixCls}-scrollbar-thumb-moving`]: dragging,
      }"
      :style="{
        width: '100%',
        height: `${spinHeight}px`,
        top: `${top}px`,
        left: 0,
        position: 'absolute',
        background: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 99,
        cursor: 'pointer',
        userSelect: 'none',
      }"
      @mousedown="onMouseDown"
    >
    </div>
  </div>
</template>
<script>
import raf from "./utils/raf";

const MIN_SIZE  = 20;

function getPageY(e) {
  return 'touches' in e ? e.touches[0].pageY : e.pageY;
}

export default {
  props: {
    prefixCls: String,
    scrollTop: Number,
    scrollHeight: Number,
    height: {
      type: Number,
      default: 200
    },
    count: {
      type: Number,
      default: 10
    },
    onScroll: {
      type: Function,
      default: () => () => {}
    },
    onStartMove: {
      type: Function,
      default: () => () => {}
    },
    onStopMove: {
      type: Function,
      default: () => () => {}
    },
  },
  data() {
    return {
      dragging: false,
      pageY: null,
      startTop: null,
      visible: false
    }
  },
  computed: {
    spinHeight() {
      return this.getSpinHeight()
    },
    top() {
      return this.getTop()
    },
    canScroll() {
      return this.showScroll()
    },
    mergedVisible() {
      return this.canScroll && this.visible
    }
  },
  watch: {
    scrollTop(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.delayHidden();
      }
    }
  },
  mounted() {
    this.$refs.scrollbar.addEventListener('touchstart', this.onScrollbarTouchStart);
    this.$refs.thumb.addEventListener('touchstart', this.onMouseDown);
  },
  methods: {
    delayHidden() {
      clearTimeout(this.visibleTimeout);
      this.visible = true;
      this.visibleTimeout = setTimeout(() => {
        this.visible = false;
      }, 2000)
    },
    onScrollbarToucbStart(e) {
      e.preventDeault();
    },
    onContainerMouseDown(e) {
      e.stopPropagation();
      e.preventDeault();
    },
    patchEvents() {
      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('mouseup', this.onMouseUp);

      this.$refs.thumb.addEventListener('touchmove', this.onMouseMove);
      this.$refs.thumb.addEventListener('touched', this.onMouseUp);
    },
    removeEvents() {
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('mouseup', this.onMouseUp);

      this.$refs.scrollbar.removeEventListener('touchstart', this.onScrollbarToucbStart);
      this.$refs.thumb.removeEventListener('touchmove', this.onMouseMove);
      this.$refs.thumb.removeEventListener('touchend', this.onMouseUp);

      raf.cancel(this.moveRaf);
    },
    onMouseDown(e) {
      const { onStartMove } = this;
      this.dragging = true;
      this.pageY = getPageY(e);
      this.startTop = this.getTop();

      onStartMove();
      this.patchEvents();
      e.stopPropagation();
      e.preventDefault();
    },
    onMouseMove(e) {
      raf.cancel(this.moveRaf);

      if (this.dragging) {
        const offsetY = getPageY(e) - this.pageY;
        const newTop = this.startTop + offsetY;

        const enableScrollRange = this.getEnableScrollRange();
        const enableHeightRange = this.getEnableHeightRange();

        const ptg = enableHeightRange ? newTop / enableHeightRange : 0;
        const newScrollTop = Math.ceil(ptg * enableScrollRange);
        this.moveRaf = raf(() => {
          this.$emit("scroll", newScrollTop)
        })
      }
    },
    onMouseUp() {
      this.dragging = false;
      this.onStopMove();
      this.removeEvents();
    },
    getSpinHeight() {
      let baseHeight = (this.height / this.count) * 10;
      baseHeight = Math.max(baseHeight, MIN_SIZE);
      baseHeight = Math.min(baseHeight, this.height / 2);
      return Math.floor(baseHeight)
    },
    getEnableScrollRange() {
      return this.scrollHeight - this.height || 0;
    },
    getEnableHeightRange() {
      const spinHeight = this.getSpinHeight();
      return this.height - spinHeight || 0; 
    },
    getTop() {
      const enableScrollRange = this.getEnableScrollRange();
      const enableHeightRange = this.getEnableHeightRange();
      if (this.scrollTop === 0 || enableScrollRange === 0) {
        return 0;
      }
      const ptg = this.scrollTop / enableScrollRange;
      return ptg * enableHeightRange;
    },
    showScroll() {
      return this.scrollHeight > this.height
    }
  }
}
</script>