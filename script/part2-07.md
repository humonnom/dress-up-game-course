# Part 2-07: 아이템 생성 및 배치

**강의 시간**: 7분
**핵심 목표**: 동적으로 DOM 요소 생성하고 on-body SVG 활용하기

---

## 🎬 인트로 (20초)

안녕하세요! 지난 시간까지 드래그와 드롭 이벤트를 처리했습니다.

이번 시간에는 드롭한 아이템을 실제로 캐릭터에게 입혀볼 거예요!

JavaScript로 동적으로 이미지 요소를 생성하고, on-body SVG 파일을 사용하는 방법을 배워보겠습니다.

그럼 시작해볼까요!

---

## 🎯 handleDrop 수정 (1분)

먼저 `handleDrop`에서 아이템 생성 메서드를 호출하도록 수정해요.

```javascript
handleDrop(e) {
  e.preventDefault();
  this.characterArea.classList.remove('drag-over');

  if (!this.draggedElement) return;

  // 아이템 보드에서 드래그한 경우에만 생성
  if (this.isDraggingFromBoard) {
    this.createItemOnCharacter(this.draggedElement);
    this.draggedElement.style.display = 'none'; // 아이템 보드에서 숨김
  }

  this.draggedElement = null;
  this.isDraggingFromBoard = false;
}
```

*[화면: 추가된 부분 하이라이트]*

새로 추가된 부분:
1. **조건 확인**: 아이템 보드에서 드래그한 경우만
2. **아이템 생성**: `createItemOnCharacter()` 호출
3. **원본 숨김**: 보드에서 해당 아이템 숨김

---

## 🛠️ 헬퍼 메서드 - 경로 변환 (1분)

아이템 이미지 → on-body 이미지로 경로를 바꾸는 메서드를 만들어요.

```javascript
getOnBodyPath(originalSrc, suffix = '-on-body.svg') {
  return originalSrc.replace('.svg', suffix);
}
```

*[화면: 경로 변환 예시]*

```javascript
// 입력
'img/svgs/clothes/jeans.svg'

// 출력
'img/svgs/clothes/jeans-on-body.svg'
```

간단하지만 매우 유용합니다!

---

## 🖼️ 헬퍼 메서드 - 이미지 요소 생성 (1분)

이미지 요소를 만드는 메서드도 추가해요.

```javascript
createNewImgElement(src, alt) {
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  img.style.position = 'absolute';
  img.style.width = '100%';
  img.style.height = 'auto';
  img.style.top = '0';
  img.style.left = '0';
  return img;
}
```

*[화면: createElement의 작동 방식]*

`document.createElement('img')`는:
- HTML 요소를 JavaScript로 생성
- 아직 DOM에 추가되지 않음
- 속성과 스타일을 설정한 후 추가해야 함

---

## ✨ createItemOnCharacter 메서드 (2분 30초)

이제 핵심 메서드를 만들어볼게요!

```javascript
createItemOnCharacter(sourceItem) {
  const category = sourceItem.dataset.category;

  // on-body 이미지 경로 생성
  const onBodyPath = this.getOnBodyPath(sourceItem.src);

  // 새 이미지 요소 생성
  const newItem = this.createNewImgElement(onBodyPath, sourceItem.alt);
  newItem.dataset.category = category;

  // z-index 적용
  const zIndex = this.zIndexMap[category] || 1;
  newItem.style.zIndex = zIndex.toString();

  // 원본 아이템 참조 저장
  newItem.sourceItem = sourceItem;

  // DOM에 추가
  this.characterItems.appendChild(newItem);

  console.log('아이템 생성:', category, zIndex);
}
```

*[화면: 코드 한 줄씩 실행하며 시연]*

### 단계별 설명

**1. 카테고리 가져오기**
```javascript
const category = sourceItem.dataset.category;
```
- HTML의 `data-category` 속성 읽기
- 예: "top", "pants", "hair" 등

**2. on-body 경로 생성**
```javascript
const onBodyPath = this.getOnBodyPath(sourceItem.src);
```
- `jeans.svg` → `jeans-on-body.svg`

**3. 이미지 요소 생성**
```javascript
const newItem = this.createNewImgElement(onBodyPath, sourceItem.alt);
```
- 새 `<img>` 태그 생성
- 캐릭터가 입는 버전의 이미지 사용

**4. 카테고리 설정**
```javascript
newItem.dataset.category = category;
```
- 나중에 이 아이템을 식별하기 위해

**5. z-index 적용**
```javascript
const zIndex = this.zIndexMap[category] || 1;
newItem.style.zIndex = zIndex.toString();
```
- 카테고리별 레이어 순서
- 상의(4), 바지(3), 양말(1) 등

**6. 원본 참조 저장**
```javascript
newItem.sourceItem = sourceItem;
```
- 나중에 아이템을 제거할 때 보드로 돌려보내기 위해

**7. DOM에 추가**
```javascript
this.characterItems.appendChild(newItem);
```
- 실제로 화면에 표시!

---

## 🧪 테스트하기 (1분)

브라우저에서 테스트해볼까요!

*[화면: 실제로 아이템을 드래그 앤 드롭]*

