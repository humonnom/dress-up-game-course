# Part 4-13: 마우스로 아이템 위치 조정

**강의 시간**: 7분
**핵심 목표**: 착용한 아이템을 마우스로 드래그해서 위치를 세밀하게 조정하기

---

## 🎬 인트로 (20초)

안녕하세요! Part 3까지 완료하면서 기본 게임 로직이 모두 구현되었습니다.

이번 시간부터는 사용자 경험을 개선하는 인터랙션을 추가할 거예요!

지금은 아이템을 입히면 정확히 (0, 0) 위치에 고정되죠.
이번 강의에서는 착용한 아이템을 마우스로 드래그해서 원하는 위치로 이동시키는 기능을 구현하겠습니다.

마우스 이벤트와 좌표 계산의 핵심을 배워보겠습니다!

그럼 시작해볼까요!

---

## 🖱️ 마우스 드래그의 원리 (1분)

마우스로 요소를 드래그하려면 3가지 이벤트가 필요합니다.

*[화면: 마우스 이벤트 다이어그램]*

```
1. mousedown  → 마우스 버튼을 누름
   ↓
2. mousemove  → 마우스를 움직임 (여러 번 발생)
   ↓
3. mouseup    → 마우스 버튼을 뗌
```

**드래그 플래그 패턴**:
```javascript
let isDragging = false;

mousedown → isDragging = true
mousemove → if (isDragging) { 위치 업데이트 }
mouseup   → isDragging = false
```

이 패턴은 모든 드래그 구현의 기본입니다!

---

## 📐 좌표 계산 이해하기 (1분 30초)

마우스 좌표 계산이 가장 중요합니다.

*[화면: 좌표 시각화]*

### 필요한 변수들

```javascript
let currentX = 0;    // 현재 아이템의 X 위치
let currentY = 0;    // 현재 아이템의 Y 위치
let initialX = 0;    // 드래그 시작 시 마우스 X
let initialY = 0;    // 드래그 시작 시 마우스 Y
```

### mousedown 시: 초기값 저장

```javascript
const handleMouseDown = (e) => {
  isDragging = true;
  initialX = e.clientX - currentX;
  initialY = e.clientY - currentY;
};
```

**왜 빼기를 할까요?**

*[화면: 수식 설명]*

```
아이템 위치: (100, 50)
마우스 클릭: (150, 80)

initialX = 150 - 100 = 50
→ "아이템 왼쪽 끝에서 50px 떨어진 곳을 클릭했다"
```

이 오프셋을 기억해야 드래그 시 자연스럽게 움직입니다!

### mousemove 시: 새 위치 계산

```javascript
const handleMouseMove = (e) => {
  if (!isDragging) return;

  currentX = e.clientX - initialX;
  currentY = e.clientY - initialY;

  item.style.left = `${currentX}px`;
  item.style.top = `${currentY}px`;
};
```

**계산 예시**:

```
마우스가 (200, 100)으로 이동
initialX = 50, initialY = 30

currentX = 200 - 50 = 150
currentY = 100 - 30 = 70

→ 아이템을 (150, 70)으로 이동
```

---

## 💻 addItemControls 메서드 구현 (2분 30초)

이제 실제 코드를 작성해볼게요!

```javascript
addItemControls(item, category) {
  let isDragging = false;
  let currentX = 0;
  let currentY = 0;
  let initialX = 0;
  let initialY = 0;

  // 마우스로 아이템 이동
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // 왼쪽 클릭만

    isDragging = true;
    initialX = e.clientX - currentX;
    initialY = e.clientY - currentY;

    item.style.cursor = 'grabbing';
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    e.preventDefault();
    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;

    item.style.left = `${currentX}px`;
    item.style.top = `${currentY}px`;
  };

  const handleMouseUp = () => {
    if (isDragging) {
      isDragging = false;
      item.style.cursor = 'move';
    }
  };

  // 이벤트 리스너 추가
  item.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);

  // 초기 위치 설정
  currentX = parseInt(item.style.left) || 0;
  currentY = parseInt(item.style.top) || 0;
}
```

*[화면: 코드 블록별로 나눠서 설명]*

### 블록 1: 변수 초기화

```javascript
let isDragging = false;
let currentX = 0;
let currentY = 0;
let initialX = 0;
let initialY = 0;
```

- 각 아이템마다 독립적인 상태
- 클로저로 캡슐화됨

### 블록 2: mousedown 핸들러

```javascript
const handleMouseDown = (e) => {
  if (e.button !== 0) return; // 왼쪽 클릭만
```

- `e.button === 0`: 왼쪽 버튼
- `e.button === 1`: 휠 클릭
- `e.button === 2`: 오른쪽 버튼

