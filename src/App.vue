<template>
  <v-app>
    <snackbar/>
    <v-content class="background">
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
const fb = require("./firebaseConfig.js");

import snackbar from "./components/snackbar";

export default {
  name: "App",
  components: { snackbar },

  data() {
    return {
      //
    };
  },

  mounted() {
    this.$store.commit("setLoading", true);

    fb.auth
      .signInAnonymously()
      .then(cred => {
        this.$store.commit("setCurrentUser", cred.user);
        // if (cred.additionalUserInfo.isNewUser) {
        //   fb.usersCollection
        //     .doc(cred.user.uid)
        //     .set({
        //       uid: cred.user.uid
        //     })
        //     .then(() => {
        //       this.$store.commit("setLoading", false);
        //     })
        //     .catch(err => {
        //       console.log(err);
        //       this.$store.commit("setLoading", false);
        //     });
        // } else {
        //   this.$store.commit("setLoading", false);
        // }
      })
      .catch(function(error) {
        console.log(error);
        this.$store.commit("setLoading", false);
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });

    fb.gifsCollection.onSnapshot(
      snapshot => {
        let listGifs = [];
        snapshot.forEach(gif => {
          listGifs.push(Object.assign({ uid: gif.id }, gif.data()));
        });

        listGifs = listGifs.filter(function(data) {
          return data.reported.length < 3;
        });
        // console.log(listGifs);
        listGifs.sort(function(a, b) {
          // console.log(a.upvotes.length - b.downvotes.length);
          return (
            b.upvotes.length -
            b.downvotes.length -
            (a.upvotes.length - a.downvotes.length)
          );
        });
        this.$store.commit("setGifs", listGifs);
        this.$store.commit("setLoading", false);
      },
      error => {
        console.log(error);
      }
    );
  }
};
</script>

<style>
/* 
.background{
 background-image: url("./assets/face.png");
 background-repeat: repeat;
 background-size: 25px 25px;
} */
</style>
