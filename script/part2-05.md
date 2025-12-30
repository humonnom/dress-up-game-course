# Part 2-05: 드래그 이벤트 기초

**강의 시간**: 5분
**핵심 목표**: HTML5 Drag and Drop API로 dragstart 이벤트 처리하기

---

## 🎬 인트로 (20초)

안녕하세요! 지난 시간에는 클래스 구조를 만들었습니다.

이번 시간에는 드디어 드래그 기능을 구현해볼 거예요!

HTML5 Drag and Drop API를 사용해서 아이템을 드래그할 수 있게 만들어보겠습니다.

그럼 시작해볼까요!

---

## 🖱️ HTML5 Drag and Drop API란? (1분)

HTML5는 기본적으로 드래그 앤 드롭 기능을 제공합니다.

*[화면: MDN 문서 또는 API 다이어그램]*

주요 이벤트들:
- **dragstart**: 드래그가 시작될 때
- **drag**: 드래그하는 동안 (계속 발생)
- **dragend**: 드래그가 끝날 때
- **dragover**: 드래그한 요소가 다른 요소 위로 올 때
- **drop**: 드롭 영역에 놓았을 때

오늘은 **dragstart** 이벤트부터 시작합니다!

---

## 📝 이벤트 리스너 등록 (1분 30초)

`init()` 메서드에 이벤트 리스너를 추가해볼게요.

```javascript
init() {
  // 아이템 보드의 아이템들에 드래그 이벤트 추가
  this.draggableItems.forEach(item => {
    item.addEventListener('dragstart', (e) => this.handleDragStart(e, true));
    item.addEventListener('dragend', (e) => this.handleDragEnd(e));
  });

  console.log('이벤트 리스너 등록 완료!');
}
```

여기서 주목할 점:

1. **forEach로 모든 아이템에 등록**
   - `querySelectorAll('.draggable')`로 가져온 모든 아이템

2. **화살표 함수 사용**
   ```javascript
   (e) => this.handleDragStart(e, true)
   ```
   - 화살표 함수를 사용하면 `this`가 클래스를 가리킴!

3. **두 번째 인자 `true`**
   - 아이템 보드에서 드래그하는 건지, 캐릭터에서 드래그하는 건지 구분

---

## 🎯 handleDragStart 메서드 (1분 30초)

이제 드래그 시작을 처리하는 메서드를 만들어요.

```javascript
handleDragStart(e, fromBoard = false) {
  this.draggedElement = e.currentTarget;
  this.isDraggingFromBoard = fromBoard;

  e.currentTarget.classList.add('dragging');
  this.characterArea.classList.add('drag-over');

  // 드래그 이미지 설정
  e.dataTransfer.effectAllowed = 'move';
}
```

*[화면: 각 줄 실행 시 변화 시연]*

하나씩 살펴볼게요:

### 1. 드래그한 요소 저장
```javascript
this.draggedElement = e.currentTarget;
```
- 어떤 아이템을 드래그했는지 저장
- 나중에 drop할 때 사용

### 2. 출발지 구분
```javascript
this.isDraggingFromBoard = fromBoard;
```
- `true`: 아이템 보드에서 드래그
- `false`: 캐릭터에서 드래그 (나중에 추가)

### 3. 시각적 피드백
```javascript
e.currentTarget.classList.add('dragging');
this.characterArea.classList.add('drag-over');
```
- CSS에서 정의한 `.dragging`, `.drag-over` 클래스 추가
- 드래그 중임을 시각적으로 표시

### 4. effectAllowed 설정
```javascript
e.dataTransfer.effectAllowed = 'move';
```
- 이동(move) 동작임을 명시
- 복사(copy)나 링크(link)가 아님

---

## 🏁 handleDragEnd 메서드 (1분)

드래그가 끝나면 스타일을 원래대로 돌려야 해요.

```javascript
handleDragEnd(e) {
  e.target.classList.remove('dragging');
  this.characterArea.classList.remove('drag-over');
}
```

간단하죠? 추가했던 클래스를 제거하면 됩니다.

*[화면: 드래그하면 반투명해지고, 놓으면 다시 원래대로]*

---

## 🧪 테스트하기 (30초)

브라우저에서 테스트해볼까요?

*[화면: 실제로 아이템을 드래그]*

1. 아이템을 클릭하고 드래그하면
   - 아이템이 반투명해집니다 (`.dragging` 클래스)
   - 캐릭터 영역이 하이라이트됩니다 (`.drag-over` 클래스)

