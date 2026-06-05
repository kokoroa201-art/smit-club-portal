# 💻 SMIT 동아리 포털 개발환경 세팅 가이드
### 처음 하는 사람도 따라할 수 있어요!

---

## 📋 설치할 것들 목록

| 순서 | 이름 | 역할 |
|------|------|------|
| 1 | **Node.js** | 코드를 실행하는 엔진 |
| 2 | **VSCode** | 코드 편집기 (메모장의 고급 버전) |
| 3 | **Git** | 코드 버전 관리 |
| 4 | **GitHub** | 코드를 인터넷에 저장하는 창고 |
| 5 | **Claude Code** | AI 코딩 도우미 |
| 6 | **Vercel** | 웹사이트를 인터넷에 올리는 서비스 |
| 7 | **Supabase** | 데이터베이스 (신청서 저장소) |

---

## 1단계 — Node.js 설치

1. 구글에서 **"Node.js 다운로드"** 검색하거나 아래 주소 접속  
   👉 https://nodejs.org

2. 초록색 **"LTS"** 버전 버튼 클릭 → 다운로드

3. 다운받은 파일 실행 → **Next, Next, Next, Install** 클릭 (기본값 그대로)

4. 설치 완료 확인:
   - Windows 키 + R → `cmd` 입력 → 엔터
   - 검은 창에 아래 입력 후 엔터:
   ```
   node --version
   ```
   - `v20.x.x` 같은 숫자가 나오면 성공! ✅

---

## 2단계 — VSCode 설치

1. 구글에서 **"VSCode 다운로드"** 검색하거나:  
   👉 https://code.visualstudio.com

2. 파란색 **Download for Windows** 버튼 클릭

3. 다운받은 파일 실행 → 설치 진행
   - ⚠️ 설치 중에 **"PATH에 추가"** 또는 **"Add to PATH"** 체크박스가 있으면 반드시 체크!

4. VSCode 실행 → 왼쪽 사이드바에서 **확장(Extensions)** 아이콘 클릭 (네모 4개 모양)

5. 검색창에 **"Korean"** 입력 → **Korean Language Pack** 설치 (선택사항)

---

## 3단계 — Git 설치

1. 구글에서 **"Git for Windows"** 검색하거나:  
   👉 https://git-scm.com

2. **Download for Windows** 클릭 → 설치
   - 모든 옵션 기본값으로 Next → Install

3. 설치 확인:
   - cmd 창에서:
   ```
   git --version
   ```
   - `git version 2.x.x` 나오면 성공! ✅

---

## 4단계 — GitHub 계정 만들기

1. 👉 https://github.com 접속

2. **Sign up** 클릭

3. 이메일, 비밀번호, 사용자이름 입력 → 계정 생성

4. 이메일 인증 완료

5. VSCode에서 GitHub 연결:
   - VSCode 열기
   - 왼쪽 하단 **사람 아이콘** 클릭 → **GitHub으로 로그인**
   - 브라우저에서 인증 완료

---

## 5단계 — 프로젝트 폴더 만들기 & GitHub 연결

### 폴더 만들기
1. C 드라이브에 `dev` 폴더 만들기
   - 탐색기 열기 → C 드라이브 → 새 폴더 → 이름: `dev`

2. `dev` 폴더 안에 `smit-club-portal` 폴더 만들기

### GitHub에 저장소 만들기
1. https://github.com 접속 → 로그인

2. 오른쪽 상단 **+** 버튼 → **New repository** 클릭

3. Repository name: `smit-club-portal`

4. **Public** 선택 → **Create repository** 클릭

### VSCode에서 폴더 열기
1. VSCode 실행
2. **파일 → 폴더 열기** → `C:\dev\smit-club-portal` 선택
3. 상단 메뉴 **터미널 → 새 터미널** 클릭

### Git 초기 설정 (최초 1회만)
터미널에서 아래 입력 (이름과 이메일은 본인 것으로):
```bash
git config --global user.name "홍길동"
git config --global user.email "your@email.com"
```

---

## 6단계 — Claude Code 설치

1. VSCode 터미널에서 입력:
```bash
npm install -g @anthropic-ai/claude-code
```

2. 설치 완료 후:
```bash
claude
```

3. 브라우저에서 Anthropic 계정으로 로그인 → 인증 완료

