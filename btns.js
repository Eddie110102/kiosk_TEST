// 開啟 出勤查詢 按鈕
const attendanceBtn = document.getElementById("attendanceBtn");
attendanceBtn.addEventListener("click", () => {
  // 走查詢的API
  functionFlag = 2;
  // 開啟彈跳視窗
  attendanceContainer.classList.add("show");
  countDown();
});
// 關閉出勤查詢 按鈕
const closeAttendanceBtn = document.getElementById("closeAttendance");
closeAttendanceBtn.addEventListener("click", () => {
  // 關閉彈跳視窗
  attendanceContainer.classList.remove("show");
  // 變回打卡的API
  functionFlag = 1;
  // 清除localStorage暫存QRcode、出勤查詢資料
  clearData();
});
// 出勤查詢方框
const attendanceContainer = document.getElementById("attendanceContainer");
// 出勤查詢上下週 按鈕
const attendancePrev = document.getElementById("attendancePrevBtn");
const attendanceNext = document.getElementById("attendanceNextBtn");
attendancePrev.addEventListener("click", () => {
  // 判斷localStorage是有否QRCode
  if (window.localStorage.getItem("tempStudentQRCode")) {
    let startDate = new Date(window.localStorage.getItem("startDateTemp"));
    let endDate = new Date(window.localStorage.getItem("endDateTemp"));
    let nowDate = new Date(attendanceResult.attendance[6].date);
    //  判斷是否大於結訓日期，抓取下一週出勤紀錄
    if (nowDate > startDate && nowDate < endDate) {
      week += 1;
      getAttendanceRecord(
        window.localStorage.getItem("tempStudentQRCode"),
        week
      );
      countDown();
    }
  }
});
attendanceNext.addEventListener("click", () => {
  // 判斷localStorage是有否QRCode
  if (window.localStorage.getItem("tempStudentQRCode")) {
    let startDate = new Date(window.localStorage.getItem("startDateTemp"));
    let endDate = new Date(window.localStorage.getItem("endDateTemp"));
    let nowDate = new Date(attendanceResult.attendance[0].date);
    //  判斷是否大於結訓日期，抓取下一週出勤紀錄
    if (nowDate > startDate && nowDate < endDate) {
      week -= 1;
      getAttendanceRecord(
        window.localStorage.getItem("tempStudentQRCode"),
        week
      );
      countDown();
    }
  }
});

// 學員名稱
const studentCheckInInfo = document.getElementById("studentCheckInInfo");
const studentName = document.getElementById("studentName");
const courseName = document.getElementById("courseName");
const studentCheckInName = document.getElementById("studentCheckInName");
const courseCheckInName = document.getElementById("courseCheckInName");
// 2023/05/10 Eddie
const studentCheckInSid = document.getElementById("studentCheckInSid");
const studentCheckInClassRoom = document.getElementById(
  "studentCheckInClassRoom"
);
const checkInCurrentTime = document.getElementById("checkInCurrentTime");
const attendanceFailed = document.getElementById("attendanceFailed");
const studentInfo = document.getElementById("studentInfo");

// 上午、下午、夜間、日期、星期元素
const block1 = document.getElementById("block1");
const block2 = document.getElementById("block2");
const block3 = document.getElementById("block3");
const attendanceWeek = document.getElementById("attendanceWeek");
const attendanceDate = document.getElementById("attendanceDate");