2. 마우스를 놓으면
   - 원래 상태로 돌아갑니다

아직 드롭 기능은 없지만, 드래그는 작동합니다!

---

## 🐛 디버깅 팁 (30초)

콘솔에 로그를 추가해서 확인해볼 수 있어요.

```javascript
handleDragStart(e, fromBoard = false) {
  console.log('드래그 시작!', e.currentTarget);
  console.log('아이템 보드에서?', fromBoard);

  this.draggedElement = e.currentTarget;
  // ... 나머지 코드
}
```

*[화면: 콘솔 출력 확인]*

개발자 도구 콘솔에서 어떤 요소를 드래그했는지 확인할 수 있습니다!

---

## 📝 마무리 및 다음 강의 예고 (20초)

오늘은 드래그 시작 이벤트를 처리했습니다!

핵심은:
- forEach로 모든 아이템에 이벤트 등록
- dragstart에서 드래그한 요소 추적
- classList로 시각적 피드백
- effectAllowed로 드래그 타입 설정

다음 시간에는 드롭 영역을 설정해볼 거예요!
dragover와 drop 이벤트를 처리하고, preventDefault가 왜 필요한지 배워보겠습니다.

그럼 다음 강의에서 만나요!

---

## 💻 전체 코드

### js/app.js (Part 2-05 완성)

```javascript
// 드래그 앤 드롭 게임
class DressUpGame {
  constructor() {
    // DOM 요소 참조
    this.characterArea = document.querySelector('.character-area');
    this.characterItems = document.getElementById('character-items');
    this.draggableItems = document.querySelectorAll('.draggable');
    this.draggedElement = null;
    this.isDraggingFromBoard = false;

    // 디폴트 의상
    this.pajamaTop = document.getElementById('pajama-top');
    this.pajamaBottom = document.getElementById('pajama-bottom');

    // 카테고리별 현재 착용 중인 아이템 추적
    this.wornItems = {
      socks: null,
      shoes: null,
      pants: null,
      top: null,
      outer: null,
      bag: null,
      hair: null,
      headwear: null,
      'music-device': null
    };

    // 카테고리별 z-index 매핑
    this.zIndexMap = {
      body: 0,
      socks: 1,
      shoes: 2,
      pants: 3,
      top: 4,
      outer: 5,
      bag: 6,
      hair: 7,
      headwear: 8,
      'music-device': 9
    };

    this.init();
  }

  init() {
    // 아이템 보드의 아이템들에 드래그 이벤트 추가
    this.draggableItems.forEach(item => {
      item.addEventListener('dragstart', (e) => this.handleDragStart(e, true));
      item.addEventListener('dragend', (e) => this.handleDragEnd(e));
    });

    console.log('이벤트 리스너 등록 완료!');
  }

  handleDragStart(e, fromBoard = false) {
    this.draggedElement = e.currentTarget;
    this.isDraggingFromBoard = fromBoard;

    e.currentTarget.classList.add('dragging');
    this.characterArea.classList.add('drag-over');

    // 드래그 이미지 설정
    e.dataTransfer.effectAllowed = 'move';
  }

  handleDragEnd(e) {
    e.target.classList.remove('dragging');
    this.characterArea.classList.remove('drag-over');
  }
}

// 페이지 로드 시 게임 초기화
document.addEventListener('DOMContentLoaded', () => {
  new DressUpGame();
});
```

---

## 💡 핵심 요약

- ✅ `forEach`로 모든 아이템에 이벤트 리스너 등록
- ✅ `handleDragStart`에서 드래그한 요소 저장
- ✅ `classList.add/remove`로 시각적 피드백
- ✅ `e.dataTransfer.effectAllowed`로 드래그 타입 설정
- ✅ 화살표 함수로 `this` 바인딩 유지

**다음 강의**: 드롭 영역 설정

---

## 🎓 추가 학습

**dataTransfer 객체**:
```javascript
e.dataTransfer.effectAllowed = 'move';  // move, copy, link, all
e.dataTransfer.setData('text/plain', 'data'); // 데이터 전달
e.dataTransfer.setDragImage(img, x, y); // 커스텀 드래그 이미지
```

**이벤트 객체**:
- `e.target`: 이벤트가 발생한 요소
- `e.currentTarget`: 이벤트 리스너가 등록된 요소
- 보통 `e.currentTarget`을 사용하는 게 안전함!
