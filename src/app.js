const geocode = require("./utiles/geocode");
const forecast = require("./utiles/forecast");
//////// 要先 require 其他檔案 ////////

const path = require("path");

const express = require("express");
// express 是一個 function

const app = express();
// 想成叫做 app 的 express application

const port = process.env.PORT || 3000;
// 使用 Heroku 時...

// 💡 製作 Partials
const hbs = require("hbs");
const partialsPath = path.join(__dirname, "../templates/partials");
hbs.registerPartials(partialsPath);
// 🧐  如何 render partials? 在需要該 partial 的.hbs裡，輸入下面這個！
// {{> content-block }}

///////////////////////////////////////
console.log(__dirname); // directory name 目錄
console.log(path.join(__dirname, "../public")); // 結合兩個 path

// 💡 path.join()方法: 用於連接路徑，使用分隔符(/)把指定的 path 片段連接到一起，並規範化生成的路徑。(../ => 代表上一級目錄)

// 🧐  如何把別的 folder 中的檔案全部結合在一起？(以HTML為例子)
// 🔎  Method 1
const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));

// // 🔎  Method 2 (This can work, but not recommend!)
// app.use(express.static("public"));
// 如果沒有指定「絕對路徑 absolute path」，express.static() 會依照預設使用當前工作目錄(current working directory, cwd)。此時的 cwd 是我們在終端 (terminal) 中執行 node command 的 directory。

///////////////////////////////////////
// 🧐 創造其他的page並互相結合在一起!
// app.com
// app.com/help
// app.com/about
// app.com/weather

///////////////////////////////////////
// 🥲 結合 HTML 後下面這些就用不到了！
// app.get("", (req, res) => {
//   res.send("<h1>From app.js file!</h1>");
// });

// app.get("/help", (req, res) => {
//   res.send({
//     name: "Anna",
//     age: 24,
//   });
// });

// app.get("/about", (req, res) => {
//   res.send("<h1>About</h1>");
// });
///////////////////////////////////////

///////////////////////////////////////
// 🧐 安裝 Handlebars?
// Handlebars 主要是讓你在做語意型模板(semantic templates)更有效率、且不容易受挫，並且相容Mustache模板，大多數可以直接互換使用。

// 🧐 設定 View Engine 的樣板?
// STEP 1
app.set("view engine", "hbs");
// 這代表 view engine 我們宣告為「樣板 hbs」
// hbs：is a express.js wrapper for the handlebars.js javascript template engine(模板引擎)。

// MVC模式（Model–view–controller）是軟體工程中的一種軟體架構模式，把軟體系統分為三個基本部分：模型（Model）、視圖（View）和控制器（Controller）。
// 視圖（View）能夠實現資料有目的的顯示（理論上，這不是必需的）。在 View 中一般沒有程式上的邏輯。為了實現 View 上的重新整理功能，View 需要存取它監視的資料模型（Model），因此應該事先在被它監視的資料那裡註冊。

//// Customizing the Views Directory ////
// 🧐 怎麼將存放(.hbs)的預設 views 資料夾，在變更名稱後重新設定路徑(path)成 templates 資料夾？（../templates）
// (更新) 若在 templates 中新增 views 資料夾，並移動(.hbs)檔案至其中，需要再次更動 path！（../templates/views）
const viewsPath = path.join(__dirname, "../templates/views");
app.set("views", viewsPath);

// STEP 2
app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "CHEN-AN, CHOU",
  });
});
// 這是當路由(app.get) 指向 URL 根目錄 ( / )時，並且 HTTP 的要求方法為 get，就會執行後面的 res.render('index',{...}); 它是渲染 views 資料夾內的 index.hbs，使其呈現在瀏覽的用戶端上。

// 💡 .render() 渲染：因為 res.render 設定就是渲染 view engine 的樣板，所以它預設位置就會在 views 資料夾，因此我們不用給予絕對路徑，只要打上欲渲染的 hbs 格式之檔名就好。

app.get("/about", (req, res) => {
  res.render("about", {
    title: "CHEN-AN, CHOU",
    name: "CHEN-AN, CHOU",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    helpText: "Let me know what's on your mind!",
    title: "Contact",
    name: "CHEN-AN, CHOU",
  });
});

///////////////////////////////////////

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address. ",
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error: error });
        // 也可以縮寫 return res.send({ error });
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }
        res.send({
          forecast: forecastData,
          location, // 為 location: location, 的縮寫！
          address: req.query.address,
        });
      });
    }
  );
});

// 💡 req.query._____: 一個Express的API，用來取得網址參數的方法。
// 以 req.query.address 來說，address 為自己設定，user request 的東西在網址上會如此呈現「?address=taipei」。? 代表 query，taipei 代表user 輸入的參數，可以 & 來連接多個 request。

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term. ",
    });
  }
  // 如果沒有 search term 就會在此處停止(return)
  // 若有就會 response 下面的東西

  console.log(req.query.search);
  res.send({
    products: [],
  });
});

///////////////////////////////////////
//////// .get() & .send() 說明 ////////
///////////////////////////////////////

// app.get("/weather", (req, res) => {
//   res.send({
//     forecast: "Nice",
//     location: "Taipei",
//   });
// });

// 💡 .get(): 藉由設定(configure)使用者輸入某些指定的 URL，就可以指示server端做某些事(function 內的事項)。
// req = request 請求 (incoming request to the server.)
// res= response 回應 (what we're going to send back to the requester.)

// 💡 .send(): 傳送給 browser 端，可以傳送 "HTML 及 JSON(object, array, string)"。

///////////////////////////////////////

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "CHEN-AN, CHOU",
    errorMessage: "Help artical not found.",
  });
});
// "/help/*"：代表 match 到「目前沒有 anything matched 到 /help/___ 後面輸入的 ____ 這個 string 所連結的 page」。

///////////////////////////////////////
app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "CHEN-AN, CHOU",
    errorMessage: "Page not found.",
  });
});

// "*"：代表 match 到「目前沒有其他 matching 到的頁面」的意思 ＝ Match the page that hasn't been matched so for.
// "*" 放在最下面的理由為，要確認是否全部已設定 page 都沒有 match 到 request，當系統跑到此行後，因為 match 到「目前沒有其他 matching 到的頁面」所以會停止 matching。

app.listen(port, () => {
  console.log("Server is up on port" + port);
});
// 3000: port
// () => {console.log("Server is up on port 3000.")}); : Callback function
// 輸入 http://localhost:3000/ => 可查看成果！

// 💡 .listen(): 讓你決定要監聽哪一個 port，並且開始監聽任何進來的 requests，這個 port 可以自行定義！
// (1) 定義 and 使用方式: The server.listen() method creates a listener on the specified port or path.
// (2) Syntax (句法): server.listen(port, hostname, backlog, callback);

/*
/////////////// REVIEW! ///////////////

//// 1️⃣  Define paths for Express Config ////
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates");
const partialsPath = path.join(__dirname, "../templates/partials");

//// 2️⃣  Setup Handlebars Engine and Views Location ////
app.set("view engine", "hbs");
app.set("views", viewsPath);

//// 3️⃣  Setup Directory to Server ////
app.use(express.static(publicDirectoryPath));
*/
