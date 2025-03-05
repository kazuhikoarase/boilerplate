/*
export const firebaseConfig = {
  databaseURL: "https://****-****.firebaseio.com/",
};
*/
import { firebaseConfig } from './fb-test-config.js';

import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js';
import { getDatabase, ref, push, set, update, remove, onValue }
    from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

createApp({
  data : function() {
    return {
      val : '',
      list : [],
    };
  },
  methods : {
    appendClick : function(event) {
      const itemRef = push(ref(database, 'posts') );
      set(itemRef, {
        time : +new Date(),
        txval : this.val,
      });
    },
    valChange : function(event, item) {
      item.val.txval = event.target.value;
      const updates = {};
      updates['posts/' + item.key] = item.val;
      update(ref(database), updates);
    },
    removeClick : function(key) {
      /*
      const updates = {};
      updates['posts/' + key] = null;
      update(ref(database), updates);
      */
      remove(ref(database, 'posts/' + key) );
    },
  },
  mounted : function() {
    const _this = this;
    onValue(ref(database, 'posts'), (snapshot) => {
      const list = [];
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childVal = childSnapshot.val();
        list.push({ key : childKey, val : childVal });
      });
      _this.list = list;
    });
  },
}).mount('#app');
