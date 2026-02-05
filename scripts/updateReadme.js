const fs = require("fs");

const xpData = JSON.parse(fs.readFileSync("xp.json", "utf-8"));
let readme = fs.readFileSync("README.md", "utf-8");

Object.keys(xpData).forEach(student => {
  const { xp, level, badges, attendanceDays } = xpData[student];

  const attendanceBadge = `![출석뱃지](https://img.shields.io/badge/출석-${attendanceDays}일-blue)`;
  const xpBadge = `![XP](https://img.shields.io/badge/XP-${xp}-yellow)`;
  const levelBadge = `![Level](https://img.shields.io/badge/Level-${level}-orange)`;
  const badgeList = badges.length > 0
    ? badges.map(b => `![Badge](https://img.shields.io/badge/Badge-${encodeURIComponent(b)}-green)`).join(" ")
    : "![Badge](https://img.shields.io/badge/Badge-없음-lightgrey)";

  const regex = new RegExp(`<!-- ${student}-badge-start -->[\\s\\S]*<!-- ${student}-badge-end -->`, "g");
  const replacement = `<!-- ${student}-badge-start -->\n${attendanceBadge}\n${xpBadge}\n${levelBadge}\n${badgeList}\n<!-- ${student}-badge-end -->`;

  readme = readme.replace(regex, replacement);
});

fs.writeFileSync("README.md", readme);
console.log("✅ README에 학생별 뱃지가 업데이트되었습니다!");
