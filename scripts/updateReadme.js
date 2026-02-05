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
  "출석마스터": "blue",
  "끝까지함께": "gold",
  "과제왕": "purple",
  "성실제출자": "orange",
  "챌린지완료": "red",
  "팀플마스터": "lightblue",
  "코드기여자": "brown",
  "발표왕": "yellow",
  "성장중": "pink",
  "레벨업마스터": "teal",
  "최종보스클리어": "black"
};

Object.keys(xpData).forEach(student => {
  const emoji = emojiMap[student] || "🎓";
  const {
    attendanceDays = 0,
    assignmentsCompleted = 0,
    totalAssignments = 0,
    contributions = 0,
    presentations = 0
  } = xpData[student];

  // ✅ XP 계산: 출석 + 과제 + 팀플 + 코드 기여 + 발표
  const xp = (attendanceDays * 10) +
             (assignmentsCompleted * 20) +
             (contributions * 10) +
             (presentations * 20);

  // ✅ 레벨 계산 규칙: 125 XP마다 레벨업 → 과정 끝에 최대 레벨 10
  const level = Math.floor(xp / 125) + 1;

  // ✅ 자동 뱃지 부여 규칙
  let badges = [];

  // 출석 관련
  if (attendanceDays >= 30) badges.push("개근왕");
  if (attendanceDays >= 60) badges.push("출석마스터");
  if (attendanceDays >= 125) badges.push("끝까지함께");

  // 과제 관련
  if (totalAssignments > 0) {
    const ratio = assignmentsCompleted / totalAssignments;
    if (ratio === 1) badges.push("과제왕");
    else if (ratio >= 0.8) badges.push("성실제출자");
  }
  if (xp >= 500) badges.push("챌린지완료");

  // 협업/활동 관련
  if (attendanceDays >= 15) badges.push("팀플마스터");
  if (contributions >= 10) badges.push("코드기여자");
  if (presentations >= 3) badges.push("발표왕");

  // 성장 관련
  if (xp >= 200) badges.push("성장중");
  if (level >= 5) badges.push("레벨업마스터");
  if (level >= 10) badges.push("최종보스클리어");

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
console.log("✅ README에 학생별 뱃지, 레벨 계산, 과제·팀플·코드 기여·발표 활동까지 반영되었습니다!");
