# Part 5-15: 로딩 화면 만들기 (기본)

**강의 시간**: 5분
**핵심 목표**: CSS 애니메이션으로 회전하는 스피너를 만들고 setTimeout으로 로딩 화면 제어하기

---

## 🎬 인트로 (15초)

안녕하세요! Part 4까지 완료하면서 게임의 핵심 기능이 모두 구현되었습니다.

이번 파트에서는 사용자 경험(UX)을 개선할 거예요!

페이지를 열면 바로 아이템이 보이는 게 아니라, 잠깐 로딩 화면을 보여주는 게 더 전문적이죠.
이번 시간에는 CSS 애니메이션으로 회전하는 스피너를 만들고, 일정 시간 후 자동으로 사라지게 하겠습니다.

그럼 시작해볼까요!

---

## 🎨 로딩 화면 디자인 (30초)

로딩 화면에는 무엇이 필요할까요?

*[화면: 로딩 화면 목업]*

```
┌─────────────────┐
│                 │
│      ⟳        │  ← 회전하는 스피너
│                 │
│ 아이템 로딩 중... │  ← 안내 문구
│                 │
└─────────────────┘
```

**구성 요소**:
1. 회전하는 원 (스피너)
2. 안내 문구
3. 가운데 정렬된 레이아웃

---

## 📝 HTML 구조 추가 (40초)

아이템 보드 안에 로딩 화면을 추가합니다.

```html
<div class="item-board">
  <!-- 로딩 화면 -->
  <div id="loading-screen" class="loading-screen">
    <div class="loading-spinner"></div>
    <p>아이템 로딩 중...</p>
  </div>

  <!-- 실제 아이템 보드 내용 (처음엔 숨김) -->
  <div id="item-board-content" class="item-board-content" style="display: none;">
    <!-- 기존 아이템들 -->
  </div>
</div>
```

*[화면: HTML 구조 다이어그램]*

```
item-board
├── loading-screen (처음에 보임)
│   ├── loading-spinner (회전하는 원)
│   └── p (텍스트)
└── item-board-content (처음엔 숨김)
    └── 아이템들...
```

**핵심**:
- `loading-screen`: 로딩 UI
- `item-board-content`: 실제 컨텐츠 (처음엔 `display: none`)

---

## 🎨 CSS 스타일링 (1분 30초)

이제 CSS로 스타일을 만들어봅시다!

### 1. 로딩 화면 레이아웃

```css
.loading-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
}
```

*[화면: Flexbox 정렬 시각화]*

- `flex-direction: column`: 세로로 배치
- `align-items: center`: 가로 중앙
- `justify-content: center`: 세로 중앙

### 2. 스피너 모양

```css
.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;        /* 회색 테두리 */
  border-top: 5px solid #4CAF50;    /* 위쪽만 초록색 */
  border-radius: 50%;                /* 원 모양 */
  animation: spin 1s linear infinite; /* 애니메이션 */
}
```

*[화면: 스피너 구조 설명]*

```
┌─────────┐
│   🟢    │  ← border-top (초록)
│ ⚪   ⚪ │  ← border-left/right (회색)
│   ⚪    │  ← border-bottom (회색)
└─────────┘
```

**왜 한쪽만 색이 다를까요?**
- 회전하면 한쪽이 도는 것처럼 보여요!
- 모두 같은 색이면 회전이 안 보임

### 3. 회전 애니메이션

```css
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
```

*[화면: 애니메이션 단계별 설명]*

```
0%    → rotate(0deg)     ─   (0도)
25%   → rotate(90deg)    |   (90도)
50%   → rotate(180deg)   ─   (180도)
75%   → rotate(270deg)   |   (270도)
100%  → rotate(360deg)   ─   (360도, 한 바퀴)
```

**애니메이션 속성**:
- `spin`: 애니메이션 이름
- `1s`: 1초 동안
- `linear`: 일정한 속도
- `infinite`: 무한 반복

### 4. 텍스트 스타일

```css
.loading-screen p {
  margin-top: 20px;
  color: #555;
  font-size: 16px;
  font-weight: 500;
}
```

간단하지만 깔끔합니다!

---