```javascript
  isDragging = true;
  initialX = e.clientX - currentX;
  initialY = e.clientY - currentY;
```

- 드래그 시작!
- 마우스와 아이템 사이 오프셋 계산

```javascript
  item.style.cursor = 'grabbing';
  e.preventDefault();
```

- 커서를 '잡는 손' 모양으로
- 기본 동작 방지 (텍스트 선택 등)

### 블록 3: mousemove 핸들러

```javascript
const handleMouseMove = (e) => {
  if (!isDragging) return;
```

- 드래그 중이 아니면 무시
- 성능 최적화

```javascript
  e.preventDefault();
  currentX = e.clientX - initialX;
  currentY = e.clientY - initialY;

  item.style.left = `${currentX}px`;
  item.style.top = `${currentY}px`;
```

- 새 위치 계산
- 즉시 DOM 스타일 업데이트

### 블록 4: mouseup 핸들러

```javascript
const handleMouseUp = () => {
  if (isDragging) {
    isDragging = false;
    item.style.cursor = 'move';
  }
};
```

- 드래그 종료
- 커서를 '이동 가능' 모양으로

### 블록 5: 이벤트 리스너 등록

```javascript
item.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mousemove', handleMouseMove);
document.addEventListener('mouseup', handleMouseUp);
```

**중요**: `mousemove`와 `mouseup`은 `document`에!

왜냐하면:
- 마우스가 아이템 밖으로 나가도 계속 추적
- 빠르게 드래그해도 놓치지 않음

### 블록 6: 초기 위치 설정

```javascript
currentX = parseInt(item.style.left) || 0;
currentY = parseInt(item.style.top) || 0;
```

- 기존 위치 읽어오기
- 없으면 (0, 0)

---

## 🔗 createItemOnCharacter에서 호출 (30초)

아이템을 생성할 때 이 메서드를 호출해야 합니다!

```javascript
createItemOnCharacter(sourceItem) {
  // ... 아이템 생성 로직

  // ⭐ 배치된 아이템에 이동 기능 추가
  this.addItemControls(newItem, category);

  this.characterItems.appendChild(newItem);
  this.wornItems[category] = newItem;
  this.updatePajamaVisibility();
}
```

이제 모든 착용한 아이템이 드래그 가능합니다!

---

## 🧪 테스트하기 (1분)

브라우저에서 테스트해볼까요!

*[화면: 실제로 아이템 드래그 시연]*

### 테스트 1: 기본 드래그

1. **니트를 착용**
2. **니트를 클릭하고 드래그**
   - 마우스를 따라 움직임 ✅
   - 커서가 'grabbing'으로 변경 ✅

*[화면: 개발자 도구 Elements 탭]*

```html
<img data-category="top"
     style="... left: 50px; top: 30px;">
```

위치가 실시간으로 업데이트됩니다!

### 테스트 2: 여러 아이템

1. **니트 착용 → 위로 이동**
2. **청바지 착용 → 아래로 이동**
3. **헤드셋 착용 → 오른쪽으로 이동**

*[화면: 각 아이템이 독립적으로 움직이는 모습]*

각 아이템의 상태가 독립적입니다! ✅

### 테스트 3: 경계 밖으로

마우스를 캐릭터 영역 밖으로 빠르게 움직여도:
- 계속 추적됨 ✅
- 드래그가 끊기지 않음 ✅

`document`에 이벤트를 달았기 때문!

---

## 🎨 커서 스타일 추가 (30초)

CSS에 커서 스타일을 추가하면 더 좋습니다.

```css
.placed-item {
  cursor: move;
}

.placed-item:active {
  cursor: grabbing;
}
```

하지만 JavaScript에서 동적으로 제어하는 게 더 정확합니다!

```javascript
item.style.cursor = 'move';     // 기본
item.style.cursor = 'grabbing'; // 드래그 중
```

---

## 📝 마무리 및 다음 강의 예고 (20초)

오늘은 마우스 드래그로 아이템 위치를 조정하는 기능을 구현했습니다!

핵심은:
- 드래그 플래그 패턴 (isDragging)
- 초기 오프셋 계산 (initialX/Y)
- 상대 좌표로 위치 업데이트
- document에 mousemove/mouseup 등록
- 클로저로 상태 캡슐화

다음 시간에는 아이템을 영역 밖으로 드래그하면 자동으로 삭제되는 기능을 추가할 거예요!
`getBoundingClientRect()`로 영역을 판단하는 방법을 배워보겠습니다.

그럼 다음 강의에서 만나요!

---

## 💻 전체 코드

### js/app.js - addItemControls 메서드 (Part 4-13 완성)

