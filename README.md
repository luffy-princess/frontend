# PHISHME Frontend

피싱 예방 교육을 위한 모바일 애플리케이션의 프론트엔드 프로젝트입니다.

## 프로젝트 구조

```
frontend/
├── assets/                # 정적 리소스
│   ├── fonts/            # Pretendard 폰트 파일
│   ├── sns-icons/        # 소셜 로그인 아이콘
│   ├── adaptive-icon.png # 앱 아이콘
│   ├── splash.png        # 스플래시 스크린 이미지
│   └── icon.png          # 앱 아이콘
├── components/           # 재사용 가능한 컴포넌트
│   ├── modals/          # 알림, 정보 등 모달 컴포넌트
│   ├── Badge.js         # 뱃지 컴포넌트
│   ├── Input.js         # 입력 필드 컴포넌트
│   ├── Select.js        # 선택 컴포넌트
│   ├── ScenarioCard.js  # 시나리오 카드 컴포넌트
│   └── TrainProgress.js # 학습 진행 상황 컴포넌트
├── screens/             # 화면 컴포넌트
│   ├── train_screens/   # 학습 관련 화면
│   ├── HomeScreen.js    # 홈 화면
│   ├── LoginScreen.js   # 로그인 화면
│   └── RegisterScreen.js # 회원가입 화면
├── hooks/               # 커스텀 React 훅
│   ├── useApi.js        # API 요청 관련 훅
│   └── useJwtUtils.js   # JWT 토큰 관리 훅
├── scripts/            # 유틸리티 스크립트
│   ├── responsive.js    # 반응형 관련 유틸
│   └── select-theme/    # 테마 관련 설정
├── android/           # 안드로이드 네이티브 코드
├── ios/              # iOS 네이티브 코드
└── store.js         # Zustand 전역 상태 관리
```

## 개발 환경 설정

### 필수 요구사항

- Node.js 14.0.0 이상
- npm 또는 yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS 개발을 위한 XCode (Mac 전용)
- 안드로이드 개발을 위한 Android Studio

### 환경 변수 설정

프로젝트 루트에 .env 파일을 생성하고 다음 환경 변수들을 설정합니다:

```
BACKEND_URL=<백엔드 서버 URL>
BACKEND_PORT=8000
IOS_CLIENT_ID=<구글 iOS 클라이언트 ID>
IOS_URL_SCHEME=<구글 iOS URL 스킴>
ANDROID_CLIENT_ID=<구글 안드로이드 클라이언트 ID>
KAKAO_APP_KEY=<카카오 앱 키>
```

### 프로젝트 설치 및 실행

1. 프로젝트 클론 및 의존성 설치

```bash
git clone <repository-url>
cd frontend
npm install
# 또는
yarn install
```

2. iOS 의존성 설치 (Mac 전용)

```bash
cd ios
pod install
cd ..
```

3. 개발 서버 실행

```bash
# Expo 개발 서버 시작
npx expo start

# iOS 시뮬레이터로 실행
npx expo run:ios

# 안드로이드 에뮬레이터로 실행
npx expo run:android
```

### 개발 빌드 생성

1. Expo 계정 로그인

```bash
npx expo login
```

2. 개발용 빌드 생성

```bash
# iOS 개발 빌드
eas build --profile development --platform ios

# 안드로이드 개발 빌드
eas build --profile development --platform android
```

## 주요 기능

- 소셜 로그인 (Google, Apple, Kakao)
- 피싱 시나리오 기반 학습
- 학습 진행 상황 추적
- 반응형 UI 지원