## 💻 JavaScript로 로딩 제어 (1분 30초)

일정 시간 후 로딩 화면을 숨기고 아이템 보드를 보여줍시다.

### DOMContentLoaded 이벤트에서 처리

```javascript
document.addEventListener('DOMContentLoaded', () => {
  // 게임 초기화
  new DressUpGame();

  // 2초 후 로딩 화면 숨기기
  setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    const itemBoardContent = document.getElementById('item-board-content');

    if (loadingScreen && itemBoardContent) {
      loadingScreen.style.display = 'none';
      itemBoardContent.style.display = 'block';
    }
  }, 2000);
});
```

*[화면: 코드 단계별 설명]*

### setTimeout 이해하기

```javascript
setTimeout(() => {
  // 이 코드는 2초 후에 실행됨
}, 2000);
```

**매개변수**:
- 첫 번째: 실행할 함수
- 두 번째: 지연 시간 (밀리초, 1000ms = 1초)

### 요소 표시/숨김

```javascript
loadingScreen.style.display = 'none';    // 숨김
itemBoardContent.style.display = 'block'; // 표시
```

**타임라인**:
```
0초     → 로딩 화면 보임
 |
 | (2초 대기)
 |
2초     → 로딩 화면 숨김 + 아이템 보드 표시
```

---

## 🧪 테스트하기 (30초)

브라우저에서 테스트해볼까요!

*[화면: 실제 로딩 화면 동작 시연]*

### 테스트 순서

1. **페이지 새로고침 (F5)**

*[화면: 로딩 화면이 나타남]*

```
⟳
아이템 로딩 중...
```

스피너가 빙글빙글 돕니다! ✅

2. **2초 대기**

*[화면: 2초 카운트다운]*

```
1... 2...
```

3. **아이템 보드 표시**

*[화면: 로딩 화면 사라지고 아이템들이 나타남]*

모든 아이템이 보입니다! ✅

### 개발자 도구로 확인

*[화면: Elements 탭]*

**로딩 중**:
```html
<div id="loading-screen" style="display: block;">...</div>
<div id="item-board-content" style="display: none;">...</div>
```

**로딩 완료**:
```html
<div id="loading-screen" style="display: none;">...</div>
<div id="item-board-content" style="display: block;">...</div>
```

---

## 🎨 추가 개선 아이디어 (20초)

더 부드럽게 만들려면 페이드 효과를 추가할 수 있어요!

```css
.loading-screen {
  transition: opacity 0.3s;
}

.loading-screen.fade-out {
  opacity: 0;
}
```

```javascript
setTimeout(() => {
  loadingScreen.classList.add('fade-out');

  // 페이드 아웃 완료 후 숨김
  setTimeout(() => {
    loadingScreen.style.display = 'none';
    itemBoardContent.style.display = 'block';
  }, 300);
}, 2000);
```

더 자연스럽죠!

---

## 📝 마무리 및 다음 강의 예고 (15초)

오늘은 CSS 애니메이션으로 로딩 화면을 만들었습니다!

핵심은:
- `@keyframes`로 회전 애니메이션
- `border`와 `border-radius`로 스피너 모양
- `setTimeout`으로 일정 시간 후 실행
- `display: none/block`으로 표시 전환

다음 시간에는 더 실용적으로 업그레이드할 거예요!
고정된 2초가 아니라, 실제로 모든 이미지가 로드될 때까지 기다리는 방법을 배우겠습니다.
Promise와 비동기 처리를 다뤄볼 거예요!

그럼 다음 강의에서 만나요!

---

## 💻 전체 코드

### index.html - 로딩 화면 추가 (Part 5-15)

```html
<div class="item-board">
  <!-- 로딩 화면 -->
  <div id="loading-screen" class="loading-screen">
    <div class="loading-spinner"></div>
    <p>아이템 로딩 중...</p>
  </div>

  <!-- 실제 아이템 보드 내용 -->
  <div id="item-board-content" class="item-board-content" style="display: none;">
    <!-- 아이템들... -->
  </div>
</div>
```

### css/style.css - 로딩 화면 스타일 (Part 5-15)

