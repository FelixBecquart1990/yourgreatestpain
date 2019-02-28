import Vue from 'vue'
import Vuex from 'vuex'
const fb = require('./firebaseConfig.js')

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loaging: false,
    user: null,
    gifs: [],
    snackbar: { active: false, color: "", mode: "", timeout: 0, text: "" },
    currentUser: {},
  },
  mutations: {
    setUser(state, val) {
      state.user = val
    },
    setCurrentUser(state, val) {
      state.currentUser = val
    },
    setLoading(state, val) {
      state.loading = val
    },
    setGifs(state, val) {
      state.gifs = val
    },
    setSnackbar(state, val) {
      state.snackbar = Object.assign({}, val, { active: true })
  }},
  actions: {
    deleteGif({ state, commit }, payload) {
      commit("setLoading", true)
      fb.gifsCollection.doc(payload).delete().then(function () {
        commit("setSnackbar", {
          color: "success",
          timeout: 3000,
          text: "Your pain has been deleted"
        });
        // let lessons = state.lessons.filter(lesson => lesson.uid != payload.uid);
        // commit('setLessons', lessons)
        commit("setLoading", false)
      }).catch(function (error) {
        console.log(error)
        commit("setLoading", false)
      });
    },
  }
})
