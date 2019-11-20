<template>
    <div class="nav-tab" >

        <ContextMenu ref="ctxMenu">
            <ul class="nav-ctx-menu">
                <li @click="handleCloseOthers(ctxMenuItem)">关闭其他</li>
                <li @click="handleCloseAll">关闭所有</li>
            </ul>
        </ContextMenu>

        <div class="nav-btn" @click="handlePrev">
            <i class="icon ion-ios-arrow-back"></i>
        </div>

        <div class="nav-tab-item-list">


            <swiper ref="mySwiper" :options="swiperOption">

                <template v-for="tabItem in tabItems">

                    <swiper-slide v-if="tabItem === currentItem" class="nav-tab-item" v-bind:key="tabItem.id">

                        <div @contextmenu.prevent="handleCtxMenuOpen(tabItem,$event)">
                            <span class="nav-dot-inner nav-dot-inner-current"></span>
                            <span class="nav-tab-item-text">{{tabItem.name}}</span>
                        </div>

                    </swiper-slide>

                    <swiper-slide v-else class="nav-tab-item" v-bind:key="tabItem.id"
                    >
                        <div @contextmenu.prevent="handleCtxMenuOpen(tabItem,$event)" @click="handleChangeTab(tabItem)">
                            <span class="nav-dot-inner"></span>
                            <span class="nav-tab-item-text">{{tabItem.name}}</span>
                            <i class="icon ion-ios-close" @click.stop="handelCloseTab(tabItem)"></i>
                        </div>

                    </swiper-slide>


                </template>


            </swiper>

        </div>


        <div class="nav-btn forward-btn" @click="handleNext">
            <i class="icon ion-ios-arrow-forward"></i>
        </div>

        <div  class="nav-btn"  @mouseenter="handleCtxMenuOpen($event)"  >
            <i class="icon ion-ios-close-circle-outline"></i>
        </div>
    </div>
</template>

<script>
import ContextMenu from '../context-menu/ContextMenu';

    export default {
        name: "TabNav",
        components: {ContextMenu},
        props: {
            tabItems: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            currentItem: {
                type: Object,
                default: function () {
                    return null;
                }
            }
        },
        watch: {
            currentItem: function (c) {

                let vm = this;
                vm.swiper.updateSlides();
                vm.swiper.updateSize();

                vm.$nextTick(()=>{
                    vm.swiper.slideTo(this.tabItems.indexOf(c));
                })

            }
        },
        data() {
            return {
                swiperOption: {
                    slidesPerView: 'auto',
                    spaceBetween: 4,
                    slidesPerGroup : 5,
                    mousewheel: true,
                    free: true
                },
                ctxMenuItem:null,
            }
        },
        methods: {

            handleCtxMenuOpen(){

                if(arguments.length === 2){
                    this.ctxMenuItem = arguments[0];
                    this.$refs.ctxMenu.open(arguments[1]);
                }else{
                    this.ctxMenuItem = this.currentItem;
                    this.$refs.ctxMenu.open(arguments[0]);
                }


            },

            handlePrev() {
                this.swiper.slidePrev();
            },
            handleNext() {
                this.swiper.slideNext();
            },
            handleChangeTab(tabItem) {
                // console.log(tabItem)
                this.$emit('handleChangeTab', tabItem);
            },
            handelCloseTab(tabItem) {
                this.$emit('handelCloseTab', tabItem);
            },
            handleCloseOthers(tabItem) {
                this.$emit('handleCloseOthers', tabItem);
            },
            handleCloseAll() {
                this.$emit('handleCloseAll');
            }
        },
        computed: {
            swiper() {
                return this.$refs.mySwiper.swiper
            }
        },
        mounted() {
        }

    }
</script>

<style lang="scss" scoped>

    .swiper-slide {
        width: auto;
    }

    .swiper-slide:last-child{
         margin-right: 100px;
    }


    .nav-ctx-menu {
        padding: 0;
        list-style: none;
        background-color: #ffffff;
        font-size: 12px;
        line-height: 12px;
        text-align: left;
        color: #515a6e;
        li{
            border: 1px solid #dcdfe6;
            border-bottom: none;
            padding: 8px 20px;
            cursor: pointer;
        }

        li:last-child{
             border-bottom: 1px solid #dcdfe6;
        }

        li:hover{
            background-color: #dcdfe6;
        }

    }


    .nav-tab {

        .nav-tab-ctx-menu {

            .ctx-menu {
                width: 50px;

            }


        }

        height: 40px;
        background: #f0f0f0;
        border-top: 1px solid #f0f0f0;
        border-bottom: 1px solid #f0f0f0;

        .nav-tab-item-list {
            padding: 0 4px;
            width: calc(100% - 92px);
            overflow: hidden;
            height: 100%;
            display: inline-block;
            float: left;
            box-shadow: inset 0 0 3px 2px hsla(0, 0%, 39.2%, .1);
            position: relative;
        }

        .nav-tab-item {
            display: inline-block;
            min-width: 60px;
            margin-top: 2px;
            margin-bottom: 2px;
            /*margin-right: 4px;*/
            height: 32px;
            line-height: 32px;
            border: 1px solid #e8eaec;
            color: #515a6e;
            background: #fff;
            padding: 0 12px;
            border-radius: 3px;
            cursor: pointer;

            .ion-ios-close {
                display: inline-block;
                font-size: 14px;
                transform: scale(1.42857143) rotate(0deg);
                cursor: pointer;
                color: #666;
                opacity: .66;
                position: relative;
                margin-left: 12px;
                top: 1px;
            }

            .ion-ios-close:active {
                transform: scale(0.95);
            }

        }


        .nav-dot-inner {
            display: inline-block;
            width: 12px;
            height: 12px;
            margin-right: 8px;
            border-radius: 50%;
            background: #e8eaec;
            position: relative;
            top: 1px;
        }

        .nav-dot-inner-current {
            background-color: #242C37;
        }

        .nav-btn {
            display: inline-block;
            width: 28px;
            height: 100%;
            line-height: 100%;
            background-color: #ffffff;
            text-align: center;
            float: left;

            i {
                display: inline-block;
                font-size: 18px;
                margin-top: 11px;
                line-height: 1;
            }

            cursor: pointer;
        }

        .nav-tab-item-text {
            font-size: 12px;
            color: #515a6e;
        }

        .nav-btn:active {
            transform: scale(0.95);
        }

        .forward-btn {
            width: 27px;
            border-right: 1px solid #f0f0f0;
        }


    }

</style>