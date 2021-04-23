console.log("Client side JavaScript file is loaded!");

/*
// 💡 fetch()
// Fetch API 提供了一種 JavaScript Interface 來操作 HTTP pipeline，比方 request 和 response。

// 使用 Fetch 發送請求 (request) 舉例：
fetch("http://localhost:3000/weather?address=tokyo")
  .then(function (response) {
    return response.json();
  })
  .then(function (myJson) {
    console.log(myJson);
  });

// 用 arrow function 簡寫成：
fetch("http://localhost:3000/weather?address=tokyo")
  .then((response) => response.json())
  .then((myJson) => {
    console.log(myJson);
  });

// 💡 Promise.prototype.then()
// then() 方法回傳一個 Promise object(物件)。它接收兩個引數： Promise 在成功及失敗情況時的回呼函式。

// p.then(onFulfilled[, onRejected]);

// p.then(function(value) {
//   // fulfillment
// }, function(reason) {
//   // rejection
// });
*/

const weatherForm = document.querySelector("form");
const search = document.querySelector("input");
const messageOne = document.querySelector("#message-1");
const messageTwo = document.querySelector("#message-2");

// messageOne.textContent = "From JavaScript";

weatherForm.addEventListener("submit", (e) => {
  e.preventDefault(); // 避免預設會一直重新 refresh page

  const location = search.value;
  // value 代表 user 輸入的項目

  fetch(`/weather?address=${location}`).then((response) => {
    response.json().then((data) => {
      if (data.error) {
        console.log(data.error);
        messageOne.textContent = data.error;
        messageTwo.textContent = "";
      } else {
        console.log(data.location);
        console.log(data.forecast);
        messageOne.textContent = data.location;
        messageTwo.textContent = data.forecast;
      }
    });
  });
});
