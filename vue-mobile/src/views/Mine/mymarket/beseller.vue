<template>
    <div style="width: 100%;height: 100vh;background-color: #fafafa;">
        <mt-header title="成为商家" style="background-color:#f1f1f1;color: #222222;font-size: 1.2rem;height:4rem">
            <router-link to="/mine" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header>
        <div style="padding:1rem">
            <p>亲爱的用户：您好！</p>
            <p style="text-indent: 2em;line-height:1.5rem;">感谢您对我们平台的信任与支持，我们将以最大努力去做到最好，不断改善用户体验，争取做到大家都喜爱的农场品交易平台。同时由于我们平台刚开放的原因，我们会以极其优惠的选择去吸引更多
                商家来入驻我们平台。
            </p>
            <p style="text-indent: 2em;line-height:1.5rem;">想要成为商家，凡是成为我们平台移动端用户都可以无条件成为商家，只要你有优质的农产品、或者是想以低价卖出的产品，都可以在我们平台轻松上架，
                而上架的方式很简单，只需要在我们的电脑端登陆您现在登陆的账号和密码，便可以在电脑端轻松的管理你的商品。
            </p>
            <p style="text-align:right">{{format(times)}}</p>
            <p style="text-align:right">农商产品服务交易平台全体感谢</p>
        </div>
    </div>
</template>

<script>
import format from '../../../common/usualtime'
export default {
    data(){
        return{
            times:new Date(),
            format
        }
    }
}
</script>