4. 이제 터미널에서 `claude` 명령어로 AI 코딩 도우미 사용 가능! 🎉

---

## 7단계 — 프로젝트 코드 가져오기 (GitHub에서 복제)

GitHub에 이미 코드가 올라가 있다면:

```bash
cd C:\dev
git clone https://github.com/[계정명]/smit-club-portal.git
cd smit-club-portal
npm install
```

처음 세팅이라면 Claude에게 부탁:
```
vscode 세팅해줘
```

---

## 8단계 — Vercel 계정 만들기 & 배포

### 계정 만들기
1. 👉 https://vercel.com 접속
2. **Sign Up** → **GitHub으로 계속** 클릭
3. GitHub 계정으로 자동 연결

### 프로젝트 배포
1. Vercel 대시보드에서 **Add New → Project** 클릭
2. GitHub 저장소 목록에서 `smit-club-portal` 선택 → **Import**
3. 설정 그대로 → **Deploy** 클릭
4. 1~2분 후 `https://smit-club-portal.vercel.app` 주소로 배포 완료! 🚀

### 환경변수 설정 (중요!)
1. Vercel 대시보드 → 프로젝트 → **Settings → Environment Variables**
2. 아래 3가지 추가:

| 이름 | 값 |
|------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://ipuxbaltawnkertzlwgr.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (Supabase에서 복사) |
| `SUPABASE_SERVICE_ROLE_KEY` | (Supabase에서 복사) |
| `ADMIN_API_TOKEN` | `smitclub@2026` |

3. **Save** → **Redeploy**

---

## 9단계 — Supabase 계정 만들기 & 데이터베이스 세팅

### 계정 만들기
1. 👉 https://supabase.com 접속
2. **Start your project** → GitHub으로 로그인

### 프로젝트 만들기
1. **New project** 클릭
2. 이름: `smit-club`
3. 데이터베이스 비밀번호: 원하는 비밀번호 설정 (기억해두기!)
4. Region: **Northeast Asia (Seoul)** 선택
5. **Create new project** → 1~2분 대기

### API 키 복사
1. 프로젝트 대시보드 → **Settings → API**
2. **anon public** 키 복사 → `.env.local`에 붙여넣기
3. **service_role** 키 복사 → `.env.local`에 붙여넣기

### 데이터베이스 테이블 만들기
1. 왼쪽 메뉴 **SQL Editor** 클릭
2. **New query** 클릭
3. `schema.sql` 파일 내용 전체 복사 → 붙여넣기 → **Run**
4. `Success. No rows returned` 메시지 확인 ✅

---

## 10단계 — 로컬에서 실행하기

```bash
cd C:\dev\smit-club-portal
npm run dev
```

브라우저에서 👉 **http://localhost:3000** 열기

---

## 🔑 중요한 정보 정리

```
프로젝트 폴더: C:\dev\smit-club-portal
로컬 주소: http://localhost:3000
배포 주소: https://smit-club-portal.vercel.app
Supabase 프로젝트: https://ipuxbaltawnkertzlwgr.supabase.co
관리자 비밀번호: smitclub@2026
```

---

## ❓ 자주 생기는 문제

### "npm을 찾을 수 없다"는 오류
→ Node.js를 설치하지 않았거나 재시작이 필요합니다.
→ 컴퓨터를 껐다 켜고 다시 시도하세요.

### "포트 3000이 이미 사용 중"
→ 터미널에서:
```bash
npx kill-port 3000
npm run dev
```

### "모듈을 찾을 수 없다"는 오류
→ 터미널에서:
```bash
npm install
```

### 페이지가 스타일 없이 보일 때
→ 터미널에서:
```bash
# 캐시 삭제 후 재시작
rd /s /q .next
npm run dev
```
→ 브라우저에서 **Ctrl+Shift+R** (강제 새로고침)

---

## 📞 도움말

Claude에게 도움 요청하기:
- `"vscode 세팅해줘"` → 개발환경 전체 자동 세팅
- `"npm run dev가 안 돼"` → 실행 오류 해결
- `"Supabase 연결이 안 돼"` → DB 연결 문제 해결
- `"배포해줘"` → Vercel 배포 진행

---

*SMIT 동아리 포털 개발팀 · 서울미디어대학원대학교 원우회*
