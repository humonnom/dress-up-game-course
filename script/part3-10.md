# Part 3-10: 특수 케이스: 백팩 구현

**강의 시간**: 6분
**핵심 목표**: 앞/뒤 두 개의 이미지로 구성된 그룹 아이템 처리하기

---

## 🎬 인트로 (20초)

안녕하세요! 지난 시간에는 z-index를 자세히 다뤘습니다.

이번 시간에는 특별한 아이템을 구현해볼 거예요!

백팩은 캐릭터의 앞과 뒤에 모두 표시되어야 입체감이 있습니다.
div 컨테이너로 여러 이미지를 그룹화하고, 각각 다른 z-index를 적용하는 방법을 배워보겠습니다.

그럼 시작해볼까요!

---

## 🎒 백팩의 특별한 점 (40초)

먼저 백팩 SVG 파일들을 확인해볼게요.

*[화면: 파일 탐색기]*

```
img/svgs/item/
├── backpack.svg                    (아이템 보드용)
├── backpack-on-body-back.svg       (캐릭터 뒤쪽)
└── backpack-on-body-front.svg      (캐릭터 앞쪽)
```

일반 아이템:
- `jeans.svg` → `jeans-on-body.svg` (1개)

백팩:
- `backpack.svg` → `backpack-on-body-back.svg` + `backpack-on-body-front.svg` (2개!)

*[화면: 백팩의 앞/뒤 레이어 시각화]*

- **뒤쪽**: 캐릭터 몸(body, 0) 뒤에 표시 (z-index: -1)
- **앞쪽**: 가방 위치(bag, 6)에 표시 (z-index: 6)

---

## 🔍 파일명 확인 메서드 (40초)

먼저 파일명을 추출하는 헬퍼 메서드를 만들어요.

```javascript
getFilename(path) {
  return path.split('/').pop().split('.')[0];
}
```

*[화면: 단계별 실행 과정]*

```javascript
// 입력: 'img/svgs/item/backpack.svg'

// 1단계: split('/')
['img', 'svgs', 'item', 'backpack.svg']

// 2단계: pop()
'backpack.svg'

// 3단계: split('.')
['backpack', 'svg']

// 4단계: [0]
'backpack'
```

이제 `'backpack'` 문자열을 얻을 수 있습니다!

---

## 🏗️ createItemOnCharacter 수정 (2분 30초)

`createItemOnCharacter` 메서드에 백팩 처리 로직을 추가해요.

```javascript
createItemOnCharacter(sourceItem) {
  const category = sourceItem.dataset.category;

  // ... 중복 제거 로직

  let newItem;
  const filename = this.getFilename(sourceItem.src);

  // 가방은 앞/뒤 이미지로 구성된 그룹 생성
  if (category === 'bag' && filename === 'backpack') {
    const newGroup = document.createElement('div');
    newGroup.className = 'placed-item placed-group';
    newGroup.dataset.category = category;
    newGroup.style.position = 'absolute';
    newGroup.style.left = "0";
    newGroup.style.top = "0";

    const backSvgPath = this.getOnBodyPath(sourceItem.src, '-on-body-back.svg');
    const frontSvgPath = this.getOnBodyPath(sourceItem.src, '-on-body-front.svg');
    const newBackImg = this.createNewImgElement(backSvgPath, sourceItem.alt);
    const newFrontImg = this.createNewImgElement(frontSvgPath, sourceItem.alt);

    newBackImg.style.zIndex = (this.zIndexMap.body - 1).toString(); // 캐릭터 뒤
    newFrontImg.style.zIndex = this.zIndexMap.bag.toString(); // 가방 위치

    newGroup.appendChild(newBackImg);
    newGroup.appendChild(newFrontImg);

    newItem = newGroup;
  } else {
    // 일반 아이템 (기존 코드)
    newItem = this.createNewImgElement(this.getOnBodyPath(sourceItem.src), sourceItem.alt);
    newItem.dataset.category = category;

    const zIndex = this.zIndexMap[category] || 1;
    newItem.style.zIndex = zIndex.toString();
  }

  // 원본 아이템 참조 저장
  newItem.sourceItem = sourceItem;

  // DOM에 추가
  this.characterItems.appendChild(newItem);

  // 현재 카테고리에 착용한 아이템으로 등록
  this.wornItems[category] = newItem;
}
```

