<template>
  <div>
    <div class="title primary--text">Your greatest pain</div>

    <v-dialog v-model="dialogReport" max-width="290">
      <v-card class="card-modal" v-if="reporting" color="primary">
        <v-card-title class="headline white--text">Report this pain?</v-card-title>
        <v-card-text
          class="white--text"
          style="margin-top:-15px"
        >You will not see anymore this pain on your list.</v-card-text>
        <v-card-actions class="mt-3">
          <v-spacer></v-spacer>
          <v-chip
            color="white"
            text-color="error"
            style="width:105px;text-align:center;margin-right:10px;margin-top:-20px"
            class="pointer"
            @click="report()"
          >
            <span class="pointer" style="text-align:center;width:80px; font-weight:bold">Report</span>
          </v-chip>
        </v-card-actions>
      </v-card>
      <v-card class="card-modal" v-else color="primary">
        <v-card-title class="headline white--text">This pain has just been reported</v-card-title>
        <v-card-text class="white--text" style="margin-top:-15px">
          Thank you for helping us keeping the content of
          <span
            class="white--text"
            style="font-weight:bold"
          >Your Greatest Pain</span> clean and relevant.
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- <v-btn style="position: fixed; z-index:1;right:15px" round @click="test()">TEST</v-btn> -->
    <div style="margin-top:100px"></div>
    <v-layout v-for="gif in gifs" :key="gif.uid">
      <v-flex xs12 sm6 offset-sm3 v-if="!hasBeenReported(gif)">
        <v-card class="mx-3 mt-3" style="min-height:184px">
          <div class="mr-5">
            <v-card-text
              class="display-1 pain"
              :class="{'primary--text': gif.userUid == currentUser.uid, 'secondary--text': gif.userUid != currentUser.uid }"
            >{{gif.url}}</v-card-text>
          </div>
          <v-card-actions style="position: absolute; right:0px; top: 0px">
            <v-spacer></v-spacer>
            <v-layout align-end justify-start column fill-height>
              <v-flex>
                <v-btn flat icon color="white">
                  <v-icon
                    :class="{ 'primary--text': containUserVote('upvotes', gif), 'secondary--text': !containUserVote('upvotes', gif) }"
                    class="shadow"

                    @click="toggleVote('upvotes', gif)"
                  >keyboard_arrow_up</v-icon>
                </v-btn>
              </v-flex>
              <v-flex
                class="text-xs-center secondary--text shadow"
                style="width:35px"
              >{{gif.upvotes.length-gif.downvotes.length}}</v-flex>
              <v-flex>
                <v-btn flat icon color="white">
                  <v-icon
                    class="shadow"
                    :class="{ 'primary--text': containUserVote('downvotes', gif), 'secondary--text': !containUserVote('downvotes', gif)}"
                    @click="toggleVote('downvotes', gif)"
                  >keyboard_arrow_down</v-icon>
                </v-btn>
              </v-flex>
              <v-flex>
                <v-btn flat icon color="white">
                  <v-icon
                    class="shadow"
                    small
                    color="secondary"
                    @click="dialogReport = true, currentGif = gif, reporting = true"
                  >report_problem</v-icon>
                </v-btn>
              </v-flex>
              <v-flex v-if="gif.userUid == currentUser.uid">
                <v-btn flat icon color="white">
                  <v-icon
                    class="shadow"
                    color="secondary"
                    small
                    @click="deleteGif(gif.uid)"
                  >delete</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <div style="margin-bottom:100px"></div>

    <v-btn color="primary" dark fab fixed bottom right>
      <v-icon>add</v-icon>
    </v-btn>

    <v-layout row justify-center>
      <v-btn color="primary" dark fab fixed bottom right @click="dialog = true">
        <v-icon>add</v-icon>
      </v-btn>

      <v-dialog v-model="dialog" max-width="290">
        <v-card color="primary">
          <v-card-title class="headline white--text">Add your greatest pain</v-card-title>

          <v-textarea
            v-model="urlGif"
            color="secondary"
            placeholder="Your greatest pain"
            solo
            :counter="limit"
            class="mx-3"
            :rules="rules"
            auto-grow
          ></v-textarea>

          <div class="ml-3 white--text">{{error}}</div>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="white" flat="flat" @click="dialog = false, urlGif = ''">cancel</v-btn>

            <v-btn
              :disabled="isGif()"
              color="white"
              flat="flat"
              @click="dialog = false, addGif()"
            >Add</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
