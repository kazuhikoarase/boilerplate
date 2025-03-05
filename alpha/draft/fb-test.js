/*
export const firebaseConfig = {
  databaseURL: "https://****-****.firebaseio.com/",
};
*/
import { firebaseConfig } from './fb-test-config.js';

import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js';
import { getDatabase, ref, push, set, update, remove, onValue } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js';

console.log('conf', aa);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

const listRef = ref(database, 'posts');



//const itemRef = get(listRef);

/*
const listRef = ref(database,'posts');
const itemRef = push(listRef);
set(itemRef, {
  time : +new Date(),
  val : 'e',
});
*/

createApp({
  data : function() {
    return {
      val : 'z',
      list : [],
    };
  },
  methods : {
    testClick : function(event) {
      console.log('test!');
      const itemRef = push(listRef);
      set(itemRef, {
        time : +new Date(),
        val : 'e',
      });
    },
    removeClick : function(key) {
      var updates = {};
      updates['posts/' + key] = null;
      update(ref(database), updates);
    },
  },
  mounted : function() {
    var _this = this;
    onValue(listRef, (snapshot) => {
      var list = [];
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childVal = childSnapshot.val();
        list.push({key : childKey, val : childVal });
      });
      _this.list = list;
    });
  },
}).mount('#app');
