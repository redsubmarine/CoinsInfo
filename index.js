const express = require('express');
const request = require('request');
const mongodb = require('mongodb');

const app = express();

const Coin = {
    "BitCoin": 0,
    "BitCoinCash": 1,
    "Ethereum": 2,
    "Ripple": 3,
};

var coins = [
    {'name': '비트코인', 'price': '20000000', 'market_capitalization': '300조','updatedAt': Date()},
    {'name': '비트코인캐시', 'price': '4200000', 'market_capitalization': '65조','updatedAt': Date()},
]

app.get('/coins', (req, res) => {
    res.send(coins);
});

app.listen(3000, () => {
    console.log('Server start on port 3000!.');
    getAllInfo();
});

function getAllInfo() {
    getCoinInfo(Coin.BitCoin);
    getCoinInfo(Coin.BitCoinCash);
    getCoinInfo(Coin.Ethereum);
    getCoinInfo(Coin.Ripple);
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
    request.get({ url: apiURL + pair}, (error, response, body) => { 
        if (!error && response.statusCode == 200) { 
            console.log(body);
        }
    }); 
}
