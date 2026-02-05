const fs = require("fs");

const xpData = JSON.parse(fs.readFileSync("xp.json", "utf-8"));
let readme = fs.readFileSync("README.md", "utf-8");

// 학생별 이모지 매핑
const emojiMap = {
  "홍길동": "👾",
  "김철수": "⚔️",
  "이영희": "🌸"
};

// 뱃지 색상 매핑
const badgeColorMap = {
  "개근왕": "green",
  "과제왕": "purple",
  "팀플마스터": "lightblue",
  "코드기여자": "brown",
  "성장중": "pink",
  "챌린지완료": "red"
};

Object.keys(xpData).forEach(student => {
  const emoji = emojiMap[student] || "🎓";
  const { attendanceDays } = xpData[student];

  // ✅ XP 계산: 출석일수 × 10
  const xp = attendanceDays * 10;

  // ✅ 레벨 계산 규칙: 100 XP마다 레벨업
  const level = Math.floor(xp / 100) + 1;

  // ✅ 자동 뱃지 부여 규칙
  let badges = [];
  if (attendanceDays >= 10) badges.push("개근왕");
  if (xp >= 200) badges.push("성장중");
  if (xp >= 300) badges.push("과제왕");
  if (xp >= 500) badges.push("챌린지완료");

  // 🎯 특별 뱃지 조건 추가
  // 예시: 출석 15일 이상이면 팀플마스터
  if (attendanceDays >= 15) badges.push("팀플마스터");
  // 예시: XP 250 이상이면 코드기여자
  if (xp >= 250) badges.push("코드기여자");

  // 기본 뱃지들
  const attendanceBadge = `![출석뱃지](https://img.shields.io/badge/출석-${attendanceDays}일-blue?style=flat)`;
  const xpBadge = `![XP](https://img.shields.io/badge/XP-${xp}-yellow?style=flat)`;
  const levelBadge = `![Level](https://img.shields.io/badge/Level-${level}-orange?style=flat)`;

  // 학생별 보유 뱃지 자동 생성
  const badgeList = badges.length > 0
    ? badges.map(b => {
        const color = badgeColorMap[b] || "grey";
        return `![Badge-${b}](https://img.shields.io/badge/Badge-${encodeURIComponent(b)}-${color}?style=flat)`;
      }).join(" ")
    : `![Badge](https://img.shields.io/badge/Badge-없음-lightgrey?style=flat)`;

  // 가로 방향으로 한 줄에 나열
  const badgesRow = `${attendanceBadge} ${xpBadge} ${levelBadge} ${badgeList}`;

  // 레벨 색깔 이모지 그래프
  const levelGraph = `\`\`\`\nLevel ${level} | ${"🟩".repeat(level)} (${level})\n\`\`\``;

  // README 내 주석 블록 교체
  const regex = new RegExp(`<!-- ${student}-badge-start -->[\\s\\S]*<!-- ${student}-badge-end -->`, "g");
  const replacement = `<!-- ${student}-badge-start -->\n${badgesRow}\n\n**레벨 그래프**\n${levelGraph}\n<!-- ${student}-badge-end -->`;

  // 학생 이름 앞에 이모지 붙이기
  const nameRegex = new RegExp(`##\\s*${student}`, "g");
  readme = readme.replace(nameRegex, `## ${emoji} ${student}`);

  readme = readme.replace(regex, replacement);
});

fs.writeFileSync("README.md", readme);
console.log("✅ README에 학생별 뱃지, 레벨 계산, 특별 뱃지 자동 부여가 업데이트되었습니다!");
