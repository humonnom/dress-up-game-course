# Part 3-11: 특수 케이스: 긴 머리와 예외 처리

**강의 시간**: 4분
**핵심 목표**: 특정 아이템만 z-index를 다르게 적용하는 예외 처리 구현하기

---

## 🎬 인트로 (15초)

안녕하세요! 지난 시간에는 백팩의 그룹 처리를 배웠습니다.

이번 시간에는 또 다른 예외 케이스를 다룰 거예요!

긴 생머리는 캐릭터 몸 뒤에 표시되어야 자연스럽습니다.
파일명으로 특수 케이스를 판단하고 z-index를 조건부로 적용하는 방법을 배워보겠습니다.

그럼 시작해볼까요!

---

## 💇 긴 머리의 문제 (40초)

먼저 문제 상황을 확인해볼게요.

*[화면: 긴 생머리 착용 - 현재 상태]*

현재 긴 머리의 z-index는?
```javascript
this.zIndexMap = {
  hair: 7  // 머리 카테고리
};
```

*[화면: 머리카락이 옷 위에 표시되는 모습]*

긴 생머리(7)가 상의(4), 바지(3) 위에 표시됩니다.
→ 부자연스러워요! 😅

**우리가 원하는 것**:
- 긴 생머리는 캐릭터 몸 뒤로
- z-index: body(0) + 1 = 1
- 짧은 머리나 초록 머리는 그대로 (z-index: 7)

---

## 🔍 해결 방법 설계 (30초)

전략:
1. **파일명 확인**: `long-straight`인지 체크
2. **조건부 z-index**: 긴 머리면 1, 아니면 기본값

```javascript
if (category === 'hair' && filename === 'long-straight') {
  zIndex = 1;  // 몸 뒤
} else {
  zIndex = this.zIndexMap[category] || 1;  // 기본값
}
```

---

## 💻 코드 구현 (2분)

`createItemOnCharacter`의 일반 아이템 블록에 예외 처리를 추가해요.

```javascript
createItemOnCharacter(sourceItem) {
  const category = sourceItem.dataset.category;

  // ... 중복 제거 로직
  // ... 백팩 처리 로직

  let newItem;
  const filename = this.getFilename(sourceItem.src);

  if (category === 'bag' && filename === 'backpack') {
    // 백팩 처리
    // ... (이전 강의 코드)
  } else {
    // 일반 아이템
    newItem = this.createNewImgElement(this.getOnBodyPath(sourceItem.src), sourceItem.alt);
    newItem.dataset.category = category;

    // ⭐ z-index 적용 - 예외 처리 추가
    let zIndex;
    if (category === 'hair' && filename === 'long-straight') {
      zIndex = this.zIndexMap.body + 1;  // 몸 바로 위 (1)
    } else {
      zIndex = this.zIndexMap[category] || 1;  // 기본값
    }

    newItem.style.zIndex = zIndex.toString();
  }

  // ... 나머지 코드
}
```

*[화면: 추가된 부분 하이라이트]*

### 조건 확인
```javascript
if (category === 'hair' && filename === 'long-straight')
```
- 카테고리가 'hair'이고
- 파일명이 'long-straight'일 때만

### z-index 계산
```javascript
zIndex = this.zIndexMap.body + 1;
```
- body는 0
- 0 + 1 = 1
- 양말(1)과 같은 레벨

---

## 🧪 테스트하기 (1분)

브라우저에서 테스트해볼까요!

*[화면: 여러 머리 스타일 착용 비교]*

### 테스트 1: 짧은 머리
```javascript
filename = 'short'
category = 'hair'
// 조건 불일치 → 기본값 사용
zIndex = this.zIndexMap['hair'] = 7
```

*[화면: 짧은 머리가 옷 위에 표시]*

결과: 옷(4) < 짧은 머리(7) ✅

