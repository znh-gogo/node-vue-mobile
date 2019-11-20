<template>
    <div ref="ctx" v-show="show" class="context-menu"  @mouseover="show=true" @mouseout="show=false">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "ContextMenu",
        data(){
          return {show:false}
        },
        methods:{
            open(e){
                 let vm = this;
                 this.show = true;
                 this.$refs.ctx.style.top = (e.clientY - 10) + "px";

                 if((document.body.clientWidth - e.clientX) > 30){
                     this.$refs.ctx.style.right = '';
                     this.$refs.ctx.style.left = e.clientX + "px";
                 }else{
                     this.$refs.ctx.style.left = '';
                     this.$refs.ctx.style.right =  (document.body.clientWidth - e.clientX)  + "px";

                 }


                 window.addEventListener('click',function () {
                     vm.show = false;
                 })
            },
            close(){
                this.show = false;
            }
        }
    }
</script>

<style lang="scss" scoped>

    .context-menu{
        position: fixed;
        z-index: 9999999999;
        overflow: hidden
    }


</style>