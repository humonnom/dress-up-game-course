# Part 4-14: 영역 밖 드래그로 아이템 삭제

**강의 시간**: 6분
**핵심 목표**: 아이템을 캐릭터 영역 밖으로 드래그하면 자동으로 삭제되도록 구현하기

---

## 🎬 인트로 (15초)

안녕하세요! 지난 시간에는 마우스 드래그로 아이템 위치를 조정했습니다.

이번 시간에는 더 직관적인 삭제 방법을 추가할 거예요!

아이템을 캐릭터 영역 밖으로 드래그하면 자동으로 삭제되도록 만들겠습니다.
`getBoundingClientRect()`로 요소의 위치를 확인하는 방법을 배워보겠습니다.

그럼 시작해볼까요!

---

## 📍 getBoundingClientRect() 이해하기 (1분)

요소의 위치와 크기를 알려주는 메서드입니다.

*[화면: getBoundingClientRect 시각화]*

```javascript
const rect = element.getBoundingClientRect();

console.log(rect);
// {
//   x: 100,       // 왼쪽 끝 X 좌표
//   y: 50,        // 위쪽 끝 Y 좌표
//   width: 300,   // 너비
//   height: 200,  // 높이
//   top: 50,      // 위쪽 끝 (y와 같음)
//   right: 400,   // 오른쪽 끝 (x + width)
//   bottom: 250,  // 아래쪽 끝 (y + height)
//   left: 100     // 왼쪽 끝 (x와 같음)
// }
```

*[화면: 캐릭터 영역의 rect 예시]*

```javascript
const characterRect = this.characterArea.getBoundingClientRect();

// 예: 캐릭터 영역이 화면 중앙에 있다면
// {
//   left: 200,
//   right: 600,
//   top: 100,
//   bottom: 700
// }
```

이 정보로 "영역 안/밖"을 판단할 수 있습니다!

---

## 🎯 영역 밖 판단 로직 (1분 30초)

아이템이 영역 밖에 있는지 어떻게 알 수 있을까요?

*[화면: 4가지 경우 다이어그램]*

```
[캐릭터 영역]

1. 완전히 왼쪽      2. 완전히 오른쪽
   [아이템]            [캐릭터]  [아이템]

3. 완전히 위쪽      4. 완전히 아래쪽
   [아이템]
                       [캐릭터]
   [캐릭터]
                       [아이템]
```

### 조건 1: 완전히 왼쪽

```javascript
itemRect.right < characterRect.left
```

아이템의 오른쪽 끝이 캐릭터의 왼쪽 끝보다 왼쪽에 있으면 → 밖!

### 조건 2: 완전히 오른쪽

```javascript
itemRect.left > characterRect.right
```

아이템의 왼쪽 끝이 캐릭터의 오른쪽 끝보다 오른쪽에 있으면 → 밖!

### 조건 3: 완전히 위쪽

```javascript
itemRect.bottom < characterRect.top
```

아이템의 아래쪽 끝이 캐릭터의 위쪽 끝보다 위에 있으면 → 밖!

### 조건 4: 완전히 아래쪽

```javascript
itemRect.top > characterRect.bottom
```

아이템의 위쪽 끝이 캐릭터의 아래쪽 끝보다 아래에 있으면 → 밖!

### 최종 조건: OR로 결합

```javascript
const isOutside =
  itemRect.right < characterRect.left ||   // 왼쪽
  itemRect.left > characterRect.right ||   // 오른쪽
  itemRect.bottom < characterRect.top ||   // 위쪽
  itemRect.top > characterRect.bottom;     // 아래쪽
```

**하나라도** true면 영역 밖입니다!

---

## 💻 handleMouseUp 수정 (2분)

이제 마우스를 놓았을 때 영역을 체크하도록 수정해요.

```javascript
const handleMouseUp = (e) => {
  if (isDragging) {
    isDragging = false;
    item.style.cursor = 'move';

    // 캐릭터 영역 밖으로 드래그하면 아이템 삭제
    const characterRect = this.characterArea.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    // 아이템이 캐릭터 영역 밖에 있는지 체크
    const isOutside =
      itemRect.right < characterRect.left ||
      itemRect.left > characterRect.right ||
      itemRect.bottom < characterRect.top ||
      itemRect.top > characterRect.bottom;

    if (isOutside) {
      // 아이템 제거
      item.remove();

      // wornItems에서 제거
      if (this.wornItems[category] === item) {
        this.wornItems[category] = null;
      }

      // 원본 아이템 보드에 다시 표시
      if (item.sourceItem) {
        item.sourceItem.style.display = '';
      }

      // 파자마 표시 업데이트
      this.updatePajamaVisibility();
    }
  }
};
```

