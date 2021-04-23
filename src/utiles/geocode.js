// 📍 Section 3-36 : Callback Abstraction

// encodeURIComponent(String args) & decodeURIComponent(String args): 轉換 URL，避免剖析失敗。會處理#字元為%23，空白字元轉換為%20，中文字處理為UTF-8
const request = require("postman-request");

const geocode = (address, callback) => {
  const url =
    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
    encodeURIComponent(address) +
    ".json?access_token=pk.eyJ1IjoiY2hvdWNoZW5hbiIsImEiOiJja244anh1NmYweXAyMm5xbjJkem1oOW8xIn0.UkxdSHxTNnYjgWtTciO1sw&limit=1";

  // 其他寫法
  // const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1IjoiY2hvdWNoZW5hbiIsImEiOiJja244anh1NmYweXAyMm5xbjJkem1oOW8xIn0.UkxdSHxTNnYjgWtTciO1sw&limit=1`;

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to location services!", undefined);
    } else if (body.features.length === 0) {
      callback("Unable to find location! Try another search.", undefined);
    } else {
      callback(undefined, {
        latitude: body.features[0].center[1],
        longitude: body.features[0].center[0],
        location: body.features[0].place_name,
      });
    }
  });
};

// //------ 在 app.js 時會被這樣呼叫！ ------//
// geocode("taipei", (error, data) => {
//   console.log("error", error);
//   console.log("data", data);
// });

// 在 geocode function 中叫做 callback 的這個 parameter，會以 argument 是 function 的形式被呼叫，且該 function 需要輸入兩個 parameter (error, data)，所以在 request 時使用 callback 這個 geocode 的第二個 parameter 時，要依照該狀態是屬於 error 或成功有 data 來決定哪個是 undefined！

module.exports = geocode;
