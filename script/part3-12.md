# Part 3-12: 디폴트 의상 (파자마) 처리

**강의 시간**: 5분
**핵심 목표**: 다른 옷을 입으면 파자마를 자동으로 숨기고, 옷을 벗으면 다시 보이게 하기

---

## 🎬 인트로 (20초)

안녕하세요! 지난 시간에는 긴 머리의 예외 처리를 배웠습니다.

이번 시간에는 파자마 처리를 구현할 거예요!

현재 캐릭터는 기본적으로 파자마를 입고 있죠. 다른 옷을 입으면 파자마는 자동으로 숨겨져야 합니다.
그리고 옷을 벗으면 다시 파자마가 보여야 하고요!

조건부 표시 로직을 구현하는 방법을 배워보겠습니다.

그럼 시작해볼까요!

---

## 🧩 파자마의 특별한 점 (40초)

먼저 HTML에서 파자마가 어떻게 정의되어 있는지 볼게요.

*[화면: index.html의 character-items 부분]*

```html
<div id="character-items">
  <!-- 디폴트 의상 -->
  <img id="pajama-top" src="img/svgs/default/pajama-top.svg" alt="파자마 상의">
  <img id="pajama-bottom" src="img/svgs/default/pajama-bottom.svg" alt="파자마 하의">
</div>
```

파자마는:
- 처음부터 HTML에 있음 (동적 생성 아님!)
- ID로 식별 가능
- 2개 요소: 상의 + 하의

*[화면: constructor에서 파자마 참조]*

```javascript
this.pajamaTop = document.getElementById('pajama-top');
this.pajamaBottom = document.getElementById('pajama-bottom');
```

이제 JavaScript에서 제어할 수 있습니다!

---

## 🎯 표시 규칙 정의 (30초)

파자마를 언제 보이고 숨길까요?

**파자마 상의**:
- 상의(top)를 입으면 → 숨김
- 아우터(outer)를 입으면 → 숨김
- 둘 다 안 입으면 → 표시

**파자마 하의**:
- 바지(pants)를 입으면 → 숨김
- 바지를 안 입으면 → 표시

*[화면: 조건 다이어그램]*

```
wornItems.top = null && wornItems.outer = null
  → 파자마 상의 표시

wornItems.top = 니트 || wornItems.outer = 코트
  → 파자마 상의 숨김
```

---

## 💻 updatePajamaVisibility 메서드 (1분 30초)

이 로직을 메서드로 만들어볼게요!

```javascript
updatePajamaVisibility() {
  // 상의 또는 아우터를 입으면 파자마 상의 숨김
  if (this.wornItems.top || this.wornItems.outer) {
    this.pajamaTop.style.display = 'none';
  } else {
    this.pajamaTop.style.display = 'block';
  }

  // 바지를 입으면 파자마 하의 숨김
  if (this.wornItems.pants) {
    this.pajamaBottom.style.display = 'none';
  } else {
    this.pajamaBottom.style.display = 'block';
  }
}
```

*[화면: 코드 한 줄씩 설명]*

### 파자마 상의 처리

```javascript
if (this.wornItems.top || this.wornItems.outer) {
```
- `||`는 논리 OR 연산자
- 상의 **또는** 아우터가 있으면 true
- 하나라도 입고 있으면 파자마 상의 숨김

```javascript
this.pajamaTop.style.display = 'none';
```
- CSS display를 'none'으로 설정
- 완전히 사라짐 (공간도 차지 안 함)

```javascript
} else {
  this.pajamaTop.style.display = 'block';
}
```
- 둘 다 안 입으면 다시 표시
- 'block'으로 설정하면 보임

### 파자마 하의 처리

```javascript
if (this.wornItems.pants) {
  this.pajamaBottom.style.display = 'none';
} else {
  this.pajamaBottom.style.display = 'block';
}
```

