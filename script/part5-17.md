# Part 5-17: 시각적 피드백 추가

**강의 시간**: 4분
**핵심 목표**: 드래그, 호버, 드롭 영역 등에 시각적 효과를 추가하여 사용자 경험 개선하기

---

## 🎬 인트로 (15초)

안녕하세요! 지금까지 게임의 모든 기능을 구현했습니다.

마지막으로 사용자 경험을 더 좋게 만들 거예요!

사용자가 뭔가 액션을 할 때 시각적 피드백이 있으면 훨씬 자연스럽죠.
드래그 시 효과, 호버 효과, 드롭 영역 하이라이트 등을 추가하겠습니다.

대부분 CSS만으로 가능합니다!

그럼 시작해볼까요!

---

## 🎨 아이템 호버 효과 (40초)

아이템 보드의 아이템에 마우스를 올리면 반응하도록 만듭시다.

### CSS 추가

```css
.item {
  width: 120px;
  height: auto;
  padding: 10px;
  background: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: grab;
  transition: all 0.2s ease; /* 부드러운 전환 */
}

.item:hover {
  transform: scale(1.05);           /* 5% 크기 증가 */
  border-color: #4CAF50;            /* 초록색 테두리 */
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3); /* 그림자 */
}
```

*[화면: 호버 효과 시연]*

**효과**:
- 마우스 올리면: 살짝 커지고 초록 테두리
- 마우스 내리면: 원래대로

**`transition`**:
- `all`: 모든 속성 변화
- `0.2s`: 0.2초 동안
- `ease`: 부드럽게

---

## 🖱️ 드래그 중 시각 효과 (50초)

아이템을 드래그할 때 원본은 흐릿하게 만듭시다.

### CSS 추가

```css
.item.dragging {
  opacity: 0.5;          /* 반투명 */
  cursor: grabbing;      /* 잡는 손 모양 */
  transform: scale(1.1); /* 약간 확대 */
}
```

### JavaScript에서 클래스 추가

이미 구현되어 있습니다!

```javascript
handleDragStart(e, fromBoard = false) {
  this.draggedElement = e.currentTarget;
  this.isDraggingFromBoard = fromBoard;

  // ⭐ dragging 클래스 추가
  e.currentTarget.classList.add('dragging');
  this.characterArea.classList.add('drag-over');

  e.dataTransfer.effectAllowed = 'move';
}

handleDragEnd(e) {
  // ⭐ dragging 클래스 제거
  e.target.classList.remove('dragging');
  this.characterArea.classList.remove('drag-over');
}
```

*[화면: 드래그 시 아이템이 흐릿해지는 모습]*

---

## 📦 드롭 영역 하이라이트 (50초)

캐릭터 영역 위로 드래그하면 테두리가 빛나도록 만듭시다.

### CSS 추가

```css
.character-area {
  transition: all 0.3s ease;
}

.character-area.drag-over {
  border: 3px dashed #4CAF50;     /* 점선 테두리 */
  background-color: rgba(76, 175, 80, 0.05); /* 연한 초록 배경 */
  box-shadow: 0 0 20px rgba(76, 175, 80, 0.3); /* 빛나는 효과 */
}
```

*[화면: 드래그 중 캐릭터 영역 하이라이트]*

**이미 JavaScript에서 처리 중**:
```javascript
handleDragStart(e) {
  // ...
  this.characterArea.classList.add('drag-over');
}

handleDragEnd(e) {
  this.characterArea.classList.remove('drag-over');
}

handleDragLeave(e) {
  if (e.target === this.characterArea) {
    this.characterArea.classList.remove('drag-over');
  }
}
```

---

## 👆 커서 스타일 개선 (30초)

다양한 상황에 맞는 커서를 보여줍시다.

### CSS 추가

```css
/* 아이템 보드 아이템 */
.item {
  cursor: grab; /* 잡을 수 있는 손 */
}

.item:active {
  cursor: grabbing; /* 잡고 있는 손 */
}

/* 캐릭터에 착용한 아이템 */
.placed-item {
  cursor: move; /* 이동 가능 */
}

.placed-item:active {
  cursor: grabbing; /* 잡고 있는 손 */
}

/* 캐릭터 영역 */
.character-area {
  cursor: default; /* 기본 커서 */
}

.character-area.drag-over {
  cursor: copy; /* 복사 (드롭 가능) */
}
```

*[화면: 다양한 커서 모양 시연]*

---

