let ws = new WebSocket("wss://api.upbit.com/websocket/v1");
const coinList = [
  "BTC-ADA",
  "BTC-ADX",
  "BTC-ARDR",
  "BTC-ATOM",
  "BTC-BAT",
  "BTC-BCH",
  "BTC-BSV",
  "BTC-BTS",
  "BTC-BTT",
  "BTC-CTXC",
  "BTC-CVC",
  "BTC-DCR",
  "BTC-DOGE",
  "BTC-ELF",
  "BTC-ENG",
  "BTC-EOS",
  "BTC-ETC",
  "BTC-ETH",
  "BTC-GNT",
  "BTC-GRS",
  "BTC-IOST",
  "BTC-KMD",
  "BTC-LOOM",
  "BTC-LSK",
  "BTC-LTC",
  "BTC-MANA",
  "BTC-MCO",
  "BTC-MTL",
  "BTC-NCASH",
  "BTC-NKN",
  "BTC-NPXS",
  "BTC-OMG",
  "BTC-OST",
  "BTC-POLY",
  "BTC-POWR",
  "BTC-QTUM",
  "BTC-RCN",
  "BTC-SC",
  "BTC-SNT",
  "BTC-STEEM",
  "BTC-STORJ",
  "BTC-TRX",
  "BTC-VET",
  "BTC-WAVES",
  "BTC-XEM",
  "BTC-XLM",
  "BTC-XRP",
  "BTC-XVG",
  "BTC-XZC",
  "BTC-ZEN",
  "BTC-ZIL",
  "BTC-ZRX"
];
function onMessage(e) {
  //console.log(evt.data);
  let enc = new TextDecoder("utf-8");
  let arr = new Uint8Array(e.data);
  console.log(JSON.parse(enc.decode(arr)));
}
function doSend(message) {
  ws.send(message);
}
function onError(e) {
  console.log(e.data);
}
function onClose(e) {
  console.log("diconnedtedddd");
}
const init = () => {
  ws.binaryType = "arraybuffer";
  ws.onopen = function(e) {
    console.log("conected");
    let msg = [
      {
        ticket: "TTTW"
      },
      {
        type: "ticker",
        codes: [...coinList]
      }
    ];
    msg = JSON.stringify(msg);
    doSend(msg);
  };
  ws.onmessage = function(e) {
    onMessage(e);
  };
  ws.onerror = function(e) {
    onError(e);
  };
  ws.onclose = function(e) {
    onClose(e);
  };
};
init();
