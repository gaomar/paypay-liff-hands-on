"use strict"
import { URLSearchParams } from 'url'
const { v4: uuidv4 } = require('uuid')
const pay_pay = require("../pay-pay/pay-pay")
const APP_HOST_NAME = `https://liff.line.me/${process.env.VUE_APP_LIFF_ID}`

const pay = new pay_pay();
exports.handler = async function(event) {
    const body = event.body
    let params = new URLSearchParams(body)
    const type = params.get('type')
  
    const headers = {
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Content-Type': 'application/json'
    }

    if (type === 'reserve') {
        // 決済予約
        let merchantId = uuidv4()

        let options = {
            merchantPaymentId: merchantId,
            amount: {
                amount: 10,         /* 決済金額 */
                currency: "JPY"
            },
            codeType: "ORDER_QR",
            orderDescription: "決済ハンズオン",
            isAuthorization: false,
            redirectUrl:  `${APP_HOST_NAME}?merchantId=${merchantId}`,
            redirectType: "APP_DEEP_LINK"
        };

        // 決済予約実行
        let ret = {
            statusCode: 200,
            body: "",
            headers: headers
        }
        await pay.reserve(options).then(function (response) {
            // 決済用ページ取得
            let reservation = options
            reservation.paymentUrl = response.data.url
            ret.body = JSON.stringify(reservation);
        }).catch(function (error){
            ret.statusCode = error
            ret.body = "決済失敗しました。。。"
        })

        return ret

    } else if (type === 'confirm') {
        // 決済処理
        let ret = { headers: headers };
        const merchantId = params.get('merchantId')
        await pay.confirm(merchantId).then((response) => {
            ret.statusCode = response
            ret.body = '決済完了しました！'
        }).catch(function (error) { 
            ret.statusCode = error
            ret.body = "決済失敗しました。。。"
        })

        return ret

    } else {
        return {
            statusCode: 400,
            body: 'APIエラー',
            headers: headers
        }
    }
}