
<template>
  <div :class="'my-class' + (1 + message.length % 2)">{{message}}</div>
</template>

<script>
  export default {
    props : {
      message : { default : function() { return 'DEFAULT-MESSAGE'; }  }
    },
    data() {
      return {
        message_: 'hello'
      }
    },
    created() {
      this.message_ = 'bye'
    }
  }
</script>
