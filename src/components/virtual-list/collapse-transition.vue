<template>
  <transition
    :name="name"
    appear
    @leave="handleLeave"
    @enter="handleEnter"
    @before-leave="handleBeforeLeave"
    @after-leave="handleAfterLeave"
    @after-enter="handleAfterEnter"
  >
    <slot></slot>
  </transition>
</template>
<script>
import Store from "../../store";

export default {
  name: 'CollapseTransition',
  props: {
    width: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: "",
    },
    motionHeight: {
      type: Number,
      default: 0,
    },
    // reverse: {
    //   type: Boolean
    // }
  },
  computed: {
    name() {
      return this.reverse
        ? "fade-in-height-collapse"
        : "fade-in-height-expand";
    },
    reverse() {
      return Store.state.transitionMode !== "expand";
    },
  },
  methods: {
    handleBeforeLeave(el) {
      if (this.width) {
        el.style.maxWidth = `${el.offsetWidth}px`;
      } else {
        el.style.maxHeight = "0";
        el.style.height = "0";
        el.style.overflow = "hidden";
      }
      void el.offsetWidth;
    },
    handleLeave(el) {
      if (this.width) {
        el.style.maxWidth = "0";
      } else {
        el.style.maxHeight = "0";
      }
    },
    handleAfterLeave(el) {
      if (this.width) {
        el.style.maxWidth = "";
      } else {
        el.style.maxHeight = "";
      }
      void el.offsetWidth;
    },
    handleEnter(el) {
      console.log(Store.state.animating);
      el.style.transition = "none";
      if (this.width) {
        const memorizedWidth = el.offsetWidth;
        el.style.maxWidth = "0";
        void el.offsetWidth;
        el.style.transition = "";
        el.style.maxWidth = `${memorizedWidth}px`;
      } else {
        if (this.reverse) {
          el.style.maxHeight = `${el.offsetHeight}px`;
          void el.offsetHeight;
          el.style.transition = "";
          el.style.maxHeight = "0";
        } else {
          const memorizedHeight = el.offsetHeight;
          el.style.maxHeight = "0";
          void el.offsetWidth;
          el.style.transition = "";
          el.style.maxHeight = `${memorizedHeight}px`;
        }
      }
    },
    handleAfterEnter(el) {
      if (this.width) {
        el.style.maxWidth = "";
      } else {
        if (!this.reverse) {
          el.style.maxHeight = "";
        }
      }
      Store.mutations.setAnimating(false);
    },
  },
};
</script>
<style lang="scss">
.fade-in-height {
  &-collapse {
    &-enter, &-leave-to {
      opacity: 1;
    }
    &-enter-to, &-leave {
      opacity: 0;
      margin-top: 0 !important;
      margin-bottom: 0 !important;
    }
    &-enter-active {
      overflow: hidden;
      transition: max-height 0.2s cubic-bezier(0.4, 0, 0.2, 1) 0s,
        opacity 0.2s cubic-bezier(0, 0, 0.2, 1) 0s,
        margin-top 0.2s cubic-bezier(0.4, 0, 0.2, 1) 0s,
        margin-bottom 0.2s cubic-bezier(0.4, 0, 0.2, 1) 0s,
        padding-top 0.2s cubic-bezier(0.4, 0, 0.2, 1) 0s,
        padding-bottom 0.2s cubic-bezier(0.4, 0, 0.2, 1) 0s;
    }
    &-leave-active {
      overflow: hidden;
      transition: max-height 0.2s cubic-bezier(0.4, 0, 0.2, 1),
        opacity 0.2s cubic-bezier(0.4, 0, 1, 1),
        margin-top 0.2s cubic-bezier(0.4, 0, 0.2, 1),
        margin-bottom 0.2s cubic-bezier(0.4, 0, 0.2, 1),
        padding-top 0.2s cubic-bezier(0.4, 0, 0.2, 1),
        padding-bottom 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }
  &-expand {
    &-leave, &-enter-to {
      opacity: 1;
    }
    &-leave-to, &-enter {
      opacity: 0;
      margin-top: 0 !important;
      margin-bottom: 0 !important;
    }
    &-leave-active {
      overflow: hidden;
      transition:
        max-height 0.2s cubic-bezier(.4, 0, .2, 1) 0s,
        opacity 0.2s cubic-bezier(0, 0, .2, 1) 0s,
        margin-top 0.2s cubic-bezier(.4, 0, .2, 1) 0s,
        margin-bottom 0.2s cubic-bezier(.4, 0, .2, 1) 0s,
        padding-top 0.2s cubic-bezier(.4, 0, .2, 1) 0s,
        padding-bottom 0.2s cubic-bezier(.4, 0, .2, 1) 0s
    }
    &-enter-active {
      overflow: hidden;
      transition:
        max-height 0.2s cubic-bezier(.4, 0, .2, 1),
        opacity 0.2s cubic-bezier(.4, 0, 1, 1),
        margin-top 0.2s cubic-bezier(.4, 0, .2, 1),
        margin-bottom 0.2s cubic-bezier(.4, 0, .2, 1),
        padding-top 0.2s cubic-bezier(.4, 0, .2, 1),
        padding-bottom 0.2s cubic-bezier(.4, 0, .2, 1)
    }
  }
}

</style>
