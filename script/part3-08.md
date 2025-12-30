# Part 3-08: 아이템 중복 방지

**강의 시간**: 6분
**핵심 목표**: 같은 카테고리의 아이템을 중복 착용하지 못하도록 제어하기

---

## 🎬 인트로 (20초)

안녕하세요! 지난 시간에는 아이템을 캐릭터에게 입히는 데 성공했습니다.

하지만 지금은 상의를 여러 개 입을 수 있는 문제가 있죠!

이번 시간에는 같은 카테고리의 아이템은 하나만 착용할 수 있도록 만들어볼 거예요.
기존 아이템을 제거하고 교체하는 로직을 구현하겠습니다.

그럼 시작해볼까요!

---

## 🔍 문제 상황 확인 (30초)

현재 상태를 테스트해볼게요.

*[화면: 니트를 드롭 → 체크셔츠를 드롭]*

보시다시피:
- 니트와 체크셔츠가 동시에 착용됨
- 상의가 두 개! 😱
- 이건 원하는 동작이 아니죠

우리가 원하는 건:
- 새 상의를 입으면 기존 상의는 자동으로 벗겨지기
- 기존 상의는 아이템 보드로 돌아가기

---

## 🎯 wornItems 객체 활용 (1분)

기억하시나요? constructor에서 `wornItems` 객체를 만들었었죠!

```javascript
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
```

*[화면: wornItems 객체 구조 시각화]*

이 객체를 사용해서:
1. **현재 착용 중인 아이템 추적**
2. **중복 착용 감지**
3. **기존 아이템 제거**

---

## 🔄 createItemOnCharacter 수정 (2분 30초)

`createItemOnCharacter` 메서드 맨 앞에 중복 체크 로직을 추가해요.

```javascript
createItemOnCharacter(sourceItem) {
  const category = sourceItem.dataset.category;

  // 같은 카테고리의 기존 아이템이 있으면 제거
  if (this.wornItems[category]) {
    const oldItem = this.wornItems[category];

    // 기존 아이템의 원본을 보드에 다시 표시
    if (oldItem.sourceItem) {
      oldItem.sourceItem.style.display = '';
    }

    // 기존 아이템 제거
    oldItem.remove();
    this.wornItems[category] = null;
  }

  // ... 나머지 기존 코드
}
```

*[화면: 코드 한 줄씩 실행하며 설명]*

### 단계별 분석

**1. 기존 아이템 확인**
```javascript
if (this.wornItems[category]) {
  // 이미 착용 중이면...
}
```
- `wornItems.top`이 null이 아니면 착용 중
- null이면 처음 착용하는 거

**2. 기존 아이템 참조 가져오기**
```javascript
const oldItem = this.wornItems[category];
```
- 예: 니트 이미지 요소

**3. 원본 아이템 보드에 다시 표시**
```javascript
if (oldItem.sourceItem) {
  oldItem.sourceItem.style.display = '';
}
```
- 기억하시죠? 착용할 때 `display: 'none'`으로 숨겼었어요
- 이제 다시 보이게 합니다!
- `display = ''`는 기본값으로 돌림 (block)

**4. DOM에서 제거**
```javascript
oldItem.remove();
```
- 캐릭터에서 벗깁니다
- DOM에서 완전히 사라짐

**5. 상태 초기화**
```javascript
this.wornItems[category] = null;
```
- 이제 아무것도 안 입은 상태

---

## 📝 wornItems에 새 아이템 등록 (1분)

기존 코드 마지막 부분에 상태 업데이트를 추가해요.

```javascript
createItemOnCharacter(sourceItem) {
  // ... 중복 제거 로직
  // ... 아이템 생성 로직

  // DOM에 추가
  this.characterItems.appendChild(newItem);

  // 현재 카테고리에 착용한 아이템으로 등록
  this.wornItems[category] = newItem;

  console.log('착용 완료:', category, this.wornItems[category]);
}
```

**이제 흐름이 완성됩니다:**
1. 기존 아이템 제거 (있으면)
2. 새 아이템 생성
3. DOM에 추가
4. wornItems에 등록

