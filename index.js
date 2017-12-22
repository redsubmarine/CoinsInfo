// import { setTimeout } from 'timers';

const express = require('express');
const request = require('request');
const MongoClient = require('mongodb').MongoClient;

const mongoUrl = `mongodb://localhost:27017/coins`
MongoClient.connect(mongoUrl, (err, db) => {
    const col = db.collection('currency_data')
    if (err) {
        console.log(err)
        return
    }
    const app = express();

    const Coin = {
        "BitCoin": "BitCoin",
        "BitCoinCash": "BitCoinCash",
        "Ethereum": "Ethereum",
        "Ripple": "Ripple",
    };

    app.get('/coins', (req, res) => {
        col.find({ updatedAt: { $gte: Date.now() - (1000 * 60 * 60 * 24) } }, { "_id": false, "name": true, "price": true, "updatedAt": true }).toArray().then(rows => {
            // rows.forEach(row => console.log('', row))
            res.json(rows);
        })
    });

    app.listen(3000, () => {
        console.log('Server start on port 3000!.');
        getAllInfo();
        // setInterval(getAllInfo, 1000);
    });

    async function getAllInfo() {
        try {
            await Promise.all([
                getCoinInfo(Coin.BitCoin),
                getCoinInfo(Coin.BitCoinCash),
                getCoinInfo(Coin.Ethereum),
                getCoinInfo(Coin.Ripple),
            ])
            console.log('', 'Done')
            setTimeout(getAllInfo, 1000)
        } catch (ex) {
            console.error('Error: ', ex);
            setTimeout(getAllInfo, 10000);
        }
    }

    function getCoinInfo(coin) {
        const apiURL = "https://api.korbit.co.kr/v1/ticker";
        var pair = "";
        switch (coin) {
            case Coin.BitCoin: {
                pair = "?currency_pair=btc_krw";
                break;
            }
            case Coin.BitCoinCash: {
                pair = "?currency_pair=bch_krw";
                break;
            }
            case Coin.Ethereum: {
                pair = "?currency_pair=etc_krw";
                break;
            }
            case Coin.Ripple: {
                pair = "?currency_pair=xrp_krw";
                break;
            }
        }
        return new Promise((resolve, reject) => {

            request.get({ url: apiURL + pair }, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    body = JSON.parse(body)
                    // console.log(body);

                    const insObj = {
                        name: coin,
                        price: body.last,
                        updatedAt: body.timestamp,
                    }
                    col.insert(insObj)//.then(r => console.log(r)).catch(e => console.log("error:", e))
                        .then(() => resolve())
                } else {
                    // console.log("currency api error: " + error)
                    console.log("status ", response.statusCode)
                    reject('ERROR')
                }
            });
        })
    }

})