### 테스트 2: 긴 생머리
```javascript
filename = 'long-straight'
category = 'hair'
// 조건 일치!
zIndex = this.zIndexMap.body + 1 = 1
```

*[화면: 긴 머리가 옷 뒤로]*

결과: 긴 머리(1) < 옷(4) ✅ 자연스러워요!

### 테스트 3: 초록 머리
```javascript
filename = 'green'
category = 'hair'
// 조건 불일치 → 기본값 사용
zIndex = this.zIndexMap['hair'] = 7
```

결과: 옷(4) < 초록 머리(7) ✅

---

## 🔧 확장 가능성 (30초)

이 패턴을 다른 아이템에도 적용할 수 있어요!

```javascript
// 예: 특정 아우터만 다른 z-index
if (category === 'outer' && filename === 'long-coat') {
  zIndex = 10;  // 모든 옷 위에
}

// 예: 특정 신발만
if (category === 'shoes' && filename === 'boots') {
  zIndex = 4;  // 바지 위에
}
```

조건만 추가하면 됩니다!

---

## 📝 마무리 및 다음 강의 예고 (15초)

오늘은 간단하지만 중요한 예외 처리를 배웠습니다!

핵심은:
- 파일명으로 특수 케이스 판단
- 조건문으로 z-index 분기
- body + 1로 몸 바로 위에 배치

다음 시간에는 디폴트 의상인 파자마를 다룰 거예요!
다른 옷을 입으면 파자마를 자동으로 숨기고, 옷을 벗으면 다시 보이게 하는 로직을 구현하겠습니다.

그럼 다음 강의에서 만나요!

---

## 💻 전체 코드

### js/app.js - createItemOnCharacter의 일반 아이템 블록 (Part 3-11 완성)

```javascript
else {
  // 일반 아이템
  newItem = this.createNewImgElement(this.getOnBodyPath(sourceItem.src), sourceItem.alt);
  newItem.dataset.category = category;

  // z-index 적용 - 예외 처리
  let zIndex;
  if (category === 'hair' && filename === 'long-straight') {
    zIndex = this.zIndexMap.body + 1;  // 몸 바로 위
  } else {
    zIndex = this.zIndexMap[category] || 1;  // 기본값
  }

  newItem.style.zIndex = zIndex.toString();
}
```

---

## 💡 핵심 요약

- ✅ 파일명과 카테고리로 특수 케이스 판단
- ✅ `if/else`로 z-index 조건부 적용
- ✅ `body + 1`로 캐릭터 바로 위에 배치
- ✅ 다른 머리 스타일은 기본값 유지
- ✅ 확장 가능한 패턴

**다음 강의**: 디폴트 의상 (파자마) 처리

---

## 🎓 추가 학습

**조건문 패턴**:
```javascript
// 패턴 1: if/else
if (condition) {
  value = specialCase;
} else {
  value = defaultCase;
}

// 패턴 2: 삼항 연산자 (간단한 경우)
const value = condition ? specialCase : defaultCase;

// 패턴 3: 다중 조건
let value;
if (condition1) {
  value = case1;
} else if (condition2) {
  value = case2;
} else {
  value = defaultCase;
}
```

**예외 처리 전략**:
```javascript
// 나쁜 예 - 모든 케이스를 하드코딩
if (filename === 'long-straight') { /* ... */ }
if (filename === 'short') { /* ... */ }
if (filename === 'green') { /* ... */ }
// → 아이템이 많아지면 관리 불가능

// 좋은 예 - 예외만 처리
if (filename === 'long-straight') {
  // 특별한 경우만
} else {
  // 나머지는 기본 로직
}
// → 확장 가능하고 유지보수 쉬움
```

**zIndexMap 활용**:
```javascript
// 다른 값 계산에도 활용 가능
const behind = this.zIndexMap.body - 1;  // -1
const justAbove = this.zIndexMap.body + 1;  // 1
const wayAbove = this.zIndexMap.hair + 10;  // 17
```