*[화면: 코드 단계별 설명]*

### 단계 1: 영역 정보 가져오기

```javascript
const characterRect = this.characterArea.getBoundingClientRect();
const itemRect = item.getBoundingClientRect();
```

- 캐릭터 영역의 위치/크기
- 아이템의 현재 위치/크기

### 단계 2: 밖에 있는지 판단

```javascript
const isOutside =
  itemRect.right < characterRect.left ||
  itemRect.left > characterRect.right ||
  itemRect.bottom < characterRect.top ||
  itemRect.top > characterRect.bottom;
```

- 4가지 조건 중 하나라도 true면 밖

### 단계 3: 삭제 처리

```javascript
if (isOutside) {
  item.remove();
  this.wornItems[category] = null;
  item.sourceItem.style.display = '';
  this.updatePajamaVisibility();
}
```

- DOM에서 제거
- 상태 업데이트
- 원본 복원
- 파자마 업데이트

---

## 🧪 테스트하기 (1분)

브라우저에서 테스트해볼까요!

*[화면: 여러 시나리오 시연]*

### 테스트 1: 왼쪽으로 드래그

**니트를 착용 → 왼쪽 밖으로 드래그**

*[화면: 아이템을 캐릭터 왼쪽으로 드래그]*

```
마우스 놓기 (mouseup):
characterRect.left = 200
itemRect.right = 150

150 < 200 → true
→ isOutside = true
→ 아이템 삭제! ✅
```

*[화면: 아이템이 사라지고 보드에 다시 나타남]*

### 테스트 2: 오른쪽으로 드래그

**청바지를 착용 → 오른쪽 밖으로 드래그**

```
characterRect.right = 600
itemRect.left = 650

650 > 600 → true
→ 아이템 삭제! ✅
```

### 테스트 3: 위로 드래그

**헤드셋을 착용 → 위쪽 밖으로 드래그**

```
characterRect.top = 100
itemRect.bottom = 80

80 < 100 → true
→ 아이템 삭제! ✅
```

### 테스트 4: 영역 안에서 놓기

**니트를 조금만 이동 → 영역 안에서 놓기**

```
모든 조건이 false
→ isOutside = false
→ 삭제 안 됨! ✅
```

완벽하게 작동합니다! 🎉

---

## 🔍 디버깅 팁 (40초)

만약 제대로 작동하지 않으면 콘솔에 rect 정보를 출력해보세요.

```javascript
const handleMouseUp = (e) => {
  if (isDragging) {
    isDragging = false;
    item.style.cursor = 'move';

    const characterRect = this.characterArea.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    // 디버깅: 좌표 출력
    console.log('Character:', {
      left: characterRect.left,
      right: characterRect.right,
      top: characterRect.top,
      bottom: characterRect.bottom
    });
    console.log('Item:', {
      left: itemRect.left,
      right: itemRect.right,
      top: itemRect.top,
      bottom: itemRect.bottom
    });

    const isOutside = /* ... */;
    console.log('Is outside?', isOutside);

    // ...
  }
};
```

*[화면: 콘솔 출력 예시]*

```
Character: {left: 200, right: 600, top: 100, bottom: 700}
Item: {left: 150, right: 250, top: 300, bottom: 400}
Is outside? false
```

숫자를 보면 문제를 쉽게 찾을 수 있습니다!

---

## 📝 마무리 및 다음 강의 예고 (15초)

오늘은 영역 밖 드래그로 아이템을 삭제하는 기능을 구현했습니다!

핵심은:
- `getBoundingClientRect()`로 위치/크기 정보
- 4가지 방향 조건 체크 (왼쪽/오른쪽/위/아래)
- OR 연산자로 결합
- mouseup에서 영역 체크
- 삭제 시 상태 정리 필수

Part 4가 완성되었습니다! 이제 사용자 인터랙션이 훨씬 자연스러워졌어요.

다음 파트에서는 UX를 더 개선할 거예요!
로딩 화면, 이미지 로드 감지, 시각적 피드백 등을 추가하겠습니다.

그럼 다음 강의에서 만나요!

---

## 💻 전체 코드

### js/app.js - handleMouseUp (Part 4-14 완성)

