# SMIT 동아리 포털 - 자동 세팅 스크립트
# 사용법: PowerShell에서 .\setup.ps1 실행

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SMIT 동아리 포털 개발환경 자동 세팅" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Node.js 확인
Write-Host "[1/5] Node.js 확인 중..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    Write-Host "  ✅ Node.js $nodeVersion 설치됨" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Node.js가 없습니다. https://nodejs.org 에서 설치하세요." -ForegroundColor Red
    Start-Process "https://nodejs.org"
    Read-Host "Node.js 설치 후 엔터를 누르세요"
}

# 2. Git 확인
Write-Host "[2/5] Git 확인 중..." -ForegroundColor Yellow
try {
    $gitVersion = git --version 2>&1
    Write-Host "  ✅ $gitVersion 설치됨" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Git이 없습니다. https://git-scm.com 에서 설치하세요." -ForegroundColor Red
    Start-Process "https://git-scm.com"
    Read-Host "Git 설치 후 엔터를 누르세요"
}

# 3. 프로젝트 폴더 확인 및 코드 복제
Write-Host "[3/5] 프로젝트 폴더 확인 중..." -ForegroundColor Yellow
$projectPath = "C:\dev\smit-club-portal"

if (Test-Path $projectPath) {
    Write-Host "  ✅ 프로젝트 폴더 존재: $projectPath" -ForegroundColor Green
    Set-Location $projectPath
} else {
    Write-Host "  📁 폴더가 없어 GitHub에서 복제합니다..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Force -Path "C:\dev" | Out-Null
    Set-Location "C:\dev"
    git clone https://github.com/smit013/smit-club-portal.git
    Set-Location $projectPath
    Write-Host "  ✅ 복제 완료" -ForegroundColor Green
}

# 4. npm 패키지 설치
Write-Host "[4/5] 패키지 설치 중... (1~2분 소요)" -ForegroundColor Yellow
npm install
Write-Host "  ✅ 패키지 설치 완료" -ForegroundColor Green

# 5. .env.local 파일 확인
Write-Host "[5/5] 환경변수 파일 확인 중..." -ForegroundColor Yellow
$envPath = "$projectPath\.env.local"

if (Test-Path $envPath) {
    Write-Host "  ✅ .env.local 파일 존재" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  .env.local 파일이 없습니다. 템플릿을 생성합니다..." -ForegroundColor Yellow
    @"
NEXT_PUBLIC_SUPABASE_URL=https://ipuxbaltawnkertzlwgr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=여기에_anon_키_붙여넣기
SUPABASE_SERVICE_ROLE_KEY=여기에_service_role_키_붙여넣기
ADMIN_API_TOKEN=smitclub@2026
"@ | Out-File -FilePath $envPath -Encoding utf8
    Write-Host "  ✅ .env.local 템플릿 생성됨 - Supabase 키를 입력해주세요" -ForegroundColor Green
    Write-Host "     → Supabase 키 위치: https://supabase.com/dashboard/project/ipuxbaltawnkertzlwgr/settings/api" -ForegroundColor Cyan
}

# 완료
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✅ 세팅 완료!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  다음 명령어로 서버를 시작하세요:" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "  브라우저에서 열기:" -ForegroundColor White
Write-Host "  http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

$start = Read-Host "지금 바로 서버를 시작할까요? (y/n)"
if ($start -eq "y") {
    npm run dev
}
