<template>
  <div>
    <div>{{product.detail}}</div>
    <quill-editor ref="productEditor"
                  v-model="product.detail">
    </quill-editor>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
      product: {
        detail: undefined
      }
    }
  }
}
</script>

<style scoped>

</style>