const fb = require("../firebaseConfig.js");
import { mapState } from "vuex";

export default {
  data: () => ({
    limit: 150,
    dialog: false,
    urlGif: "",
    error: "",
    reporting: true,
    dialogReport: false,
    currentGif: {},
    rules: [v => v.length <= 150 || "Max 150 characters"]
  }),
  computed: {
    ...mapState(["user", "gifs", "currentUser"])
  },

  methods: {
    deleteGif(uid) {
      this.$store.dispatch("deleteGif", uid);
    },
    hasBeenReported(gif) {
      if (this.currentUser) {
        return gif["reported"].indexOf(this.currentUser.uid) > -1;
      } else {
        return false;
      }
    },
    report() {
      // this.gifs[this.currentGif.uid].reported.push(this.user.uid);
      fb.gifsCollection.doc(this.currentGif.uid).update({
        reported: fb.firestore.FieldValue.arrayUnion(this.currentUser.uid)
      });
      this.reporting = false;
    },
    isGif() {
      if (this.urlGif == "") {
        return true;
      } else if (this.urlGif.length > this.limit) {
        return true;
      } else {
        return false;
      }
    },
    toggleVote(vote, gif) {
      if (!this.currentUser) return;

      if (gif[vote] && gif[vote].indexOf(this.currentUser.uid) > -1) {
        // user has already vote
        gif[vote] = gif[vote].filter(e => e !== this.currentUser.uid);
        if (vote == "upvotes") {
          fb.gifsCollection.doc(gif.uid).update({
            upvotes: fb.firestore.FieldValue.arrayRemove(this.currentUser.uid)
          });
        } else {
          fb.gifsCollection.doc(gif.uid).update({
            downvotes: fb.firestore.FieldValue.arrayRemove(this.currentUser.uid)
          });
        }
      } else {
        // clear user's votes
        gif["upvotes"] = gif["upvotes"].filter(e => e !== this.currentUser.uid);
        gif["downvotes"] = gif["downvotes"].filter(
          e => e !== this.currentUser.uid
        );
        // add user's vote
        gif[vote]
          ? gif[vote].push(this.currentUser.uid)
          : (gif[vote] = [this.currentUser.uid]);

        if (vote == "upvotes") {
          fb.gifsCollection.doc(gif.uid).update({
            upvotes: fb.firestore.FieldValue.arrayUnion(this.currentUser.uid),
            downvotes: fb.firestore.FieldValue.arrayRemove(this.currentUser.uid)
          });
        } else {
          fb.gifsCollection.doc(gif.uid).update({
            downvotes: fb.firestore.FieldValue.arrayUnion(this.currentUser.uid),
            upvotes: fb.firestore.FieldValue.arrayRemove(this.currentUser.uid)
          });
        }
      }
    },
    containUserVote(vote, gif) {
      if (this.currentUser) {
        return gif[vote].indexOf(this.currentUser.uid) > -1;
      } else {
        return false;
      }
    },
    test() {
      this.$store.commit("setSnackbar", {
        color: "success",
        timeout: 3000,
        text: "Your greatest pain has been added"
      });
    },
    addGif() {
      if (!this.currentUser) return;
      let self = this;
      fb.gifsCollection
        .add({
          url: this.urlGif,
          upvotes: [this.currentUser.uid],
          downvotes: [],
          reported: [],
          userUid: this.currentUser.uid
        })
        .then(function() {
          self.$store.commit("setSnackbar", {
            color: "success",
            timeout: 3000,
            text: "Your greatest pain has been added"
          });
          self.urlGif = "";
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style>
.v-card {
  border-radius: 20px;
}
.shadow {
  /* text-shadow: 0px 2px 5px black; */
}
.title {
  position: fixed;
  z-index: 1;
  text-align: center;
  width: 80%;
  margin-right: 10%;
  margin-left: 10%;
  margin-top: 10px;
  text-shadow: 0px 2px 5px black;
  font-family: mainFont !important;
  font-size: 35px !important;
  top: 10px;
}

@font-face {
  font-family: mainFont;
  src: url("../assets/INFECTED.ttf");
}
</style>
