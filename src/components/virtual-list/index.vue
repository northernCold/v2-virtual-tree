
<script>
import CollapseTransition from './collapse-transition.vue';
import CacheMap from "./utils/CacheMap";
import Scrollbar from "./Scrollbar.vue";
import Filler from './filler.vue';
import isFF from './utils/isFirfox';
import raf from "./utils/raf";
import Store from "../../store";
import { flatten } from "../tree/model/tree-store";

const heights = new CacheMap();

function flattenInCollapse (nodes) {
  const list = [];
  for (let node of nodes) {
    list.push(node);
    if (node.expanded) {
      list.push(...flattenInCollapse(node.childNodes));
    }
  }
  return list;
}

export default {
  components: {
    Scrollbar,
    Filler,
    CollapseTransition,
  },
  props: {
    wrapperStyle: {
      type: Object,
      default: () => ({})
    },
    height: Number,
    itemHeight: Number,
    virtual: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: () => []
    },
    fullHeight: {
      type: Boolean,
      default: true
    },
    itemKey: String
  },
  mounted() {
    this.visibleCalclation();
    this.$refs.component.addEventListener('wheel', this.onWheel);
  },
  computed: {
    expandingNode() {
      return Store.state.expandingNode;
    },
    animating() {
      return Store.state.animating;
    },
    useVirtual() {
      return !!(this.virtual !== false && this.height && this.itemHeight)
    },
    inVirtual() {
      return this.useVirtual && this.data && this.itemHeight * this.data.length > this.height;
    },
    componentStyle() {
      let style;
      if (this.height) {
        style = {
          [this.fullHeight ? 'height' : 'maxHeight']: `${this.height}px`,
          overflowY: 'auto',
          overflowAnchor: 'none',
        }
        if (!!(this.virtual !== false && this.height && this.itemHeight)) {
          style.overflow = 'hidden'
          if (this.scrollMoving) {
            style.pointerEvents = 'none';
          }
        }
      }
      return style
    },
    maxScrollHeight() {
      return this.scrollHeight - this.height
    }
  },
  data() {
    return {
      motionNodes: [],
      scrolling: false,
      scrollTop: 0,
      scrollMoving: false,
      scrollHeight: 0,
      start: 0,
      end: 0,
      offset: 0,
    }
  },
  watch: {
    data() {
      this.visibleCalclation();
    },
    scrollTop() {
      this.visibleCalclation();
    },
    height() {
      this.visibleCalclation();
    },
    useVirtual() {
      this.visibleCalclation();
    }
  },
  methods: {
    visibleCalclation() {
      if (!(this.virtual !== false && this.height && this.itemHeight)) {
        return {
          scrollHeight: undefined,
          start: 0,
          end: this.data.length - 1,
          offset: undefined
        }
      }

      let itemTop = 0;
      let startIndex, startOffset, endIndex;
      const dataLen = this.data.length;
      for (let i = 0; i < dataLen; i++) {
        const item = this.data[i];
        const key = this.getKey(item);
        const cacheHeight = heights.get(key);
        const currentItemBottom = itemTop + (cacheHeight === undefined ? this.itemHeight : cacheHeight);

        if (currentItemBottom >= this.scrollTop && startIndex === undefined) {
          startIndex = i;
          startOffset = itemTop;
        }

        if (currentItemBottom > this.scrollTop + this.height && endIndex === undefined) {
          endIndex = i;
        }

        itemTop = currentItemBottom
      }
      if (startIndex === undefined) {
        startIndex = 0;
        startOffset = 0;
      }
      if (endIndex === undefined) {
        endIndex = this.data.length - 1;
      }

      // Give cache to improve scroll experience
      endIndex = Math.min(endIndex + 1, this.data.length);

      this.scrollHeight = itemTop;
      this.start = startIndex;
      this.end = endIndex;
      this.offset = startOffset;
    },
    getNodesHeight(nodes = []) {
      let height = 0;
      for (let node of nodes) {
        const key = this.getKey(node.data);
        const cacheHeight = heights.get(key);
        height += cacheHeight === undefined ? this.itemHeight : cacheHeight;
      }
      return height;
    },
    getKey(item) {
      if (typeof this.itemKey === 'object') return item;
      if (typeof this.itemKey === 'function') {
        return this.itemKey(item);
      }
      return item[this.itemKey];
    },
    collectHeight() {
      this.$refs.items.forEach((element, key) => {
        if (element && element.offsetParent) {
          const { offsetHeight } = element;
          if (heights.get(key) !== offsetHeight) {
            heights.set(key, element.offsetHeight);
          }
        }
      })
    },
    keepInRange(newScrollTop) {
      let newTop = newScrollTop;
      if (!Number.isNaN(this.maxScrollHeight)) {
        newTop = Math.min(newTop, this.maxScrollHeight);
      }
      newTop = Math.max(newTop, 0);
      return newTop;
    },
    syncScrollTop(newTop) {
      const origin = this.scrollTop;
      let value;
      if (typeof newTop === 'function') {
        value = newTop(origin);
      } else {
        value = newTop;
      }
      const alignedTop = this.keepInRange(value);
      this.$refs.component.scrollTop = alignedTop;
      this.scrollTop = alignedTop;
    },
    onScrollbar(newScrollTop) {
      const newTop = newScrollTop;
      this.syncScrollTop(newTop);
    },
    onFallbackScroll(e) {
      const { scrollTop: newScrollTop } = e.currentTarget;
      if (newScrollTop !== this.scrollTop) {
        this.syncScrollTop(newScrollTop);
      }
      this.$emit("scroll", e);
    },
    onWheel(event) {
      Store.mutations.setAnimating(false);
      let nextFrame;
      let isMouseScorll = false;
      const onWheelDelta = (offsetY) => {
        this.syncScrollTop((top) => {
          const newTop = top + offsetY;
          return newTop;
        });
      }
      if (!this.inVirtual) return;
      raf.cancel(nextFrame);
      const { deltaY } = event;
      let offset = 0;
      offset += deltaY;

      if (!isFF) {
        event.preventDefault();
      }

      nextFrame = raf(() => {
        const patchMultiple = isMouseScorll ? 10 : 1;
        onWheelDelta(offset * patchMultiple);
        offset = 0;
      })
    }
  },
  render() {
    const { $scopedSlots: { default: defaultSlot } } = this;
    const createNode = () => {
      const len = this.end - this.start;
      const motionNodeIdx = this.data.findIndex(v => v === Store.state.expandingNode);
      const restLen = motionNodeIdx > -1 ? len - (motionNodeIdx - this.start + 1) : this.data;
      let nextIdx = 0;
      let vnodes = [];
      let motionNodes = [];
      let motionVNodes = [];
      if (motionNodeIdx > -1 && Store.state.animating) {
        // 展开/收起动画
        nextIdx = motionNodeIdx + 1;
        // 点击展开/收起节点的前半部分节点
        vnodes = this.data.slice(this.start, nextIdx).map(item => (
          <div ref="items" class="virtual-list-item" key={this.getKey(item)}>
            { defaultSlot({ child: item }) }
          </div>
        ))
        motionNodes =  Store.state.transitionMode === 'expand' ?
          flatten(this.data[motionNodeIdx].childNodes) :
          flattenInCollapse(this.data[motionNodeIdx].childNodes)
        let motionHeight = this.getNodesHeight(motionNodes)
        let motionNodesLen;
        // 过渡节点
        motionVNodes = motionNodes.slice(0, restLen).map(item =>
          <div ref="items" class="virtual-list-item" key={this.getKey(item)}>
            { defaultSlot({ child: item }) }
          </div>
        );
       
        motionNodesLen = motionVNodes.length;
        nextIdx += motionNodesLen;
        vnodes.push(<collapse-transition mode={Store.state.transitionMode} motion-height={motionHeight}><div>{motionVNodes}</div></collapse-transition>)
        // 点击展开/收起节点的前半部分节点
        // 收起时包含过渡节点
        vnodes.push(
          ...this.data
            .slice(
              Store.state.transitionMode === 'collapse'
                ? nextIdx - motionNodesLen
                : nextIdx,
               Store.state.transitionMode === 'collapse'
                ? this.end
                : this.end + motionNodesLen
              )
            .map(item => 
              <div ref="items" class="virtual-list-item" key={this.getKey(item)}>
              { defaultSlot({ child: item }) }
            </div>
          )
        )
      } else {
        // 滚动列表数据更新
        vnodes = this.data.slice(this.start, this.end).map(item =>
          <div ref="items" class="virtual-list-item" key={this.getKey(item)}>
            { defaultSlot({ child: item }) }
          </div>
        )
      }
      return {
        vnodes: vnodes,
        motionHeight: motionHeight
      }
    }
    const { vnodes, motionHeight = 0 } = createNode();
    let scrollHeight = this.scrollHeight + motionHeight
    return (
      <div
        style={{
          ...this.wrapperStyle,
          position: 'relative'
        }}
        class="virtual-list"
      >
          <div
            ref="component"
            class="virtual-list-holder"
            style={{...this.componentStyle}}
            onScroll={this.onFallbackScroll}>
            <filler
              ref="filler"
              prefixCls="virtual-list"
              height={scrollHeight}
              max-height={this.height}
              offset={this.offset}
              onInnerResize={this.collectHeight}
            >
            { vnodes }
            </filler>
          </div>
          {
            this.useVirtual && <scrollbar
            scrollTop={this.scrollTop}
            height={this.height}
            scrollHeight={scrollHeight}
            count={this.data.length}
            onScroll={this.onScrollbar}
            onStartMove={() => this.scrollMoving = true}
            onStopMove={() => this.scrollMoving = false}></scrollbar>
          }
        </div>
    )
  }
}
</script>