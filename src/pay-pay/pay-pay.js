"use strict";
require("dotenv").config()
const PAYPAY = require('@paypayopa/paypayopa-sdk-node');

// PayPay API SDK の初期化
PAYPAY.Configure({
    clientId: process.env.VUE_APP_API_KEY,
    clientSecret: process.env.VUE_APP_API_SECRET,
    merchantId: process.env.VUE_APP_MERCHANTID,
    productionMode: false, 
});

/**
@class
*/

class PayPay {

    /**
     * 決済用QRコード発行
     * @param  options 決済情報
     */
    reserve(options){
        return new Promise(function(resolve, reject) {
            PAYPAY.QRCodeCreate(options, (response) => {
                if (response.STATUS == 201) {
                    let myBody = JSON.parse(response.BODY)
                    resolve(myBody)
                } else {
                    reject(response.STATUS)
                }
            });
    
        });
    }

    confirm(options){
        return new Promise(function(resolve, reject) {
            PAYPAY.GetPaymentDetails(Array(options), (response) => {
                if (response.STATUS == 200) {
                    resolve(response.STATUS)
                } else {
                    reject(response.STATUS)
                }
            });
    
        });
    }
}

module.exports = PayPay