## ✨ 배치된 아이템 스타일 (30초)

캐릭터에 입힌 아이템도 스타일을 추가합시다.

### CSS 추가

```css
.placed-item {
  position: absolute;
  width: 100%;
  height: auto;
  cursor: move;
  transition: opacity 0.2s ease;
}

.placed-item:hover {
  opacity: 0.9; /* 약간 투명 */
}

/* 그룹 아이템 (백팩 등) */
.placed-group {
  position: absolute;
  left: 0;
  top: 0;
  cursor: move;
}
```

---

## 🧪 테스트하기 (30초)

브라우저에서 모든 효과를 확인해볼까요!

*[화면: 순서대로 시연]*

### 테스트 1: 호버 효과

**아이템 보드의 니트에 마우스 올리기**

*[화면: 니트가 살짝 커지고 초록 테두리]*

```css
transform: scale(1.05);
border-color: #4CAF50;
box-shadow: ...;
```

자연스럽게 반응합니다! ✅

### 테스트 2: 드래그 효과

**니트를 드래그하기**

*[화면: 니트가 흐릿해지고 확대]*

```css
opacity: 0.5;
transform: scale(1.1);
```

드래그 중임을 알 수 있습니다! ✅

### 테스트 3: 드롭 영역 하이라이트

**캐릭터 영역 위로 드래그**

*[화면: 캐릭터 영역이 초록색 점선으로 빛남]*

```css
border: 3px dashed #4CAF50;
background-color: rgba(76, 175, 80, 0.05);
```

어디에 드롭할 수 있는지 명확합니다! ✅

### 테스트 4: 착용 아이템 호버

**착용한 니트에 마우스 올리기**

*[화면: 커서가 'move'로 변경]*

```css
cursor: move;
```

이동 가능함을 알 수 있습니다! ✅

---

## 🎨 추가 개선 아이디어 (20초)

더 멋지게 만들 수 있는 아이디어들:

### 1. 아이템 삭제 애니메이션

```css
.placed-item.removing {
  animation: fadeOut 0.3s ease-out;
}

@keyframes fadeOut {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.5);
  }
}
```

### 2. 아이템 추가 애니메이션

```css
.placed-item.adding {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
```

---

## 📝 마무리 및 다음 강의 예고 (15초)

오늘은 시각적 피드백을 추가했습니다!

핵심은:
- `:hover`로 호버 효과
- `transition`으로 부드러운 전환
- 클래스로 드래그 상태 표시
- 다양한 커서 스타일
- `transform`, `opacity`, `box-shadow` 활용

Part 5가 완성되었습니다! 이제 게임이 훨씬 전문적으로 보입니다.

마지막 강의에서는 전체 프로젝트를 요약하고, 추가로 만들 수 있는 기능들을 소개하겠습니다.

그럼 다음 강의에서 만나요!

---

## 💻 전체 코드

### css/style.css - 시각적 피드백 (Part 5-17 완성)

```css
/* 아이템 기본 스타일 */
.item {
  width: 120px;
  height: auto;
  padding: 10px;
  background: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: grab;
  transition: all 0.2s ease;
}

/* 호버 효과 */
.item:hover {
  transform: scale(1.05);
  border-color: #4CAF50;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

/* 드래그 중 */
.item.dragging {
  opacity: 0.5;
  cursor: grabbing;
  transform: scale(1.1);
}

.item:active {
  cursor: grabbing;
}

/* 캐릭터 영역 */
.character-area {
  transition: all 0.3s ease;
}

/* 드롭 가능 영역 하이라이트 */
.character-area.drag-over {
  border: 3px dashed #4CAF50;
  background-color: rgba(76, 175, 80, 0.05);
  box-shadow: 0 0 20px rgba(76, 175, 80, 0.3);
}

/* 배치된 아이템 */
.placed-item {
  position: absolute;
  width: 100%;
  height: auto;
  cursor: move;
  transition: opacity 0.2s ease;
}

.placed-item:hover {
  opacity: 0.9;
}

.placed-item:active {
  cursor: grabbing;
}

/* 그룹 아이템 */
.placed-group {
  position: absolute;
  left: 0;
  top: 0;
  cursor: move;
}
```

---

## 💡 핵심 요약

- ✅ `:hover` 가상 클래스로 호버 효과
- ✅ `transition`으로 부드러운 전환 효과
- ✅ `.dragging` 클래스로 드래그 상태 표시
- ✅ `.drag-over` 클래스로 드롭 영역 하이라이트
- ✅ `cursor` 속성으로 상황별 커서 변경
- ✅ `transform`, `opacity`, `box-shadow` 조합

