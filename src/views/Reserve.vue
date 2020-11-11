<template>
  <div class="reserve">
    <h1>決済ページ</h1>
    <h2>{{status}}</h2>
  </div>
</template>

<script>
const liff = require('@line/liff')
export default {
  data () {
    return {
      status: ''
    }
  },
  created () {
    this.initializeLiff()
  },
  methods: {
    initializeLiff: function () {
      var me = this
      liff.init(
        {
          liffId: process.env.VUE_APP_LIFF_ID
        },
        data => {
          me.payAction()
        },
        err => {
          console.log('LIFF initialization failed', err)
          me.status = "初期化に失敗しました。"
        }
      )
    },
    payAction: function () {
      var me = this
      var params = new URLSearchParams()
      params.set('type', 'reserve')
      axios.post(process.env.VUE_APP_PAYPAY_FUNCTIONS_URL, params).then(response => 
      {
        if (response.status == 200) {
          // 決済ページへ遷移
          liff.openWindow({
            url: response.data.paymentUrl,
            external: false
          })
          liff.closeWindow()

        } else {
          me.status = "決済ページに移動できませんでした。。。"
        }
      })
    }
  }
}
</script>