import Vue from "vue";

export const state = Vue.observable({
  animating: false,
  expandingNode: null,
  transitionMode: '', // expand/collapse
});

export const mutations = {
  setAnimating(animating) {
    state.animating = animating;
  },
  setExpendingNode(node) {
    state.expandingNode = node;
  },
  setTransitionMode(transitionMode) {
    state.transitionMode = transitionMode
  }
};

export const actions = {}

export default {
  state,
  mutations,
  actions
}