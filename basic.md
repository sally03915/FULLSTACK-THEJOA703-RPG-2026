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