- 바지는 OR 조건 필요 없음
- 바지가 있으면 숨김, 없으면 표시
- 간단!

---

## 🔗 메서드 호출 시점 (40초)

이 메서드를 언제 호출해야 할까요?

### 시점 1: 아이템 착용 시

```javascript
createItemOnCharacter(sourceItem) {
  // ... 아이템 생성 로직

  // 현재 카테고리에 착용한 아이템으로 등록
  this.wornItems[category] = newItem;

  // ⭐ 파자마 표시 업데이트
  this.updatePajamaVisibility();
}
```

새 옷을 입을 때마다 체크!

### 시점 2: 아이템 제거 시 (더블클릭)

```javascript
const handleDoubleClick = () => {
  // ... 제거 로직

  // wornItems에서 제거
  if (this.wornItems[category] === item) {
    this.wornItems[category] = null;
  }

  // ⭐ 파자마 표시 업데이트
  this.updatePajamaVisibility();
};
```

옷을 벗을 때도 체크!

---

## 🧪 테스트하기 (1분)

브라우저에서 테스트해볼까요!

*[화면: 여러 시나리오 시연]*

### 테스트 1: 상의 착용

**초기 상태**:
```javascript
wornItems.top = null
wornItems.outer = null
// → 파자마 상의 표시 ✅
```

**니트 착용**:
```javascript
wornItems.top = 니트
// if (this.wornItems.top || this.wornItems.outer) → true
// → 파자마 상의 숨김 ✅
```

*[화면: 파자마 상의가 사라지는 모습]*

### 테스트 2: 상의 → 아우터

**니트 착용 중**:
```javascript
wornItems.top = 니트
wornItems.outer = null
// → 파자마 상의 숨김
```

**코트 착용** (니트는 교체로 벗겨짐):
```javascript
wornItems.top = null  // 중복 제거로 null
wornItems.outer = 코트
// if (null || 코트) → true
// → 파자마 상의 여전히 숨김 ✅
```

OR 조건 덕분에 제대로 작동!

### 테스트 3: 모든 옷 제거

**코트 더블클릭 → 제거**:
```javascript
wornItems.top = null
wornItems.outer = null
// if (null || null) → false
// → else: 파자마 상의 표시 ✅
```

*[화면: 파자마 상의가 다시 나타나는 모습]*

완벽합니다! 🎉

### 테스트 4: 바지

**청바지 착용**:
```javascript
wornItems.pants = 청바지
// → 파자마 하의 숨김 ✅
```

**청바지 제거**:
```javascript
wornItems.pants = null
// → 파자마 하의 표시 ✅
```

---

## 💡 왜 OR 연산자를 쓸까? (30초)

상의와 아우터는 왜 OR로 체크할까요?

```javascript
if (this.wornItems.top || this.wornItems.outer)
```

**이유**:
- 상의(니트, 셔츠)와 아우터(코트)는 둘 다 파자마 상의를 가림
- **하나라도** 입고 있으면 파자마 숨김
- 둘 다 안 입어야만 파자마 표시

**AND를 쓰면?**
```javascript
if (this.wornItems.top && this.wornItems.outer)  // ❌ 잘못된 로직
```
- 둘 다 입어야만 파자마 숨김
- 니트만 입으면 파자마가 같이 보임 → 이상해요!

---

## 📝 마무리 및 다음 강의 예고 (20초)

오늘은 파자마 표시를 조건부로 제어했습니다!

핵심은:
- wornItems 상태 확인
- OR 연산자로 여러 조건 체크
- display: 'none' / 'block'으로 토글
- 착용/제거 시점에 모두 호출

Part 3가 완성되었습니다! 이제 기본적인 게임 로직이 모두 구현되었어요.

다음 파트에서는 사용자 인터랙션을 추가할 거예요!
마우스로 아이템 위치를 조정하고, 영역 밖으로 드래그해서 삭제하는 기능을 배워보겠습니다.

