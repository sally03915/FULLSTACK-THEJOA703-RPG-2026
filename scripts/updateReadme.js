const fs = require("fs");

const xpData = JSON.parse(fs.readFileSync("xp.json", "utf-8"));
let readme = fs.readFileSync("README.md", "utf-8");

// 학생별 이모지 매핑
const emojiMap = {
  "홍길동": "👾",   // 픽셀 몬스터 느낌
  "김철수": "⚔️",   // 전사/도전자 느낌
  "이영희": "🌸"    // 밝고 귀여운 느낌
};

Object.keys(xpData).forEach(student => {
  const emoji = emojiMap[student] || "🎓";
  const { xp, level, badges, attendanceDays } = xpData[student];

  // HTML 태그로 크기 조절 + style=for-the-badge 적용 (가로 방향)
  const attendanceBadge = `<img src="https://img.shields.io/badge/출석-${attendanceDays}일-blue?style=for-the-badge" height="40">`;
  const xpBadge = `<img src="https://img.shields.io/badge/XP-${xp}-yellow?style=for-the-badge" height="40">`;
  const levelBadge = `<img src="https://img.shields.io/badge/Level-${level}-orange?style=for-the-badge" height="40">`;
  const badgeList = badges.length > 0
    ? badges.map(b => `<img src="https://img.shields.io/badge/Badge-${encodeURIComponent(b)}-green?style=for-the-badge" height="40">`).join(" ")
    : `<img src="https://img.shields.io/badge/Badge-없음-lightgrey?style=for-the-badge" height="40">`;

  // 가로 방향으로 한 줄에 나열
  const badgesRow = `${attendanceBadge} ${xpBadge} ${levelBadge} ${badgeList}`;

  // README 내 주석 블록 교체
  const regex = new RegExp(`<!-- ${student}-badge-start -->[\\s\\S]*<!-- ${student}-badge-end -->`, "g");
  const replacement = `<!-- ${student}-badge-start -->\n${badgesRow}\n<!-- ${student}-badge-end -->`;

  // 학생 이름 앞에 이모지 붙이기
  const nameRegex = new RegExp(`##\\s*${student}`, "g");
  readme = readme.replace(nameRegex, `## ${emoji} ${student}`);

  readme = readme.replace(regex, replacement);
});

fs.writeFileSync("README.md", readme);
console.log("✅ README에 학생별 뱃지가 가로 방향으로 업데이트되었습니다!");