*[화면: 코드 블록별로 나눠서 설명]*

### 블록 1: 조건 확인
```javascript
if (category === 'bag' && filename === 'backpack') {
  // 백팩 특수 처리
}
```
- 카테고리가 'bag'이고
- 파일명이 'backpack'일 때만

### 블록 2: div 컨테이너 생성
```javascript
const newGroup = document.createElement('div');
newGroup.className = 'placed-item placed-group';
newGroup.dataset.category = category;
newGroup.style.position = 'absolute';
newGroup.style.left = "0";
newGroup.style.top = "0";
```
- div로 그룹을 감쌈
- 여러 이미지를 하나의 단위로 관리

### 블록 3: 앞/뒤 이미지 생성
```javascript
const backSvgPath = this.getOnBodyPath(sourceItem.src, '-on-body-back.svg');
const frontSvgPath = this.getOnBodyPath(sourceItem.src, '-on-body-front.svg');
```
- 두 가지 경로 생성
- `getOnBodyPath`의 두 번째 인자로 커스텀 suffix

### 블록 4: z-index 적용
```javascript
newBackImg.style.zIndex = (this.zIndexMap.body - 1).toString(); // -1
newFrontImg.style.zIndex = this.zIndexMap.bag.toString();       // 6
```
- 뒤쪽 이미지: body(0) - 1 = -1
- 앞쪽 이미지: bag = 6

### 블록 5: 그룹에 추가
```javascript
newGroup.appendChild(newBackImg);
newGroup.appendChild(newFrontImg);
newItem = newGroup;
```
- div에 두 이미지 추가
- `newItem`은 이제 div 요소

---

## 🧪 테스트하기 (1분)

브라우저에서 백팩을 착용해볼까요!

*[화면: 백팩 드래그 앤 드롭]*

1. **백팩을 캐릭터에 드롭**

*[화면: Elements 탭]*

```html
<div id="character-items">
  <div class="placed-group" data-category="bag">
    <img src=".../backpack-on-body-back.svg" style="z-index: -1">
    <img src=".../backpack-on-body-front.svg" style="z-index: 6">
  </div>
</div>
```

2. **레이어 확인**
   - 뒤쪽 이미지(-1): 캐릭터 몸 뒤에
   - 앞쪽 이미지(6): 옷들 위에

*[화면: 다른 옷 착용해보기]*

3. **니트 착용 (z-index: 4)**
   - 백팩 앞쪽(6) > 니트(4) > 캐릭터(0) > 백팩 뒤쪽(-1)

완벽한 입체감! 🎒✨

---

## 🐛 크로스백 처리 (30초)

크로스백은 어떻게 할까요?

```javascript
if (category === 'bag' && filename === 'backpack') {
  // 백팩만 특수 처리
}
```

크로스백(`cross-bag.svg`)은:
- 조건에 해당 안 됨
- else 블록으로 이동
- 일반 아이템처럼 처리 (한 개 이미지)

*[화면: 크로스백 착용 시연]*

크로스백은 앞에만 있으니 일반 처리로 충분합니다!

---

## 📝 마무리 및 다음 강의 예고 (20초)

오늘은 백팩 같은 복잡한 아이템을 구현했습니다!

핵심은:
- div로 여러 이미지 그룹화
- 각 이미지에 다른 z-index
- 조건문으로 특수 케이스 분리
- getOnBodyPath에 커스텀 suffix

다음 시간에는 또 다른 예외 케이스를 다룰 거예요!
긴 머리처럼 특정 아이템만 z-index를 다르게 해야 하는 경우를 배워보겠습니다.

그럼 다음 강의에서 만나요!

---

## 💻 전체 코드

### js/app.js - 추가 메서드

