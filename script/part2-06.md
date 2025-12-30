# Part 2-06: 드롭 영역 설정

**강의 시간**: 5분
**핵심 목표**: dragover와 drop 이벤트 처리하고 preventDefault의 중요성 이해하기

---

## 🎬 인트로 (20초)

안녕하세요! 지난 시간에는 드래그 시작을 처리했습니다.

이번 시간에는 드롭 영역을 설정해볼 거예요!

캐릭터 영역에서 dragover와 drop 이벤트를 처리하고, **preventDefault가 왜 필수인지** 배워보겠습니다.

그럼 시작해볼까요!

---

## 🎯 드롭 영역에 이벤트 등록 (1분)

`init()` 메서드에 캐릭터 영역 이벤트를 추가해요.

```javascript
init() {
  // 아이템 보드의 아이템들에 드래그 이벤트 추가
  this.draggableItems.forEach(item => {
    item.addEventListener('dragstart', (e) => this.handleDragStart(e, true));
    item.addEventListener('dragend', (e) => this.handleDragEnd(e));
  });

  // 캐릭터 영역에 드롭 이벤트 추가
  this.characterArea.addEventListener('dragover', (e) => this.handleDragOver(e));
  this.characterArea.addEventListener('drop', (e) => this.handleDrop(e));
  this.characterArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));

  console.log('모든 이벤트 리스너 등록 완료!');
}
```

세 가지 이벤트:
- **dragover**: 드래그한 요소가 영역 위에 있을 때
- **drop**: 드롭했을 때
- **dragleave**: 영역을 벗어났을 때

---

## 🚫 preventDefault의 중요성 (1분 30초)

먼저 `handleDragOver`를 만들어볼게요.

```javascript
handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}
```

*[화면: preventDefault 있을 때 vs 없을 때 비교]*

### 왜 preventDefault가 필수일까요?

**테스트 1 - preventDefault 없이**:
```javascript
handleDragOver(e) {
  // e.preventDefault() 없음!
  e.dataTransfer.dropEffect = 'move';
}
```
→ 드롭이 작동하지 않습니다! 🚫

**테스트 2 - preventDefault 있음**:
```javascript
handleDragOver(e) {
  e.preventDefault(); // 있음!
  e.dataTransfer.dropEffect = 'move';
}
```
→ 드롭이 정상 작동합니다! ✅

### 이유가 뭘까요?

브라우저의 기본 동작은 **드롭을 거부**하는 것입니다.

`e.preventDefault()`로 이 기본 동작을 막아야 드롭이 가능해집니다!

```javascript
// 드래그 소스의 effectAllowed
e.dataTransfer.effectAllowed = 'move';

// 드롭 대상의 dropEffect
e.dataTransfer.dropEffect = 'move';
```

이 둘이 일치해야 드롭이 가능합니다!

---

## 📦 handleDrop 메서드 (1분 30초)

드롭을 처리하는 메서드를 만들어요.

```javascript
handleDrop(e) {
  e.preventDefault();
  this.characterArea.classList.remove('drag-over');

  if (!this.draggedElement) return;

  console.log('드롭 성공!', this.draggedElement);
  console.log('카테고리:', this.draggedElement.dataset.category);

  // 다음 강의에서 아이템 생성 로직 추가
}
```

*[화면: 코드 한 줄씩 실행하며 설명]*

### 1. preventDefault
```javascript
e.preventDefault();
```
- drop 이벤트에도 필수!
- 파일 드롭 같은 기본 동작 방지

### 2. 하이라이트 제거
```javascript
this.characterArea.classList.remove('drag-over');
```
- 드래그가 끝났으니 하이라이트 제거

### 3. 유효성 검사
```javascript
if (!this.draggedElement) return;
```
- 혹시 모를 에러 방지

### 4. 디버깅 로그
```javascript
console.log('드롭 성공!', this.draggedElement);
```
- 어떤 아이템이 드롭되었는지 확인

---

## 🚪 handleDragLeave 메서드 (30초)

영역을 벗어날 때 하이라이트를 제거해요.

```javascript
handleDragLeave(e) {
  if (e.target === this.characterArea) {
    this.characterArea.classList.remove('drag-over');
  }
}
```

### 왜 조건문이 필요할까요?

```javascript
if (e.target === this.characterArea)
```

캐릭터 영역 안에는 여러 자식 요소가 있어요 (캐릭터 이미지, 파자마 등).

자식 요소 간 이동 시에도 dragleave가 발생하므로, 실제로 영역을 벗어날 때만 처리해야 합니다!