```javascript
const handleMouseUp = (e) => {
  if (isDragging) {
    isDragging = false;
    item.style.cursor = 'move';

    // 캐릭터 영역 밖으로 드래그하면 아이템 삭제
    const characterRect = this.characterArea.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    // 아이템이 캐릭터 영역 밖에 있는지 체크
    const isOutside =
      itemRect.right < characterRect.left ||
      itemRect.left > characterRect.right ||
      itemRect.bottom < characterRect.top ||
      itemRect.top > characterRect.bottom;

    if (isOutside) {
      // 아이템 제거
      item.remove();

      // wornItems에서 제거
      if (this.wornItems[category] === item) {
        this.wornItems[category] = null;
      }

      // 원본 아이템 보드에 다시 표시
      if (item.sourceItem) {
        item.sourceItem.style.display = '';
      }

      // 파자마 표시 업데이트
      this.updatePajamaVisibility();
    }
  }
};
```

---

## 💡 핵심 요약

- ✅ `getBoundingClientRect()`로 요소 위치 정보 획득
- ✅ `left`, `right`, `top`, `bottom` 속성 활용
- ✅ 4가지 방향 체크: 왼쪽/오른쪽/위/아래
- ✅ OR 연산자로 "하나라도" 조건 충족 확인
- ✅ mouseup에서 영역 체크
- ✅ 삭제 시 상태 정리: DOM 제거, wornItems 업데이트, sourceItem 복원, 파자마 업데이트

**다음 강의**: Part 5 - UX 개선 (로딩 화면)

---

## 🎓 추가 학습

**getBoundingClientRect() 상세**:
```javascript
const rect = element.getBoundingClientRect();

// DOMRect 객체
{
  x: 100,          // 왼쪽 끝 X (viewport 기준)
  y: 50,           // 위쪽 끝 Y (viewport 기준)
  width: 300,      // 요소 너비
  height: 200,     // 요소 높이
  top: 50,         // y와 동일
  right: 400,      // x + width
  bottom: 250,     // y + height
  left: 100        // x와 동일
}
```

**주의사항**:
- 뷰포트(화면) 기준 좌표
- 스크롤 위치에 따라 값이 변함
- 읽기 전용 객체

**영역 판단 패턴**:
```javascript
// 패턴 1: 완전히 밖에 있는지
const isOutside =
  rect1.right < rect2.left ||
  rect1.left > rect2.right ||
  rect1.bottom < rect2.top ||
  rect1.top > rect2.bottom;

// 패턴 2: 겹치는지 (충돌 감지)
const isOverlapping = !(
  rect1.right < rect2.left ||
  rect1.left > rect2.right ||
  rect1.bottom < rect2.top ||
  rect1.top > rect2.bottom
);

// 패턴 3: 완전히 포함되는지
const isInside =
  rect1.left >= rect2.left &&
  rect1.right <= rect2.right &&
  rect1.top >= rect2.top &&
  rect1.bottom <= rect2.bottom;
```

**좌표계 종류**:
```javascript
// 1. 뷰포트 기준 (getBoundingClientRect)
element.getBoundingClientRect();
// → 화면 기준, 스크롤 영향받음

// 2. 문서 기준
element.offsetTop    // 부모 기준
element.offsetLeft

// 3. 절대 위치 계산
function getAbsolutePosition(element) {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + window.scrollX,
    y: rect.top + window.scrollY
  };
}
```

**성능 고려사항**:
```javascript
// 나쁜 예: 매 프레임마다 호출
function animate() {
  const rect = element.getBoundingClientRect();  // 느림!
  // ...
  requestAnimationFrame(animate);
}

// 좋은 예: 필요할 때만 호출
const rect = element.getBoundingClientRect();  // 한 번만
function animate() {
  // rect 재사용
  requestAnimationFrame(animate);
}

// getBoundingClientRect는 리플로우를 유발할 수 있음
// 반복문이나 애니메이션에서 주의!
```

**마우스 좌표와 요소 좌표 비교**:
```javascript
element.addEventListener('click', (e) => {
  const rect = element.getBoundingClientRect();

  // 요소 내부 클릭 위치
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  console.log(`요소 내부 (${x}, ${y}) 클릭`);
});
```

**리사이즈 처리**:
```javascript
// 윈도우 크기 변경 시 rect 다시 계산
window.addEventListener('resize', () => {
  const newRect = element.getBoundingClientRect();
  // 업데이트된 위치로 다시 계산
});
```

**교차 관찰 API** (최신):
```javascript
// getBoundingClientRect 대신 Intersection Observer 사용 가능
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      // 영역 밖으로 나감
      console.log('Element is outside!');
    }
  });
});

observer.observe(element);
```
