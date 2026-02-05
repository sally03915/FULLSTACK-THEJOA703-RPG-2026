const fs = require("fs");

const xpData = JSON.parse(fs.readFileSync("xp.json", "utf-8"));
let readme = fs.readFileSync("README.md", "utf-8");

// 학생별 이모지 매핑
const emojiMap = {
  "홍길동": "👾",
  "김철수": "⚔️",
  "이영희": "🌸"
};

Object.keys(xpData).forEach(student => {
  const emoji = emojiMap[student] || "🎓";
  const { xp, level, badges, attendanceDays } = xpData[student];

  // HTML 태그로 크기 조절 + style=for-the-badge 적용
  const attendanceBadge = `<img src="https://img.shields.io/badge/출석-${attendanceDays}일-blue?style=for-the-badge" height="40">`;
  const xpBadge = `<img src="https://img.shields.io/badge/XP-${xp}-yellow?style=for-the-badge" height="40">`;
  const levelBadge = `<img src="https://img.shields.io/badge/Level-${level}-orange?style=for-the-badge" height="40">`;
  const badgeList = badges.length > 0
    ? badges.map(b => `<img src="https://img.shields.io/badge/Badge-${encodeURIComponent(b)}-green?style=for-the-badge" height="40">`).join(" ")
    : `<img src="https://img.shields.io/badge/Badge-없음-lightgrey?style=for-the-badge" height="40">`;

  // README 내 주석 블록 교체
  const regex = new RegExp(`## .*${student}[\\s\\S]*<!-- ${student}-badge-start -->[\\s\\S]*<!-- ${student}-badge-end -->`, "g");
  const replacement = `## ${emoji} ${student}\n<!-- ${student}-badge-start -->\n${attendanceBadge}\n${xpBadge}\n${levelBadge}\n${badgeList}\n<!-- ${student}-badge-end -->`;

  readme = readme.replace(regex, replacement);
});

fs.writeFileSync("README.md", readme);
console.log("✅ README에 학생별 뱃지가 크게 업데이트되었습니다!");