1. **니트를 드래그해서 캐릭터에 드롭**
   - 캐릭터가 니트를 입습니다!
   - 아이템 보드의 니트가 사라집니다
   - 콘솔: "아이템 생성: top 4"

2. **청바지를 드래그해서 드롭**
   - 캐릭터가 청바지를 입습니다!
   - 니트 위에 청바지가? 아니요! z-index 덕분에 바지(3)가 상의(4) 아래에 있습니다

3. **양말을 드래그해서 드롭**
   - 양말(1)이 바지(3) 아래에 표시됩니다

*[화면: 레이어 순서 시각화]*

레이어가 올바르게 쌓입니다:
- 양말(1) → 신발(2) → 바지(3) → 상의(4)

---

## 🐛 디버깅 팁 (30초)

개발자 도구의 Elements 탭을 열어보세요.

*[화면: Elements 탭]*

```html
<div id="character-items">
  <img src="img/svgs/clothes/jeans-on-body.svg"
       data-category="pants"
       style="position: absolute; ... z-index: 3;">
  <img src="img/svgs/clothes/three-color-knit-on-body.svg"
       data-category="top"
       style="position: absolute; ... z-index: 4;">
</div>
```

동적으로 생성된 요소들을 확인할 수 있습니다!

---

## ⚠️ 아직 해결 안 된 문제 (30초)

현재 상태에서는:

1. **중복 착용 가능**
   - 상의를 여러 개 입을 수 있음
   - 다음 강의에서 해결!

2. **파자마가 계속 보임**
   - 다른 옷을 입어도 파자마가 보임
   - Part 3에서 해결!

3. **아이템 위치 조정 불가**
   - 한번 입히면 위치 수정 못 함
   - Part 4에서 해결!

하나씩 해결해나갈 거예요!

---

## 📝 마무리 및 다음 강의 예고 (20초)

오늘은 드디어 아이템을 캐릭터에게 입혔습니다!

핵심은:
- `createElement`로 동적 요소 생성
- on-body SVG 파일 사용
- z-index로 레이어 순서 제어
- 원본 참조 저장으로 추적

다음 시간부터는 게임 로직을 구현합니다!
같은 카테고리의 아이템을 중복해서 입지 못하도록 하고, 기존 아이템을 교체하는 방법을 배워볼 거예요.

그럼 다음 강의에서 만나요!

---

## 💻 전체 코드

### js/app.js (Part 2-07 완성)

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

    console.log('게임 초기화 완료!');
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

    if (this.isDraggingFromBoard) {
      this.createItemOnCharacter(this.draggedElement);
      this.draggedElement.style.display = 'none';
    }

    this.draggedElement = null;
    this.isDraggingFromBoard = false;
  }

  getOnBodyPath(originalSrc, suffix = '-on-body.svg') {
    return originalSrc.replace('.svg', suffix);
  }

  createNewImgElement(src, alt) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.style.position = 'absolute';
    img.style.width = '100%';
    img.style.height = 'auto';
    img.style.top = '0';
    img.style.left = '0';
    return img;
  }

  createItemOnCharacter(sourceItem) {
    const category = sourceItem.dataset.category;

    // on-body 이미지 경로 생성
    const onBodyPath = this.getOnBodyPath(sourceItem.src);

    // 새 이미지 요소 생성
    const newItem = this.createNewImgElement(onBodyPath, sourceItem.alt);
    newItem.dataset.category = category;

    // z-index 적용
    const zIndex = this.zIndexMap[category] || 1;
    newItem.style.zIndex = zIndex.toString();

    // 원본 아이템 참조 저장
    newItem.sourceItem = sourceItem;

    // DOM에 추가
    this.characterItems.appendChild(newItem);

    console.log('아이템 생성:', category, 'z-index:', zIndex);
  }
}

// 페이지 로드 시 게임 초기화
document.addEventListener('DOMContentLoaded', () => {
  new DressUpGame();
});
```

---

## 💡 핵심 요약

- ✅ `document.createElement()`로 동적 요소 생성
- ✅ `getOnBodyPath()`로 경로 변환
- ✅ `appendChild()`로 DOM에 추가
- ✅ `sourceItem` 참조로 원본 추적
- ✅ z-index로 레이어 순서 제어

**다음 강의**: 아이템 중복 방지

---

## 🎓 추가 학습

**DOM 조작 메서드**:
```javascript
// 요소 생성
const el = document.createElement('div');

// 속성 설정
el.setAttribute('data-id', '123');
el.dataset.id = '123'; // 같은 결과

// 스타일 설정
el.style.color = 'red';
el.style.backgroundColor = 'blue'; // CSS의 background-color

// DOM에 추가
parent.appendChild(el);      // 마지막에 추가
parent.insertBefore(el, ref); // ref 앞에 추가
parent.replaceChild(el, old); // old를 el로 교체
```

**문자열 메서드**:
```javascript
'hello.svg'.replace('.svg', '-on-body.svg')
// → 'hello-on-body.svg'

// 여러 번 바꾸기
'test.svg.svg'.replace('.svg', '-on')
// → 'test-on.svg' (첫 번째만!)

'test.svg.svg'.replaceAll('.svg', '-on')
// → 'test-on-on' (모두)
```
