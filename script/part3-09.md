# Part 3-09: z-index로 레이어 관리

**강의 시간**: 5분
**핵심 목표**: z-index를 코드에서 동적으로 적용하고 레이어 순서 제어하기

---

## 🎬 인트로 (20초)

안녕하세요! 지난 시간에는 아이템 중복을 방지했습니다.

이번 시간에는 z-index를 더 자세히 다뤄볼 거예요!

실제로 코드에서 어떻게 적용하는지, 왜 문자열로 변환해야 하는지, 그리고 기본값은 어떻게 설정하는지 배워보겠습니다.

그럼 시작해볼까요!

---

## 📚 zIndexMap 복습 (40초)

constructor에서 정의한 zIndexMap을 다시 보겠습니다.

```javascript
this.zIndexMap = {
  body: 0,         // 캐릭터 몸
  socks: 1,        // 양말
  shoes: 2,        // 신발
  pants: 3,        // 바지
  top: 4,          // 상의
  outer: 5,        // 아우터
  bag: 6,          // 가방
  hair: 7,         // 머리
  headwear: 8,     // 머리 액세서리
  'music-device': 9 // 음악기기
};
```

*[화면: 3D 레이어 스택 시각화]*

숫자가 클수록 위에 표시됩니다!
- 양말(1) → 바지(3) → 상의(4) → 아우터(5)

---

## 🎯 z-index 적용 코드 분석 (1분 30초)

`createItemOnCharacter`에서 z-index를 적용하는 부분을 자세히 봅시다.

```javascript
// z-index 적용
const zIndex = this.zIndexMap[category] || 1;
newItem.style.zIndex = zIndex.toString();
```

*[화면: 코드 실행 단계별 시각화]*

### 1. 카테고리에서 z-index 가져오기
```javascript
const zIndex = this.zIndexMap[category] || 1;
```

**예시 1**: `category = 'top'`
```javascript
this.zIndexMap['top']  // → 4
zIndex = 4
```

**예시 2**: `category = 'pants'`
```javascript
this.zIndexMap['pants']  // → 3
zIndex = 3
```

**예시 3**: `category = 'unknown'` (존재하지 않는 카테고리)
```javascript
this.zIndexMap['unknown']  // → undefined
zIndex = undefined || 1    // → 1 (기본값)
```

`|| 1`은 **기본값 설정**입니다!
- zIndexMap에 없는 카테고리면 1 사용
- 안전장치 역할

### 2. 문자열로 변환
```javascript
newItem.style.zIndex = zIndex.toString();
```

*[화면: 개발자 도구 Elements 탭]*

왜 toString()을 할까요?

**테스트 1 - 숫자로 설정**:
```javascript
newItem.style.zIndex = 4;
// 실제로는 내부적으로 '4'로 변환됨
// 작동은 하지만 명시적으로 하는 게 좋음
```

**테스트 2 - 문자열로 설정**:
```javascript
newItem.style.zIndex = '4';
// 명확하고 안전함!
```

CSS 속성은 항상 문자열이므로, 명시적으로 변환하는 게 좋은 습관입니다!

---

## 🧪 레이어 순서 테스트 (1분 30초)

실제로 테스트해볼까요!

*[화면: 여러 아이템을 순서대로 착용]*

### 테스트 시나리오 1: 올바른 순서
1. **양말 착용** → z-index: 1
2. **청바지 착용** → z-index: 3
3. **니트 착용** → z-index: 4

*[화면: Elements 탭에서 z-index 확인]*

```html
<div id="character-items">
  <img data-category="socks" style="z-index: 1;">
  <img data-category="pants" style="z-index: 3;">
  <img data-category="top" style="z-index: 4;">
</div>
```

결과: 니트(4) > 바지(3) > 양말(1) ✅

### 테스트 시나리오 2: 역순으로 착용
1. **니트 착용** → z-index: 4
2. **청바지 착용** → z-index: 3
3. **양말 착용** → z-index: 1

*[화면: DOM 순서는 다르지만 표시는 동일]*

```html
<div id="character-items">
  <img data-category="top" style="z-index: 4;">
  <img data-category="pants" style="z-index: 3;">
  <img data-category="socks" style="z-index: 1;">
</div>
```

결과: 여전히 니트(4) > 바지(3) > 양말(1) ✅