---

## 🧪 테스트하기 (1분)

브라우저에서 테스트해볼까요!

*[화면: 실제로 아이템 교체 시연]*

### 테스트 시나리오 1: 상의 교체
1. **니트를 드롭**
   - 니트 착용됨
   - `wornItems.top = 니트 요소`
   - 아이템 보드의 니트 사라짐

2. **체크셔츠를 드롭**
   - 기존 니트가 벗겨짐
   - 아이템 보드에 니트가 다시 나타남
   - 체크셔츠 착용됨
   - `wornItems.top = 체크셔츠 요소`

완벽하죠! 🎉

### 테스트 시나리오 2: 다른 카테고리
1. **니트 착용 (상의)**
2. **청바지 착용 (바지)**
   - 니트는 그대로! ✅
   - 청바지만 착용됨
   - `wornItems.top = 니트`, `wornItems.pants = 청바지`

다른 카테고리는 영향을 받지 않습니다!

---

## 🐛 디버깅 팁 (30초)

콘솔에서 wornItems 상태를 확인할 수 있어요.

```javascript
createItemOnCharacter(sourceItem) {
  // ... 코드

  // 현재 착용 상태 출력
  console.log('현재 착용 중:', {
    top: this.wornItems.top ? '착용' : '없음',
    pants: this.wornItems.pants ? '착용' : '없음',
    shoes: this.wornItems.shoes ? '착용' : '없음'
  });
}
```

*[화면: 콘솔 출력]*

```
착용 완료: top <img ...>
현재 착용 중: {top: '착용', pants: '없음', shoes: '없음'}
```

---

## 📝 마무리 및 다음 강의 예고 (20초)

오늘은 아이템 중복을 방지했습니다!

핵심은:
- wornItems로 착용 상태 추적
- 기존 아이템 있으면 제거
- sourceItem으로 보드에 복원
- remove()로 DOM에서 제거

다음 시간에는 z-index를 더 자세히 다뤄볼 거예요.
실제로 코드에서 어떻게 적용하는지, 예외 케이스는 없는지 살펴보겠습니다.

그럼 다음 강의에서 만나요!

---

## 💻 전체 코드

### js/app.js - createItemOnCharacter 메서드 (Part 3-08 완성)

```javascript
createItemOnCharacter(sourceItem) {
  const category = sourceItem.dataset.category;

  // 같은 카테고리의 기존 아이템이 있으면 제거
  if (this.wornItems[category]) {
    const oldItem = this.wornItems[category];

    // 기존 아이템의 원본을 보드에 다시 표시
    if (oldItem.sourceItem) {
      oldItem.sourceItem.style.display = '';
    }

    // 기존 아이템 제거
    oldItem.remove();
    this.wornItems[category] = null;
  }

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

  // 현재 카테고리에 착용한 아이템으로 등록
  this.wornItems[category] = newItem;

  console.log('착용 완료:', category);
}
```

---

## 💡 핵심 요약

- ✅ `wornItems` 객체로 착용 상태 관리
- ✅ 조건문으로 기존 아이템 확인
- ✅ `remove()`로 DOM에서 제거
- ✅ `sourceItem.style.display = ''`로 보드에 복원
- ✅ 상태 업데이트 필수 (`wornItems[category] = newItem`)

**다음 강의**: z-index로 레이어 관리

---

## 🎓 추가 학습

**DOM 제거 메서드**:
```javascript
// 요소 제거
element.remove();              // 자기 자신 제거
parent.removeChild(element);   // 부모에서 자식 제거

// 모든 자식 제거
parent.innerHTML = '';         // 간단하지만 이벤트 리스너 손실
while (parent.firstChild) {    // 안전한 방법
  parent.removeChild(parent.firstChild);
}
```

**display 속성**:
```javascript
element.style.display = 'none';  // 숨김 (공간도 차지 안 함)
element.style.display = '';      // 기본값 복원
element.style.display = 'block'; // 명시적으로 표시

// visibility는 다름!
element.style.visibility = 'hidden'; // 숨김 (공간은 차지)
```
