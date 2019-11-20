<template>
    <div ref="container" class="scroller">
        <slot></slot>
    </div>
</template>

<script>
    import PerfectScrollbar from 'perfect-scrollbar';
    import 'perfect-scrollbar/css/perfect-scrollbar.css';
    export default {
        name: "Scrollbar",
        watch:{

        },
        props:{
            options:{
                type:Object,
                default:function () {
                    return {} ;
                }
            },
            padding:{
                type:String,
                default:function () {
                    return '0 0 0 0';
                }
            }
        },
        data () {
            return {
                ps:'',
            }
        },
        computed: {},
        methods: {
            resetScrollbar(){
                console.log('resetScrollbar');
                this.$refs.container.scrollTop = 0;
            }
        },
        mounted: function () {
            this.$refs.container.style.padding = this.padding;
            this.$refs.container.style.width = `calc(100% - ${this.$refs.container.style.paddingLeft} - ${this.$refs.container.style.paddingRight} )`;
            this.$refs.container.style.height = `calc(100% - ${this.$refs.container.style.paddingBottom} - ${this.$refs.container.style.paddingTop} )`;
            this.ps = new PerfectScrollbar(this.$refs.container);

        }
    }
</script>

<style lang="scss" scoped>

    .scroller{
        overflow: hidden;
        height: 100%;
        width:100%;
        position: relative;
        // background: #f1f1f1;
    }

</style>