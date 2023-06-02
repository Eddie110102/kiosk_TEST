const classContainer = document.getElementById("classContainer");
let nowClass = "";

nowClass = {
  status: true,
  date: "2023-05-05",
  long: [
    {
      roomID: "304",
      roomStart: "09:00",
      roomEnd: "16:30",
      className: "軟體測試工程師養成訓練班",
      classID: "JMSTQAT2301",
      classStart: "2023/02/13",
      classEnd: "2023/05/31",
    },
    {
      roomID: "305",
      roomStart: "09:00",
      roomEnd: "16:30",
      className: "雲端網路與資安工程師就業養成班",
      classID: "JNSESET2301",
      classStart: "2023/04/25",
      classEnd: "2023/09/20",
    },
    {
      roomID: "306",
      roomStart: "09:00",
      roomEnd: "16:30",
      className: "Big Data 巨量資料分析就業養成班",
      classID: "JJBDSET2301",
      classStart: "2023/03/02",
      classEnd: "2023/08/10",
    },
    {
      roomID: "307",
      roomStart: "09:00",
      roomEnd: "16:30",
      className: "3D遊戲美術設計人才養成班",
      classID: "JAMTDCT2203",
      classStart: "2023/03/06",
      classEnd: "2023/08/04",
    },
    {
      roomID: "308",
      roomStart: "09:00",
      roomEnd: "16:30",
      className: "雲端網路與資安工程師就業養成班",
      classID: "JNSESET2203",
      classStart: "2022/12/26",
      classEnd: "2023/06/02",
    },
    {
      roomID: "310",
      roomStart: "09:00",
      roomEnd: "16:30",
      className: "智慧應用微軟C#工程師就業養成班",
      classID: "JMMSITT2308",
      classStart: "2023/03/27",
      classEnd: "2023/08/25",
    },
    {
      roomID: "311",
      roomStart: "09:00",
      roomEnd: "16:30",
      className: "Unity跨平台遊戲開發工程師養成班",
      classID: "JPUMVRT2203",
      classStart: "2023/01/09",
      classEnd: "2023/06/16",
    },
    {
      roomID: "310",
      roomStart: "09:00",
      roomEnd: "16:30",
      className: "智慧應用微軟C#工程師就業養成班",
      classID: "JMMSITT2308",
      classStart: "2023/03/27",
      classEnd: "2023/08/25",
    },
    {
      roomID: "311",
      roomStart: "09:00",
      roomEnd: "16:30",
      className: "Unity跨平台遊戲開發工程師養成班",
      classID: "JPUMVRT2203",
      classStart: "2023/01/09",
      classEnd: "2023/06/16",
    },
  ],
};

let resultRow1 = "";
let resultRow2 = "";
let resultRow3 = "";
let classCount = "";

// 如果有成功抓取課程
// 1. 計算有幾門課、要生產幾頁
if (nowClass) {
  classCount = Math.ceil(nowClass.long.length / 4);
  // console.log("課程頁數", classCount);
  // console.log("課程數量", nowClass.long.length);
  // 2. 增加動畫、課程列表
  addParents();
  // 3. 抓取目前位置
  catchLocation();
  // 4. 抓取現在日期、時間
  catchNowDay();
}

function addParents() {
  // 清除舊有資料
  classContainer.innerHTML = "";
  // 計算需要幾頁、重新設定動畫
  classCount < 1 ? (classCount = 1) : classCount;
  classContainer.style.width = `${classCount}00%`;
  classContainer.style.animation = `slideBox${classCount} infinite`;
  classContainer.style.animationDuration = `${classCount}0s`;
  for (let i = 1; i <= classCount; i++) {
    classContainer.innerHTML += `<div id="containerRow${i}"></div>`;
  }
  addChild();
}
// 需要再修改成變數
function addChild() {
  // 清除上時段的內容
  resultRow1 = "";
  resultRow2 = "";
  resultRow3 = "";
  for (let i = 0; i < nowClass.long.length; i++) {
    if (i <= 3) {
      resultRow1 += `<div class="classBox"><div class="classroom classroomColor${i}"><div class="roomId">${nowClass.long[i].roomID}</div><div>教室</div></div><div class="classInfo classInfoColor${i}"><div class="className">${nowClass.long[i].className}</div><div class="classTime"><span><span class="roomStart">${nowClass.long[i].roomStart}</span> - <span class="roomEnd">${nowClass.long[i].roomEnd}</span></span><span class="classID">${nowClass.long[i].classID}</span></div></div></div>`;
    } else if (i >= 4 && i <= 7) {
      resultRow2 += `<div class="classBox"><div class="classroom classroomColor${
        i - 4
      }"><div class="roomId classroomColor${i - 4}">${
        nowClass.long[i].roomID
      }</div><div>教室</div></div>
  <div class="classInfo classInfoColor${i - 4}"><div class="className">${
        nowClass.long[i].className
      }</div><div class="classTime"><span><span class="roomStart">${
        nowClass.long[i].roomStart
      }</span> - <span class="roomEnd">${
        nowClass.long[i].roomEnd
      }</span></span><span class="classID">${
        nowClass.long[i].classID
      }</span></div></div></div>`;
    } else {
      resultRow3 += `<div class="classBox"><div class="classroom classroomColor${
        i - 8
      }"><div class="roomId classroomColor${i - 8}">${
        nowClass.long[i].roomID
      }</div><div>教室</div></div><div class="classInfo classInfoColor${
        i - 8
      }"><div class="className">${
        nowClass.long[i].className
      }</div><div class="classTime"><span><span class="roomStart">${
        nowClass.long[i].roomStart
      }</span> - <span class="roomEnd">${
        nowClass.long[i].roomEnd
      }</span></span><span class="classID">${
        nowClass.long[i].classID
      }</span></div></div></div>`;
    }
  }
  for (let i = 1; i <= classCount; i++) {
    const element = document.getElementById(`containerRow${i}`);
    switch (i) {
      case 1:
        element.innerHTML = resultRow1;
        break;
      case 2:
        element.innerHTML = resultRow2;
        break;
      case 3:
        element.innerHTML = resultRow3;
        break;
    }
  }
}