// 10秒消失彈跳視窗
function countDown() {
  // 先清除所有計時器
  for (let i = 1; i < 100000; i++) {
    clearInterval(i);
  }
  window.setInterval(clock, 1000);
  // 設定倒數數字
  const attendanceCountDownText = document.getElementById(
    "attendanceCountDownText"
  );
  const checkInCountDownText = document.getElementById("checkInCountDownText");
  // 將目前點擊時間存在localStorage，並判斷10秒後關閉彈跳視窗
  window.sessionStorage.setItem("clickRightNowSection", new Date().getTime());
  let time = 10;
  attendanceCountDownText.innerText = time;
  checkInCountDownText.innerText = time;
  let countToZero = setInterval(() => {
    time--;
    attendanceCountDownText.innerText = time;
    checkInCountDownText.innerText = time;
    if (
      new Date().getTime() >
      Number(window.sessionStorage.getItem("clickRightNowSection")) + 10000
    ) {
      console.log("stop");
      clearInterval(countToZero);
      functionFlag = 1;
      clearData();
      time = 10;
    }
  }, 1000);
}
function clearData() {
  attendanceContainer.classList.remove("show");
  checkInContainer.classList.remove("show");
  window.localStorage.clear();
  for (let i = 1; i < 8; i++) {
    attendanceDate.children[i].innerText = "";
    attendanceWeek.children[i].innerText = "";
    block1.children[i].innerText = "";
    block2.children[i].innerText = "";
    block3.children[i].innerText = "";
  }
  studentName.innerText = "";
  courseName.innerText = "";
  studentCheckInName.innerText = "";
  courseCheckInName.innerText = "";
  // 2023/05/10 Eddie
  studentCheckInSid.innerText = "";
  studentCheckInClassRoom.innerText = "";
  checkInCurrentTime.innerText = "";
  week = 0;
}

// 條碼掃描 按鈕
const checkInBtn = document.getElementById("checkInBtn");
checkInBtn.addEventListener("click", () => {
  // 走打卡的API
  functionFlag = 1;
  // 開啟彈跳視窗
  checkInContainer.classList.add("show");
  studentCheckInInfo.style.visibility = "hidden";
  checkInResponse.innerText = "請掃描QR Code！";
  countDown();
  console.log("eddie");
});
// 打卡結果方框
const checkInContainer = document.getElementById("checkInContainer");
const checkInResponse = document.getElementById("checkInResponse");
// 關閉出勤查詢 按鈕
const closecheckInBtn = document.getElementById("closeCheckIn");
closecheckInBtn.addEventListener("click", () => {
  // 關閉彈跳視窗
  checkInContainer.classList.remove("show");
  // 變回打卡的API
  functionFlag = 1;
  studentCheckInInfo.style.visibility = "visible";
  // 2023/05/10 Eddie
  clearData();
  checkInResponse.classList.remove("success", "failed");
});

function showAttendanceResult() {
  countDown();
  console.log(attendanceResult);
  if (attendanceResult.success) {
    window.localStorage.setItem(
      "startDateTemp",
      attendanceResult.data.startDate
    );
    window.localStorage.setItem("endDateTemp", attendanceResult.data.endDate);
    attendanceFailed.classList.remove("show");
    studentInfo.classList.remove("hidden");
    let attendanceData = attendanceResult.attendance;
    studentName.innerText = attendanceResult.data.student_name;
    courseName.innerText = attendanceResult.data.course_name;
    // block1 = 上午 ， block2 = 下午 ， block3 = 夜間 ， '' = 無 ，"absence" = 缺席
    console.log(block1.children[1]);
    for (let i = 0; i < attendanceData.length; i++) {
      // 日期
      attendanceDate.children[i + 1].innerHTML = `<td>${attendanceData[
        attendanceData.length - (i + 1)
      ].date
        .slice(5, 10)
        .replace("-", "/")}</td>`;
      // 星期
      let WeekArr = {
        0: "一",
        1: "二",
        2: "三",
        3: "四",
        4: "五",
        5: "六",
        6: "日",
      };
      let nowWeek = new Date(
        attendanceData[attendanceData.length - (i + 1)].date
      ).getDay();
      attendanceWeek.children[i + 1].innerHTML = `<td>星期${
        WeekArr[nowWeek - 1 < 0 ? 6 : nowWeek - 1]
      }</td>`;
      insertAttendance(
        i,
        attendanceData[attendanceData.length - (i + 1)].morning,
        block1
      );
      insertAttendance(
        i,
        attendanceData[attendanceData.length - (i + 1)].afternoon,
        block2
      );
      insertAttendance(
        i,
        attendanceData[attendanceData.length - (i + 1)].night,
        block3
      );
    }
  } else {
    console.log("Eddie false");
    clearData();
    attendanceContainer.classList.add("show");
    attendanceFailed.classList.add("show");
    studentInfo.classList.add("hidden");
  }
}