그럼 다음 강의에서 만나요!

---

## 💻 전체 코드

### js/app.js - updatePajamaVisibility 메서드 (Part 3-12 완성)

```javascript
updatePajamaVisibility() {
  // 상의 또는 아우터를 입으면 파자마 상의 숨김
  if (this.wornItems.top || this.wornItems.outer) {
    this.pajamaTop.style.display = 'none';
  } else {
    this.pajamaTop.style.display = 'block';
  }

  // 바지를 입으면 파자마 하의 숨김
  if (this.wornItems.pants) {
    this.pajamaBottom.style.display = 'none';
  } else {
    this.pajamaBottom.style.display = 'block';
  }
}
```

### js/app.js - 호출 지점 1: createItemOnCharacter

```javascript
createItemOnCharacter(sourceItem) {
  // ... 아이템 생성 로직

  this.characterItems.appendChild(newItem);
  this.wornItems[category] = newItem;

  // 파자마 표시 업데이트
  this.updatePajamaVisibility();
}
```

### js/app.js - 호출 지점 2: addItemControls의 handleDoubleClick

```javascript
const handleDoubleClick = () => {
  if (confirm('이 아이템을 제거하시겠습니까?')) {
    item.remove();

    if (this.wornItems[category] === item) {
      this.wornItems[category] = null;
    }

    if (item.sourceItem) {
      item.sourceItem.style.display = '';
    }

    // 파자마 표시 업데이트
    this.updatePajamaVisibility();
  }
};
```

---

## 💡 핵심 요약

- ✅ `||` 연산자로 여러 조건 체크 (OR)
- ✅ `display: 'none'`으로 숨김
- ✅ `display: 'block'`으로 표시
- ✅ 착용 시와 제거 시 모두 호출
- ✅ wornItems 상태 기반으로 조건부 렌더링

**다음 강의**: Part 4 - 사용자 인터랙션

---

## 🎓 추가 학습

**논리 연산자**:
```javascript
// OR (||) - 하나라도 true면 true
true || false   // true
false || true   // true
false || false  // false

// AND (&&) - 둘 다 true여야 true
true && false   // false
true && true    // true
false && false  // false

// NOT (!) - 반대
!true   // false
!false  // true
```

**display 속성**:
```css
/* 완전히 숨김 (공간도 차지 안 함) */
display: none;

/* 블록 요소로 표시 */
display: block;

/* 인라인 요소로 표시 */
display: inline;

/* Flexbox */
display: flex;
```

**visibility vs display**:
```javascript
// display: none - 공간도 차지 안 함
element.style.display = 'none';

// visibility: hidden - 공간은 차지, 보이지만 않음
element.style.visibility = 'hidden';
```

**실전 패턴**:
```javascript
// 패턴 1: 단일 조건
if (condition) {
  element.style.display = 'none';
} else {
  element.style.display = 'block';
}

// 패턴 2: 삼항 연산자
element.style.display = condition ? 'none' : 'block';

// 패턴 3: 여러 조건 (OR)
if (condition1 || condition2 || condition3) {
  element.style.display = 'none';
}

// 패턴 4: 여러 조건 (AND)
if (condition1 && condition2 && condition3) {
  element.style.display = 'none';
}
```

**nullish와 falsy**:
```javascript
// Falsy 값들 (|| 연산자에서 false로 취급)
false || 'default'   // 'default'
0 || 'default'       // 'default'
'' || 'default'      // 'default'
null || 'default'    // 'default'
undefined || 'default' // 'default'

// wornItems에서는 null만 신경쓰면 됨
this.wornItems.top   // 객체 또는 null
```

**토글 패턴**:
```javascript
// 현재 상태를 반대로
element.style.display = element.style.display === 'none' ? 'block' : 'none';

// 조건 기반 토글
function toggleElement(show) {
  element.style.display = show ? 'block' : 'none';
}
```