```javascript
// 파일명 추출
getFilename(path) {
  return path.split('/').pop().split('.')[0];
}
```

### js/app.js - createItemOnCharacter 메서드 (Part 3-10 완성)

```javascript
createItemOnCharacter(sourceItem) {
  const category = sourceItem.dataset.category;

  // 같은 카테고리의 기존 아이템이 있으면 제거
  if (this.wornItems[category]) {
    const oldItem = this.wornItems[category];
    if (oldItem.sourceItem) {
      oldItem.sourceItem.style.display = '';
    }
    oldItem.remove();
    this.wornItems[category] = null;
  }

  let newItem;
  const filename = this.getFilename(sourceItem.src);

  // 가방은 앞/뒤 이미지로 구성된 그룹 생성
  if (category === 'bag' && filename === 'backpack') {
    const newGroup = document.createElement('div');
    newGroup.className = 'placed-item placed-group';
    newGroup.dataset.category = category;
    newGroup.style.position = 'absolute';
    newGroup.style.left = "0";
    newGroup.style.top = "0";

    const backSvgPath = this.getOnBodyPath(sourceItem.src, '-on-body-back.svg');
    const frontSvgPath = this.getOnBodyPath(sourceItem.src, '-on-body-front.svg');
    const newBackImg = this.createNewImgElement(backSvgPath, sourceItem.alt);
    const newFrontImg = this.createNewImgElement(frontSvgPath, sourceItem.alt);

    newBackImg.style.zIndex = (this.zIndexMap.body - 1).toString();
    newFrontImg.style.zIndex = this.zIndexMap.bag.toString();

    newGroup.appendChild(newBackImg);
    newGroup.appendChild(newFrontImg);

    newItem = newGroup;
  } else {
    // 일반 아이템
    newItem = this.createNewImgElement(this.getOnBodyPath(sourceItem.src), sourceItem.alt);
    newItem.dataset.category = category;

    const zIndex = this.zIndexMap[category] || 1;
    newItem.style.zIndex = zIndex.toString();
  }

  // 원본 아이템 참조 저장
  newItem.sourceItem = sourceItem;

  // DOM에 추가
  this.characterItems.appendChild(newItem);

  // 현재 카테고리에 착용한 아이템으로 등록
  this.wornItems[category] = newItem;

  console.log('착용 완료:', category);
}
```

---

## 💡 핵심 요약

- ✅ `getFilename()`으로 파일명 추출
- ✅ div로 여러 이미지 그룹화
- ✅ `createElement('div')`로 컨테이너 생성
- ✅ 각 이미지에 개별 z-index 적용
- ✅ `getOnBodyPath`에 커스텀 suffix 전달

**다음 강의**: 특수 케이스: 긴 머리와 예외 처리

---

## 🎓 추가 학습

**문자열 메서드 체이닝**:
```javascript
'img/svgs/item/backpack.svg'
  .split('/')           // 배열로 분리
  .pop()                // 마지막 요소
  .split('.')           // 다시 분리
  [0];                  // 첫 번째 요소

// 단계별로
const parts = 'img/svgs/item/backpack.svg'.split('/');
// ['img', 'svgs', 'item', 'backpack.svg']

const last = parts.pop();
// 'backpack.svg'

const nameParts = last.split('.');
// ['backpack', 'svg']

const filename = nameParts[0];
// 'backpack'
```

**z-index 음수**:
```css
.behind {
  z-index: -1;  /* 부모의 배경 위, 형제 요소 아래 */
}

.normal {
  z-index: 0;   /* 기본 레이어 */
}

.above {
  z-index: 1;   /* 일반 요소 위 */
}
```

**그룹화 패턴**:
```javascript
// 여러 요소를 하나의 단위로 관리
const group = document.createElement('div');
group.className = 'group';

const child1 = document.createElement('img');
const child2 = document.createElement('img');

group.appendChild(child1);
group.appendChild(child2);

// 그룹 전체를 한 번에 제어 가능
group.remove();  // 자식들도 함께 제거
group.style.opacity = '0.5';  // 모두에게 영향
```