function insertAttendance(i, block, blockElement) {
  if (block == "" || block == undefined) {
    blockElement.children[i + 1].innerHTML = "";
  } else if (block == "absence") {
    blockElement.children[i + 1].innerHTML =
      '<img src="./icons/false.svg" alt="" />';
  } else {
    blockElement.children[i + 1].innerHTML =
      '<img src="./icons/true.svg" alt="" />';
  }
}

let stopScan = false;
let functionFlag = 1;
let week = 0;
let attendanceResult = "";
let checkInResult = "";
// 打卡
document
  .getElementsByClassName("logoOrigin")[0]
  .addEventListener("click", function () {
    connectToQRScanner();
  });
document
  .getElementsByClassName("logoWhite")[0]
  .addEventListener("click", function () {
    connectToQRScanner();
  });

//打卡，qrcode:學生QRCode
async function checkIn(qrcode) {
  let fD = new FormData();
  fD.append("qrcode", qrcode);
  checkInResult = await fetch(CHECK_IN_API, {
    method: "POST",
    body: fD,
  })
    .then((rs) => rs.text())
    .then((message) => {
      return JSON.parse(message);
    });

  showCheckInResult(checkInResult);
}
function showCheckInResult(checkInResult) {
  // console.log(checkInResult.success);
  countDown();
  checkInContainer.classList.add("show");
  if (checkInResult.success) {
    studentCheckInInfo.style.visibility = "visible";
    studentCheckInName.innerText = checkInResult.data.student_name;
    courseCheckInName.innerText = checkInResult.data.course_name;
    // 2023/05/10 Eddie
    studentCheckInSid.innerText = checkInResult.data.student_id;
    studentCheckInClassRoom.innerText = checkInResult.data.classroom;
    checkInCurrentTime.innerText = checkInResult.data.attend_time;
    checkInResponse.classList.add("success");
    checkInResponse.classList.remove("failed");
    checkInResponse.innerText = "";
  } else {
    clearData();
    checkInContainer.classList.add("show");
    // 2023/05/10 Eddie
    checkInResponse.classList.add("failed");
    checkInResponse.classList.remove("success");
    checkInResponse.innerText = "打卡失敗";
  }
}

//取得出席紀錄，qrCode:學生QRCode, week:{0:本週,1:上週,2:上上週}
async function getAttendanceRecord(qrcode, week) {
  let fD = new FormData();
  fD.append("qrcode", qrcode);
  fD.append("week", week);
  attendanceResult = await fetch(GET_ATTENDANCE_RECORD_API, {
    method: "POST",
    body: fD,
  })
    .then((rs) => rs.json())
    .then((message) => {
      return message;
    })
    .catch((err) => {
      // console.log(err);
      return { success: false };
    });
  showAttendanceResult();
}

//連結QRCode掃描器
async function connectToQRScanner() {
  const port = await navigator.serial.requestPort({
    filter: { vendorId: 0x076d },
  });
  await port.open({ baudRate: 9600 });
  const textDecoder = new TextDecoderStream();
  const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
  const reader = textDecoder.readable.getReader();

  //掃描行為發生時
  let scannedData = "";
  setInterval(async () => {
    const { value, done } = await reader.read();
    if (stopScan) {
      reader.releaseLock();
      return;
    }

    scannedData += value;

    //根據functionFlag決定執行哪個function，flag[1:打卡,2:取得出席紀錄]
    setTimeout(function () {
      if (scannedData != "") {
        window.localStorage.setItem("tempStudentQRCode", scannedData);
        switch (functionFlag) {
          case 1:
            checkIn(scannedData);
            break;
          case 2:
            getAttendanceRecord(scannedData, week);
            break;
        }
        scannedData = "";
      }
    }, 10);
  }, 10);
}
