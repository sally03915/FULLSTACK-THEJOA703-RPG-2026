// scripts/initData.js
const fs = require("fs");

const students = ["홍길동", "김철수", "이영희"];
let xpData = {};

students.forEach(name => {
  xpData[name] = { xp: 0, level: 1, attendanceDays: 0, badges: [] };
});

fs.writeFileSync("xp.json", JSON.stringify(xpData, null, 2));
console.log("✅ xp.json 초기화 완료!");
