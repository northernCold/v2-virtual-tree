import ResizeObserver from 'resize-observer-polyfill';

export default {
  data() {
    return {
      size: {
        width: 0,
        height: 0,
        offsetHeight: 0,
        offsetWidth: 0,
      }
    }
  },
  mounted() {
    this.resizeObserver = new ResizeObserver(this.onResize);
    this.resizeObserver.observe(this.$refs.trigger);
  },
  methods: {
    onResize(entries) {
      const target = entries[0].target
  
      const { width, height } = target.getBoundingClientRect();
      const { offsetWidth, offsetHeight } = target;
  
      const fixedWidth = Math.floor(width);
      const fixedHeight = Math.floor(height);
  
      if (
        this.size.width !== fixedWidth ||
        this.size.height !== fixedHeight ||
        this.size.offsetWidth !== offsetWidth ||
        this.size.offsetHeight !== offsetHeight
      ) {
        const size = { width: fixedWidth, height: fixedHeight, offsetWidth, offsetHeight };
  
        this.size = size;
        Promise.resolve().then(() => {
          this.$emit(
            "resize",
            {
              ...size,
              offsetWidth,
              offsetHeight,
            },
            target
          )
        });
      }
    }
  },
  render() {
    const children = this.$slots.default;

    return (
      <div ref="trigger">
        { children }
      </div>
    )
  }
}