---

## 🧪 테스트하기 (1분)

브라우저에서 테스트해볼까요!

*[화면: 실제로 드래그 앤 드롭 시연]*

1. **아이템을 드래그**
   - 반투명해지고 캐릭터 영역이 하이라이트

2. **캐릭터 영역으로 드래그**
   - 마우스 커서가 변경됨 (dropEffect)

3. **캐릭터 영역에 드롭**
   - 콘솔에 "드롭 성공!" 출력
   - 아이템 정보 표시

4. **캐릭터 영역 밖에 드롭**
   - 아무 일도 일어나지 않음 (의도된 동작)

*[화면: 개발자 도구 콘솔]*

콘솔을 확인하면:
```
드롭 성공! <img src="..." data-category="top">
카테고리: top
```

---

## ⚠️ 흔한 실수와 해결 (30초)

### 실수 1: preventDefault 빠뜨리기
```javascript
handleDragOver(e) {
  // e.preventDefault() 없음!
  e.dataTransfer.dropEffect = 'move';
}
// → 드롭이 안 됨!
```

### 실수 2: draggedElement 초기화 안 함
```javascript
handleDrop(e) {
  e.preventDefault();
  // this.draggedElement = null; 빠뜨림
}
// → 다음 드래그 때 문제 발생 가능
```

나중에 `this.draggedElement = null;`을 추가해야 합니다!

---

## 📝 마무리 및 다음 강의 예고 (20초)

오늘은 드롭 영역을 설정했습니다!

핵심은:
- preventDefault로 기본 동작 방지
- dragover와 drop 모두에 필요
- dropEffect로 드롭 타입 표시
- dragleave로 하이라이트 제거

다음 시간에는 드롭한 아이템을 실제로 캐릭터에게 입혀볼 거예요!
동적으로 DOM 요소를 생성하고, on-body SVG를 사용하는 방법을 배워보겠습니다.

그럼 다음 강의에서 만나요!

---

## 💻 전체 코드

### js/app.js (Part 2-06 완성)

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

    // 캐릭터 영역에 드롭 이벤트 추가
    this.characterArea.addEventListener('dragover', (e) => this.handleDragOver(e));
    this.characterArea.addEventListener('drop', (e) => this.handleDrop(e));
    this.characterArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));

    console.log('모든 이벤트 리스너 등록 완료!');
  }

  handleDragStart(e, fromBoard = false) {
    this.draggedElement = e.currentTarget;
    this.isDraggingFromBoard = fromBoard;

    e.currentTarget.classList.add('dragging');
    this.characterArea.classList.add('drag-over');

    e.dataTransfer.effectAllowed = 'move';
  }

  handleDragEnd(e) {
    e.target.classList.remove('dragging');
    this.characterArea.classList.remove('drag-over');
  }

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  handleDragLeave(e) {
    if (e.target === this.characterArea) {
      this.characterArea.classList.remove('drag-over');
    }
  }

  handleDrop(e) {
    e.preventDefault();
    this.characterArea.classList.remove('drag-over');

    if (!this.draggedElement) return;

    console.log('드롭 성공!', this.draggedElement);
    console.log('카테고리:', this.draggedElement.dataset.category);

    // 다음 강의에서 아이템 생성 로직 추가
    this.draggedElement = null;
    this.isDraggingFromBoard = false;
  }
}

// 페이지 로드 시 게임 초기화
document.addEventListener('DOMContentLoaded', () => {
  new DressUpGame();
});
```

---

## 💡 핵심 요약

- ✅ `preventDefault()`는 dragover와 drop 모두에 필수
- ✅ `dropEffect`로 드롭 가능 여부 시각화
- ✅ `dragleave`로 영역 벗어날 때 처리
- ✅ `e.target === this.characterArea`로 정확한 이벤트 감지
- ✅ 드롭 후 `draggedElement` 초기화

**다음 강의**: 아이템 생성 및 배치

---

## 🎓 추가 학습

**effectAllowed vs dropEffect**:
```javascript
// 드래그 소스에서
e.dataTransfer.effectAllowed = 'move'; // 허용할 동작

// 드롭 대상에서
e.dataTransfer.dropEffect = 'move';    // 실제 동작
```

이 둘이 호환되지 않으면 드롭이 거부됩니다!

**가능한 값들**:
- `move`: 이동
- `copy`: 복사
- `link`: 링크
- `all`: 모두 허용
- `none`: 드롭 불가
