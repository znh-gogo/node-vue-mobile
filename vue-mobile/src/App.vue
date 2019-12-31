<template>

  <div id="app">
    <transition name="slide" appear>
      <router-view></router-view>
    </transition>

  </div>

</template>


<style lang="scss">

#app {
  height: 100%;
  position: relative;
}
html,body{overflow-x:hidden;}
// #nav {
//   padding: 30px;
//   a {
//     font-weight: bold;
//     color: #2c3e50;
//     &.router-link-exact-active {
//       color: #42b983;
//     }
//   }
// }
    
.slide-enter-active, .slide-leave-active {
        transition: all 0.5s ease;
    }
    .slide-enter ,.slider-leave-to{
        // opacity: 0;
        transform: translateX(100%);
        
        // position: relative;
        // top:20px;
    }
    .slide-enter-to {
        opacity: 1; 
    }

    .slide-leave-active {
        // transition: all 0.8s ease;
        // opacity: 0;
        transform: translateX(-100%);
        position: absolute;
        top: 0;
    }

</style>