```css
/* 로딩 화면 */
.loading-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-screen p {
  margin-top: 20px;
  color: #555;
  font-size: 16px;
  font-weight: 500;
}
```

### js/app.js - 로딩 제어 (Part 5-15)

```javascript
document.addEventListener('DOMContentLoaded', () => {
  // 게임 초기화
  new DressUpGame();

  // 2초 후 로딩 화면 숨기기
  setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    const itemBoardContent = document.getElementById('item-board-content');

    if (loadingScreen && itemBoardContent) {
      loadingScreen.style.display = 'none';
      itemBoardContent.style.display = 'block';
    }
  }, 2000);
});
```

---

## 💡 핵심 요약

- ✅ `@keyframes`로 회전 애니메이션 정의
- ✅ `border` + `border-radius`로 원형 스피너
- ✅ `animation: spin 1s linear infinite`로 무한 회전
- ✅ Flexbox로 중앙 정렬
- ✅ `setTimeout`으로 2초 지연 실행
- ✅ `display: none/block`으로 표시 전환

**다음 강의**: 이미지 로드 완료 감지 (심화)

---

## 🎓 추가 학습

**@keyframes 문법**:
```css
/* 2단계 애니메이션 */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 다단계 애니메이션 */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* 여러 속성 동시에 */
@keyframes fadeSlide {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**animation 속성 상세**:
```css
.element {
  /* 단축 속성 */
  animation: name duration timing-function delay iteration-count direction fill-mode;

  /* 예시들 */
  animation: spin 1s linear infinite;
  animation: fadeIn 0.5s ease-in-out;
  animation: bounce 2s ease-in-out 1s 3;

  /* 개별 속성 */
  animation-name: spin;              /* 키프레임 이름 */
  animation-duration: 1s;            /* 지속 시간 */
  animation-timing-function: linear; /* ease, ease-in, ease-out, linear */
  animation-delay: 0s;               /* 시작 지연 */
  animation-iteration-count: infinite; /* 반복 횟수 (숫자 또는 infinite) */
  animation-direction: normal;       /* normal, reverse, alternate */
  animation-fill-mode: none;         /* forwards, backwards, both */
}
```

**타이밍 함수**:
```css
/* 기본 함수들 */
linear         /* 일정한 속도 */
ease           /* 천천히 → 빠르게 → 천천히 (기본값) */
ease-in        /* 천천히 시작 */
ease-out       /* 천천히 끝 */
ease-in-out    /* 천천히 시작하고 끝 */

/* 커스텀 베지어 곡선 */
cubic-bezier(0.42, 0, 0.58, 1)

/* 스텝 함수 */
steps(4, end)  /* 4단계로 나눠서 */
```

**여러 애니메이션 동시 적용**:
```css
.element {
  animation:
    spin 2s linear infinite,
    pulse 1s ease-in-out infinite;
}
```

**setTimeout vs setInterval**:
```javascript
// setTimeout: 한 번만 실행
setTimeout(() => {
  console.log('2초 후 실행');
}, 2000);

// setInterval: 반복 실행
const intervalId = setInterval(() => {
  console.log('2초마다 실행');
}, 2000);

// 멈추기
clearInterval(intervalId);
```

**스피너 디자인 변형**:
```css
/* 두꺼운 스피너 */
.spinner-thick {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #4CAF50;
}

/* 점 스피너 */
.spinner-dots {
  border: 5px dotted #4CAF50;
}

/* 이중 스피너 */
.spinner-double {
  border: 5px double #4CAF50;
}

/* 그라데이션 스피너 */
.spinner-gradient {
  border: 5px solid transparent;
  border-top: 5px solid #4CAF50;
  border-right: 5px solid rgba(76, 175, 80, 0.5);
}
```

**접근성 고려**:
```html
<div class="loading-screen" role="status" aria-live="polite">
  <div class="loading-spinner" aria-hidden="true"></div>
  <p>아이템 로딩 중...</p>
</div>
```

**prefers-reduced-motion** (모션 민감성):
```css
@media (prefers-reduced-motion: reduce) {
  .loading-spinner {
    animation: none; /* 애니메이션 비활성화 */
    /* 대신 깜빡임이나 페이드 사용 */
  }
}
```
