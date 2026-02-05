const fs = require("fs");

const attendanceFile = "attendance/records.json";
const xpFile = "xp.json";

let attendance = JSON.parse(fs.readFileSync(attendanceFile, "utf-8"));
let xpData = fs.existsSync(xpFile) ? JSON.parse(fs.readFileSync(xpFile, "utf-8")) : {};

attendance.forEach(student => {
  if (!xpData[student.name]) {
    xpData[student.name] = { xp: 0, level: 1, attendanceDays: 0, badges: [] };
  }

  // 출석 업데이트
  xpData[student.name].attendanceDays = student.attendanceDays;
  xpData[student.name].xp = student.attendanceDays * 10;

  // 뱃지 조건
  if (student.attendanceDays >= 7 && !xpData[student.name].badges.includes("꾸준함의 초심자")) {
    xpData[student.name].badges.push("꾸준함의 초심자");
  }
  if (student.attendanceDays >= 30 && !xpData[student.name].badges.includes("개근왕")) {
    xpData[student.name].badges.push("개근왕");
  }
  if (student.attendanceDays >= 100 && !xpData[student.name].badges.includes("꾸준함의 달인")) {
    xpData[student.name].badges.push("꾸준함의 달인");
  }

  // 레벨업 조건 (XP 기준)
  xpData[student.name].level = Math.floor(xpData[student.name].xp / 100) + 1;
});

fs.writeFileSync(xpFile, JSON.stringify(xpData, null, 2));
console.log("✅ XP와 뱃지가 업데이트되었습니다!");