```javascript
addItemControls(item, category) {
  let isDragging = false;
  let currentX = 0;
  let currentY = 0;
  let initialX = 0;
  let initialY = 0;

  // 마우스로 아이템 이동
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // 왼쪽 클릭만

    isDragging = true;
    initialX = e.clientX - currentX;
    initialY = e.clientY - currentY;

    item.style.cursor = 'grabbing';
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    e.preventDefault();
    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;

    item.style.left = `${currentX}px`;
    item.style.top = `${currentY}px`;
  };

  const handleMouseUp = () => {
    if (isDragging) {
      isDragging = false;
      item.style.cursor = 'move';
    }
  };

  // 이벤트 리스너 추가
  item.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);

  // 초기 위치 설정
  currentX = parseInt(item.style.left) || 0;
  currentY = parseInt(item.style.top) || 0;
}
```

### js/app.js - createItemOnCharacter에서 호출

```javascript
createItemOnCharacter(sourceItem) {
  // ... 아이템 생성 로직

  // 원본 아이템 참조 저장
  newItem.sourceItem = sourceItem;

  // ⭐ 배치된 아이템에 이동 기능 추가
  this.addItemControls(newItem, category);

  // DOM에 추가
  this.characterItems.appendChild(newItem);

  // 현재 카테고리에 착용한 아이템으로 등록
  this.wornItems[category] = newItem;

  // 파자마 표시 업데이트
  this.updatePajamaVisibility();
}
```

---

## 💡 핵심 요약

- ✅ 드래그 플래그 패턴: `isDragging` 상태로 제어
- ✅ 초기 오프셋 계산: `e.clientX - currentX`
- ✅ 상대 좌표로 위치 업데이트: `e.clientX - initialX`
- ✅ `document`에 `mousemove`/`mouseup` 등록
- ✅ 클로저로 각 아이템의 상태 독립적으로 관리
- ✅ `e.preventDefault()`로 텍스트 선택 방지

**다음 강의**: 영역 밖 드래그로 아이템 삭제

---

## 🎓 추가 학습

**마우스 이벤트 종류**:
```javascript
element.addEventListener('mousedown', ...);  // 버튼 누름
element.addEventListener('mouseup', ...);    // 버튼 뗌
element.addEventListener('mousemove', ...);  // 마우스 이동
element.addEventListener('click', ...);      // 클릭 (down + up)
element.addEventListener('dblclick', ...);   // 더블클릭
element.addEventListener('mouseenter', ...); // 요소 안으로 진입
element.addEventListener('mouseleave', ...); // 요소 밖으로 나감
```

**마우스 버튼 구분**:
```javascript
e.button === 0  // 왼쪽 (주 버튼)
e.button === 1  // 휠 (보조 버튼)
e.button === 2  // 오른쪽 (부 버튼)
```

**마우스 좌표 종류**:
```javascript
e.clientX  // 뷰포트 기준 X (스크롤 무시)
e.clientY  // 뷰포트 기준 Y

e.pageX    // 문서 전체 기준 X (스크롤 포함)
e.pageY    // 문서 전체 기준 Y

e.offsetX  // 이벤트 타겟 요소 기준 X
e.offsetY  // 이벤트 타겟 요소 기준 Y

e.screenX  // 모니터 화면 기준 X
e.screenY  // 모니터 화면 기준 Y
```

**클로저 활용**:
```javascript
function createCounter() {
  let count = 0;  // 프라이빗 변수

  return {
    increment() { count++; },
    getCount() { return count; }
  };
}

const counter1 = createCounter();
const counter2 = createCounter();
// 각각 독립적인 count 변수
```

우리 코드에서:
```javascript
addItemControls(item) {
  let isDragging = false;  // 각 아이템마다 독립적인 상태

  const handleMouseDown = (e) => {
    isDragging = true;  // 클로저로 접근
  };

  item.addEventListener('mousedown', handleMouseDown);
}
```

**드래그 성능 최적화**:
```javascript
// 나쁜 예: 매번 DOM 접근
const handleMouseMove = (e) => {
  const item = document.getElementById('item');
  item.style.left = e.clientX + 'px';
};

// 좋은 예: 참조 저장
const item = document.getElementById('item');
const handleMouseMove = (e) => {
  item.style.left = e.clientX + 'px';
};
```

**requestAnimationFrame 활용** (선택):
```javascript
const handleMouseMove = (e) => {
  if (!isDragging) return;

  requestAnimationFrame(() => {
    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;
    item.style.left = `${currentX}px`;
    item.style.top = `${currentY}px`;
  });
};
```

**터치 이벤트 지원** (모바일):
```javascript
// 마우스 + 터치 모두 지원
item.addEventListener('mousedown', handleStart);
item.addEventListener('touchstart', handleStart);

function handleStart(e) {
  const clientX = e.clientX || e.touches[0].clientX;
  const clientY = e.clientY || e.touches[0].clientY;
  // ...
}
```