**다음 강의**: 마무리 및 추가 아이디어

---

## 🎓 추가 학습

**CSS 가상 클래스**:
```css
/* 마우스 올림 */
:hover { }

/* 클릭 중 */
:active { }

/* 포커스 */
:focus { }

/* 첫 번째 자식 */
:first-child { }

/* 마지막 자식 */
:last-child { }

/* n번째 자식 */
:nth-child(2) { }
:nth-child(odd) { }    /* 홀수 */
:nth-child(even) { }   /* 짝수 */
```

**transition 상세**:
```css
/* 단축 속성 */
transition: property duration timing-function delay;

/* 예시 */
transition: all 0.3s ease;
transition: transform 0.2s ease-in-out 0.1s;

/* 개별 속성 */
transition-property: transform;    /* 어떤 속성 */
transition-duration: 0.3s;         /* 지속 시간 */
transition-timing-function: ease;  /* 속도 곡선 */
transition-delay: 0.1s;            /* 지연 */

/* 여러 속성 */
transition:
  transform 0.3s ease,
  opacity 0.2s linear,
  background-color 0.5s ease-in-out;
```

**transform 종류**:
```css
/* 이동 */
transform: translate(10px, 20px);
transform: translateX(10px);
transform: translateY(20px);

/* 크기 조정 */
transform: scale(1.2);        /* 120% */
transform: scale(0.8);        /* 80% */
transform: scaleX(1.5);       /* 가로만 */

/* 회전 */
transform: rotate(45deg);
transform: rotate(-90deg);

/* 기울이기 */
transform: skew(10deg, 20deg);

/* 조합 */
transform: translate(10px, 10px) scale(1.1) rotate(5deg);
```

**box-shadow 상세**:
```css
/* 기본 문법 */
box-shadow: x y blur spread color;

/* 예시 */
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

/* 여러 그림자 */
box-shadow:
  0 2px 4px rgba(0, 0, 0, 0.1),
  0 4px 8px rgba(0, 0, 0, 0.15);

/* 내부 그림자 */
box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);

/* 빛나는 효과 */
box-shadow: 0 0 20px rgba(76, 175, 80, 0.5);
```

**커서 종류**:
```css
cursor: auto;       /* 기본 */
cursor: default;    /* 화살표 */
cursor: pointer;    /* 손가락 */
cursor: move;       /* 십자 화살표 */
cursor: grab;       /* 잡을 수 있는 손 */
cursor: grabbing;   /* 잡고 있는 손 */
cursor: text;       /* I 빔 */
cursor: not-allowed; /* 금지 */
cursor: wait;       /* 로딩 */
cursor: help;       /* 물음표 */

/* 커스텀 커서 */
cursor: url('cursor.png'), auto;
```

**성능 최적화 팁**:
```css
/* GPU 가속 속성 (성능 좋음) */
transform: ...;
opacity: ...;

/* CPU 속성 (성능 나쁨) */
width: ...;
height: ...;
left: ...;
top: ...;
margin: ...;

/* 좋은 예 */
.item {
  transform: translateX(100px); /* GPU 가속 */
}

/* 나쁜 예 */
.item {
  left: 100px; /* 리플로우 발생 */
}
```

**will-change 힌트**:
```css
/* 브라우저에게 변경될 속성 미리 알림 */
.item {
  will-change: transform, opacity;
}

/* 애니메이션 후 제거 */
.item.animating {
  will-change: transform;
}

.item:not(.animating) {
  will-change: auto;
}
```

**접근성 고려**:
```css
/* 포커스 아웃라인 (키보드 사용자) */
.item:focus {
  outline: 2px solid #4CAF50;
  outline-offset: 2px;
}

/* 고대비 모드 지원 */
@media (prefers-contrast: high) {
  .item:hover {
    border-width: 3px;
  }
}

/* 모션 민감성 */
@media (prefers-reduced-motion: reduce) {
  .item {
    transition: none;
  }
}
```

**다크 모드 지원**:
```css
/* 라이트 모드 */
.item {
  background: white;
  color: black;
}

/* 다크 모드 */
@media (prefers-color-scheme: dark) {
  .item {
    background: #333;
    color: white;
    border-color: #555;
  }

  .item:hover {
    border-color: #4CAF50;
  }
}
```
