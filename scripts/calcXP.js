const fs = require("fs");

// 안전하게 JSON 읽기 함수
function safeReadJSON(path) {
  try {
    if (!fs.existsSync(path)) return {};
    const data = fs.readFileSync(path, "utf-8");
    return data && data.trim() !== "" ? JSON.parse(data) : {};
  } catch (e) {
    console.warn(`⚠️ ${path} 읽기 실패:`, e.message);
    return {};
  }
}

const attendanceFile = "attendance/records.json";
const xpFile = "xp.json";

// 출석 기록과 XP 데이터 읽기
const attendance = safeReadJSON(attendanceFile);
let xpData = safeReadJSON(xpFile);

// 출석 기록이 배열이 아닐 경우 대비
if (!Array.isArray(attendance)) {
  console.error("❌ 출석 기록이 올바른 배열 형식이 아닙니다.");
  process.exit(1);
}

// 학생별 XP/뱃지 계산
attendance.forEach(student => {
  if (!xpData[student.name]) {
    xpData[student.name] = { xp: 0, level: 1, attendanceDays: 0, badges: [] };
  }

  // 출석 업데이트
  xpData[student.name].attendanceDays = student.attendanceDays || 0;
  xpData[student.name].xp = xpData[student.name].attendanceDays * 10;

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

// 업데이트된 데이터 저장
try {
  fs.writeFileSync(xpFile, JSON.stringify(xpData, null, 2));
  console.log("✅ XP와 뱃지가 업데이트되었습니다!");
} catch (e) {
  console.error("❌ xp.json 저장 실패:", e.message);
}
