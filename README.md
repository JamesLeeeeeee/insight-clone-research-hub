# 프로젝트 정보

이 프로젝트는 React와 TypeScript를 사용한 웹 애플리케이션입니다.

## 코드 편집 방법

### 로컬 환경에서 개발하기

로컬에서 개발하려면 Node.js와 npm이 설치되어 있어야 합니다.

### Node.js & npm 설치하기

#### Mac에서 설치

**방법 1: Homebrew 사용 (권장)**
1. Homebrew가 없다면 먼저 설치:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
2. Node.js 설치 (npm 포함):
```bash
brew install node
```

**방법 2: nvm 사용**
1. nvm 설치:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```
2. 터미널 재시작 또는 다음 명령어 실행:
```bash
source ~/.bashrc
```
3. 최신 LTS 버전 Node.js 설치:
```bash
nvm install --lts
nvm use --lts
```

#### Windows에서 설치

**방법 1: 공식 웹사이트에서 설치 (권장)**
1. [Node.js 공식 웹사이트](https://nodejs.org/)에서 LTS 버전 다운로드
2. 다운로드한 `.msi` 파일 실행하여 설치

**방법 2: Chocolatey 사용**
1. PowerShell을 관리자 권한으로 실행
2. Chocolatey가 없다면 먼저 설치:
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```
3. Node.js 설치:
```powershell
choco install nodejs
```

**방법 3: nvm-windows 사용**
1. [nvm-windows 릴리즈 페이지](https://github.com/coreybutler/nvm-windows/releases)에서 `nvm-setup.zip` 다운로드
2. 압축 해제 후 `nvm-setup.exe` 실행
3. 명령 프롬프트에서 최신 LTS 버전 설치:
```cmd
nvm install lts
nvm use lts
```

**설치 확인:**
```bash
node --version
npm --version
```

### 개발 시작하기

다음 단계를 따라하세요:

```sh
# 1단계: 저장소 클론
git clone <YOUR_GIT_URL>

# 2단계: 프로젝트 디렉토리로 이동
cd <YOUR_PROJECT_NAME>

# 3단계: 의존성 설치
npm i

# 4단계: 개발 서버 시작
npm run dev
```

### GitHub에서 직접 편집하기

- 편집하고 싶은 파일로 이동
- 파일 우측 상단의 "Edit" 버튼(연필 아이콘) 클릭
- 변경사항 작성 후 커밋

### GitHub Codespaces 사용하기

- 저장소 메인 페이지로 이동
- 우측 상단의 "Code" 버튼(초록색) 클릭
- "Codespaces" 탭 선택
- "New codespace"를 클릭하여 새로운 Codespace 환경 실행
- Codespace에서 직접 파일을 편집하고 완료되면 변경사항을 커밋 및 푸시

## 사용된 기술

이 프로젝트는 다음 기술들로 구축되었습니다:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## 프로젝트 배포

프로젝트를 배포하려면 다음 명령어를 사용하세요:

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.