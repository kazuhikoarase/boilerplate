
<template>
  <div>{{message}}</div>
</template>

<script>
  export default {
    data () {
      return {
        message: 'hello'
      }
    },
    created() {
      this.message = 'bye'
    }
  }
</script>
