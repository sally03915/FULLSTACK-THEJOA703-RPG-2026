FULLSTACK-THEJOA703-RPG-2026/
│
├── attendance/                # 출석 기록 폴더
│   └── records.json           # 학생별 출석 기록 (누적 일수)
│
├── scripts/                   # 자동화 스크립트 폴더
│   ├── calcXP.js              # 출석 기록 → XP/뱃지 계산
│   └── updateReadme.js        # README에 뱃지 자동 반영
│
├── badges/                    # 뱃지 이미지/데이터 저장 폴더
│   └── sample_badges.md       # Shields.io 뱃지 예시
│
├── xp.json                    # 학생별 XP/레벨/뱃지 데이터
│
├── README.md                  # 메인 문서 (뱃지 표시 영역 포함)
│
└── .github/
    └── workflows/
        └── attendance.yml     # GitHub Actions 워크플로우


```records.json
[
  { "name": "홍길동", "attendanceDays": 7  },
  { "name": "김철수", "attendanceDays": 30 },
  { "name": "이영희", "attendanceDays": 2  }
]

```scripts/calcXP.js
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



```scripts/initData.js 
const fs = require("fs");

const students = ["홍길동", "김철수", "이영희"];
let xpData = {};

students.forEach(name => {
  xpData[name] = { xp: 0, level: 1, attendanceDays: 0, badges: [] };
});

fs.writeFileSync("xp.json", JSON.stringify(xpData, null, 2));
console.log("✅ xp.json 초기화 완료!");



```scripts/updateReadme.js
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



```scripts/sample_badges.md
![출석뱃지](https://img.shields.io/badge/출석-10일-blue)
![개근왕](https://img.shields.io/badge/Badge-개근왕-green)
![Level](https://img.shields.io/badge/Level-1-orange)  



```scripts/README.md
# 🎮 FULLSTACK 학습 RPG 시스템

## 홍길동
<!-- 홍길동-badge-start -->
![출석뱃지](https://img.shields.io/badge/출석-0일-blue)
![XP](https://img.shields.io/badge/XP-0-yellow)
![Level](https://img.shields.io/badge/Level-1-orange)
![Badge](https://img.shields.io/badge/Badge-없음-lightgrey)
<!-- 홍길동-badge-end -->

## 김철수
<!-- 김철수-badge-start -->
![출석뱃지](https://img.shields.io/badge/출석-0일-blue)
![XP](https://img.shields.io/badge/XP-0-yellow)
![Level](https://img.shields.io/badge/Level-1-orange)
![Badge](https://img.shields.io/badge/Badge-없음-lightgrey)
<!-- 김철수-badge-end -->



```scripts/xp.json
{
  "홍길동": {
    "xp": 0,
    "level": 1,
    "attendanceDays": 0,
    "badges": []
  },
  "김철수": {
    "xp": 0,
    "level": 1,
    "attendanceDays": 0,
    "badges": []
  },
  "이영희": {
    "xp": 0,
    "level": 1,
    "attendanceDays": 0,
    "badges": []
  }
}

```attendance.yml
name: Attendance Badge & XP System

on:
  push:
    paths:
      - "attendance/**"

permissions:
  contents: write   # ✅ 저장소에 commit/push 권한 부여            

jobs:
  update-xp-and-readme:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
        with:
          token: ${{ secrets.GITHUB_TOKEN }}   # ✅ GitHub Token 사용

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Run XP & Badge Calculation
        run: node scripts/calcXP.js

      - name: Update README
        run: node scripts/updateReadme.js

      - name: Commit changes
        run: |
          git config --global user.name 'github-actions[bot]'
          git config --global user.email 'github-actions[bot]@users.noreply.github.com'
          git add xp.json README.md
          git commit -m "Update XP, badges, and README" || echo "No changes to commit"
          git remote set-url origin https://x-access-token:${{ secrets.GITHUB_TOKEN }}@github.com/${{ github.repository }}
          git push origin HEAD:${{ github.ref }}

 