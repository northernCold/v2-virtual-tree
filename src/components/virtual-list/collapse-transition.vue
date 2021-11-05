<template>
  <transition
    :css="false"
    appear
    @before-enter="beforeEnter"
    @enter="enter"
  >
    <slot></slot>
  </transition>
</template>
<script>
import Store from "../../store";
import Velocity from 'velocity-animate';

export default {
  props: {
    mode: {
      type: String,
      default: ''
    },
    motionHeight: {
      type: Number,
      default: 0
    }
  },
  methods: {
    customAfterAppearHook() {
    },
    beforeEnter(el) {
      if (!el.dataset) el.dataset = {};

      el.dataset.oldPaddingTop = el.style.paddingTop;
      el.dataset.oldPaddingBottom = el.style.paddingBottom;
      if (this.mode === 'expand') {
        el.style.height = '0';
        el.style.paddingTop = 0;
        el.style.paddingBottom = 0;
      }
      if (this.mode === 'collapse') {
        el.style.height = `${this.motionHeight}px` ;
        el.style.overflow = 'hidden';
      }
    },

    enter(el, done) {
      var delay = el.dataset.index * 150
      if (this.mode === 'expand') {
        el.style.overflow = 'hidden';
        setTimeout(function () {
          Velocity(
            el,
            { opacity: 1, height:  el.scrollHeight + 'px' },
            { complete: () => {
              done();
              Store.mutations.setAnimating(false);
            } }
          )
        }, delay)
      }
      if (this.mode === 'collapse') {
        setTimeout(function () {
          Velocity(
            el,
            { height: 0 },
            { complete: () => {
              done();
              Store.mutations.setAnimating(false);
            } }
          )
        }, delay)
      }
    }
  }
};
</script>
<style lang="scss">
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>