**중요**: DOM 순서와 관계없이 z-index가 우선!

---

## 📊 z-index 디버깅 (1분)

z-index가 제대로 적용되었는지 확인하는 방법들:

### 방법 1: 콘솔 로그
```javascript
createItemOnCharacter(sourceItem) {
  // ... 코드

  const zIndex = this.zIndexMap[category] || 1;
  newItem.style.zIndex = zIndex.toString();

  console.log(`${category}: z-index ${zIndex}`);
}
```

출력:
```
top: z-index 4
pants: z-index 3
socks: z-index 1
```

### 방법 2: 개발자 도구
*[화면: Elements 탭 → Computed 탭]*

1. 요소 선택
2. Computed 탭 열기
3. z-index 값 확인

### 방법 3: 시각적 확인
*[화면: 레이어가 잘못되었을 때]*

만약 바지가 상의 위에 보인다면?
→ z-index가 잘못 설정됨!

---

## ⚠️ z-index 주의사항 (30초)

### 주의 1: position 속성 필요
```javascript
newItem.style.position = 'absolute';  // 필수!
newItem.style.zIndex = '4';
```

`position`이 `static`이 아니어야 z-index가 작동합니다!

### 주의 2: 부모 요소 영향
```css
#character-items {
  position: absolute;
  /* 자식들의 z-index는 이 안에서만 유효 */
}
```

---

## 📝 마무리 및 다음 강의 예고 (20초)

오늘은 z-index를 자세히 다뤘습니다!

핵심은:
- zIndexMap으로 카테고리별 순서 정의
- `|| 1`로 기본값 설정
- toString()으로 문자열 변환
- position 속성 필수

다음 시간에는 특수 케이스를 다룰 거예요!
백팩처럼 앞/뒤 두 개의 이미지로 구성된 아이템을 어떻게 처리하는지 배워보겠습니다.

그럼 다음 강의에서 만나요!

---

## 💻 핵심 코드 정리

### z-index 적용 부분

```javascript
createItemOnCharacter(sourceItem) {
  const category = sourceItem.dataset.category;

  // ... 중복 제거 로직

  const onBodyPath = this.getOnBodyPath(sourceItem.src);
  const newItem = this.createNewImgElement(onBodyPath, sourceItem.alt);
  newItem.dataset.category = category;

  // ⭐ z-index 적용 (핵심!)
  const zIndex = this.zIndexMap[category] || 1;  // 기본값 1
  newItem.style.zIndex = zIndex.toString();      // 문자열 변환

  // ... 나머지 코드
}
```

---

## 💡 핵심 요약

- ✅ `zIndexMap[category]`로 값 가져오기
- ✅ `|| 1`로 기본값 설정 (안전장치)
- ✅ `toString()`으로 문자열 변환
- ✅ `position: absolute` 필수
- ✅ DOM 순서와 무관하게 z-index가 우선

**다음 강의**: 특수 케이스: 백팩 구현

---

## 🎓 추가 학습

**z-index의 작동 원리**:
```css
/* z-index가 작동하려면 position이 static이 아니어야 함 */
.element {
  position: relative;  /* 또는 absolute, fixed, sticky */
  z-index: 10;
}

/* static에서는 무시됨 */
.no-effect {
  position: static;  /* 기본값 */
  z-index: 999;      /* 작동 안 함! */
}
```

**stacking context (쌓임 맥락)**:
- 부모가 z-index를 가지면 자식들은 그 안에서만 비교됨
- 형제 요소끼리만 z-index 비교 가능

```html
<div style="z-index: 1">
  <div style="z-index: 999"><!-- 여전히 아래 요소보다 아래 --></div>
</div>
<div style="z-index: 2">
  <div style="z-index: 1"></div>
</div>
```

**OR 연산자 (||)**:
```javascript
const value = undefined || 'default';  // 'default'
const value = null || 'default';       // 'default'
const value = 0 || 'default';          // 'default' (주의!)
const value = '' || 'default';         // 'default' (주의!)
const value = false || 'default';      // 'default'
const value = 'hello' || 'default';    // 'hello'

// 0도 false로 취급되므로 주의!
const value = 0 || 10;  // 10 (0을 원했다면 문제!)

// 더 안전한 방법 (ES2020)
const value = 0 ?? 10;  // 0 (null과 undefined만 체크)
```
