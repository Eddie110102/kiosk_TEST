// Google API Key
const GOOGLE_API_KEY = localStorage.getItem('GOOGLE_API_KEY');
// opendata weather API Key
const OPENDATA_API_KEY = localStorage.getItem('OPENDATA_API_KEY');

// 帶入資料
// 出勤查詢按鈕 日曆的日期
const nowCalender = document.getElementById("todayCalender");
// 地點
const nowLocation = document.getElementById("location");
// 日期
const nowDDay = document.getElementById("dDay");
// 星期幾
const nowWeek = document.getElementById("week");
// 目前時間
const nowTime = document.getElementById("time");
// 目前溫度
const nowTemperature = document.getElementById("temperature");
// 降雨機率
const nowPoP = document.getElementById("PoP");
// 天氣圖示
const nowWeatherIcon = document.getElementById("weatherIcon");

// 設定地區
let locationResult = "";
//  提供opendata API使用 (用現在市區轉譯)
let locationAPIUTF8 = "";

// 抓取經緯度並轉換成UTF-8地址
function catchLocation() {
  console.log('檢查是否有theCityName',localStorage.getItem("theCityName"));
  if (localStorage.getItem("theCityName") !== null) {
    console.log("已經有了不用再用GOOGLE API");
    locationResult = localStorage.getItem("theCityName");
    locationAPIUTF8 = localStorage.getItem("theCityNameUTF8");
    catchWeather();
  } else {
    console.log('localStorage沒有theCityName');
    let lang = "";
    if ("geolocation" in navigator) {
      // geolocation is available
      const successCallBack = async (position) => {
        lang = `${position.coords.latitude},${position.coords.longitude}`;
        // console.log('lang',lang);
        await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lang}&key=${GOOGLE_API_KEY}`
        )
          .then((res) => {
            return res.json();
          })
          .then((myJson) => {
            console.log("myJson", myJson);
            // 2GMV+C74 台灣台北市大安區 保留「 縣市+區域 」
            locationResult = myJson.plus_code.compound_code.split("灣")[1];
            // 如果有「台」就轉換成「台」 => 讓opendata API可以正常執行
            locationResult.includes("台")
              ? (locationResult = locationResult.replace("台", "臺"))
              : locationResult;
            // 「台灣台北市」=> 「臺北市」轉譯成 %E8%87%BA%E5%8C%97%E5%B8%82
            locationAPIUTF8 = encodeURIComponent(locationResult.slice(0, 3));
            console.log(
              "locationResult",
              locationResult,
              "locationAPIUTF8",
              locationAPIUTF8,
              "locationResult.slice(0, 3)",
              locationResult.slice(0, 3)
            );
            catchWeather();
            localStorage.setItem("theCityName", locationResult);
            localStorage.setItem("theCityNameUTF8", locationAPIUTF8);
          });
      };
      // 錯誤訊息
      const errorCallBack = (err) => {
        console.log("錯誤", err);
      };
      navigator.geolocation.getCurrentPosition(successCallBack, errorCallBack);
    } else {
      // geolocation IS NOT available
      // 如沒有成功抓取Location，預設地址為臺北市
      locationAPIUTF8 = "%E8%87%BA%E5%8C%97%E5%B8%82";
      catchWeather();
    }
  }
}

// 抓取現在天氣
let nowWeather = [];
function catchWeather() {
  fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${OPENDATA_API_KEY}&locationName=${locationAPIUTF8}&elementName=PoP,MaxT`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      let data = myJson.records.location[0].weatherElement;
      // console.log("data", data);
      // 地區
      nowLocation.innerText = locationResult;
      // 降雨機率 (降雨機率 PoP)
      nowPoP.innerText = `${data[0].time[0].parameter.parameterName}%`;
      // 變換圖示
      let iconValue = data[0].time[0].parameter.parameterName;
      if (iconValue >= 0 && iconValue <= 30) {
        nowWeatherIcon.src = "./icons/sunny.svg";
      } else if (iconValue >= 31 && iconValue <= 69) {
        nowWeatherIcon.src = "./icons/cloudy.svg";
      } else {
        nowWeatherIcon.src = "./icons/rainy.svg";
      }
      // 溫度 (最高溫 MaxT)
      nowTemperature.innerText =
        data[1].time[0].parameter.parameterName +
        `°${data[1].time[0].parameter.parameterUnit}`;
      // 設定天氣結束時間，超過就要重新抓取天氣
      localStorage.setItem("weatherEndTime", data[0].time[0].endTime);
    });
}

function catchNowDay() {
  let now = new Date();
  // 同步修改日期
  nowDDay.innerText = now
    .toLocaleDateString()
    .split("/")
    .map((x) => {
      if (x.length < 2) return x.padStart(2, "0");
      return x;
    })
    .join("-");
  // 修改出勤查詢按鈕的日期
  nowCalender.innerText = now.getDate();
  // 星期幾
  let transWeek = [
    "（日）",
    "（一）",
    "（二）",
    "（三）",
    "（四）",
    "（五）",
    "（六）",
  ];
  nowWeek.innerText = transWeek[now.getDay()];
}
window.setInterval(clock, 1000);
function clock() {
  let hh = new Date().getHours();
  let mm = new Date().getMinutes();
  let ss = new Date().getSeconds();
  // 判斷是否過凌晨要調整日期
  if (hh == 0 && mm == 0 && ss <= 5) {
    console.log('現在時間',hh,mm,ss);
    catchNowDay();
  }
  // 改變格式
  let time = [hh, mm, ss]
    .map((x) => {
      +x < 10 ? (x = `0${x}`) : x;
      return x;
    })
    .join(":");
  nowTime.innerHTML = time;

  // 抓取天氣12小時的預測，如果現在時間超過，就重新抓天氣
  let endTime = localStorage.getItem("weatherEndTime");
  if (new Date() >= new Date(endTime)&& endTime != null) {
    console.log("現在時間大於天氣的結束時間");
    catchWeather();
  }
}

nowWeatherIcon.addEventListener("dblclick", () => {
  // 關閉全螢幕
  toggleFullScreen();
});

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

//將滑鼠右鍵事件取消
document.oncontextmenu = function () {
  window.event.returnValue = false;
};
