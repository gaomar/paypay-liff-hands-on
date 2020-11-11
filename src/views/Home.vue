<template>
  <v-container>
    <v-row class="mb-6">
      <v-col>
        <h2>ようこそ！ {{name}} さん</h2>
        <p v-if="pay_show">
          <a href="/pay/reserve"><img src="../assets/pay-btn.png" /></a>
        </p>
        <h3 v-if="pay_show">
          ↑↑↑ 決済はこちら ↑↑↑
        </h3>
      </v-col>
    </v-row>
    <v-row v-if="close_show">
      <v-col>
        <h2 class="mb-6">{{status}}</h2>
        <v-btn x-large color="success" @click="closeLIFF">閉じる</v-btn>
      </v-col>
    </v-row>
    <!-- Snackbar -->
    <div>
      <v-snackbar
        v-model="snackbarFlag"
        color="primary"
        multi-line
        :timeout="snackbarTimeout"
        top
      >
        {{ snackbarText }}
      </v-snackbar>
    </div>
  </v-container>
</template>

<script>
const liff = require('@line/liff')
export default {
  data () {
    return {
      snackbarFlag: false,
      snackbarTimeout: 3000,
      snackbarText: '',
      name: '',
      status: '',
      pay_show: false,
      close_show: false
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
          me.loginCheck()
        },
        err => {
          console.log('LIFF initialization failed', err)
        }
      )
    },
    loginCheck: function () {
      var me = this
      // ログインチェック
      if (liff.isLoggedIn()) {
        // プロフィール取得
        liff.getProfile()
          .then(profile => {
            me.name = profile.displayName
            if (this.$route.query.merchantId) {
              // 決済完了チェック
              me.confirmAction()
            } else {
              me.pay_show = true
            }
          })
          .catch((err) => {
            console.log('error', err)
          })
      }
    },
    confirmAction: function () {
      this.close_show = true
      var me = this
      var params = new URLSearchParams()
      params.set('type', 'confirm')
      params.set('merchantId', this.$route.query.merchantId)
      axios.post(process.env.VUE_APP_PAYPAY_FUNCTIONS_URL, params)
        .then(response => {
            this.status = response.data
            me.showSnackbar(response.data)
        })
    },
    closeLIFF: function () {
      liff.closeWindow()
    },
    showSnackbar(text) {
      this.snackbarFlag = true
      this.snackbarText = text
      setTimeout(()=> {
          this.snackbarFlag = false
          this.snackbarText = ''
        },
        this.snackbarTimeout
      )
    }
  }
}
</script>