import Vue from 'vue'
import App from './App.vue'
import './elem';
import { eBridge } from './lib/ethBridge';
import { nBridge } from './lib/nearBridge';


Vue.config.productionTip = false

Vue.prototype.$eBridge = eBridge;
Vue.prototype.$nBridge = nBridge;

new Vue({
  render: h => h(App),
}).$mount('#app')
