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
  let lang = "";
  if ("geolocation" in navigator) {
    // geolocation is available
    const successCallBack = async (position) => {
      lang = `${position.coords.latitude},${position.coords.longitude}`;
      await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lang}&key=${GOOGLE_API_KEY}`
      )
        .then((res) => {
          return res.json();
        })
        .then((myJson) => {
          // console.log('myJson',myJson);
          // 2GMV+C74 台灣台北市大安區 保留「 縣市+區域 」
          locationResult = myJson.plus_code.compound_code.split("灣")[1];
          // 「台灣台北市」=> 「臺北市」轉譯成 %E8%87%BA%E5%8C%97%E5%B8%82
          locationAPIUTF8 = encodeURIComponent(
            myJson.results[myJson.results.length - 3].formatted_address
              .split("灣")[1]
              .replace("台", "臺")
          );
          catchWeather();
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

function catchNowDay(t) {
  // 同步修改日期
  nowDDay.innerText = t.toJSON().slice(0, 10);
  // 修改出勤查詢按鈕的日期
  nowCalender.innerText = t.getDate();
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
  nowWeek.innerText = transWeek[t.getDay()];
}

window.setInterval(clock, 1000);
function clock() {
  let today = new Date();
  let hh = today.getHours();
  let mm = today.getMinutes();
  let ss = today.getSeconds();
  // 判斷是否過凌晨要調整日期
  if (hh == 0 && mm == 0 && ss <= 5) {
    catchNowDay(today);
  }
  // 改變格式
  hh < 10 ? (hh = `0${hh}`) : hh;
  mm < 10 ? (mm = `0${mm}`) : mm;
  ss < 10 ? (ss = `0${ss}`) : ss;
  nowTime.innerHTML = `${hh}:${mm}:${ss}`;

  // 抓取天氣12小時的預測，如果現在時間超過，就重新抓天氣
  let endTime = localStorage.getItem("weatherEndTime");
  if (new Date(`${today} ${hh}:${mm}:${ss}`) >= new Date(endTime)) {
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