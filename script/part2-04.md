# Part 2-04: JavaScript 클래스 구조 설계

**강의 시간**: 6분
**핵심 목표**: ES6 클래스로 게임 구조 만들고 상태 관리 패턴 이해하기

---

## 🎬 인트로 (20초)

안녕하세요! 지난 시간까지 HTML과 CSS로 게임의 겉모습을 만들었습니다.

이제부터는 드디어 JavaScript로 게임에 생명을 불어넣을 거예요!

오늘은 ES6 클래스를 사용해서 게임의 전체 구조를 설계하고, 상태를 어떻게 관리할지 배워보겠습니다.

그럼 시작해볼까요!

---

## 🏗️ ES6 클래스란? (1분)

먼저 `js/app.js` 파일을 열어주세요.

ES6 클래스는 객체 지향 프로그래밍을 JavaScript에서 쉽게 할 수 있게 해주는 문법입니다.

```javascript
class DressUpGame {
  constructor() {
    // 초기화 코드
  }

  // 메서드들
}
```

*[화면: 클래스 개념 다이어그램]*

왜 클래스를 사용할까요?
1. **관련된 데이터와 기능을 하나로 묶기**
2. **코드 재사용과 유지보수가 쉬움**
3. **상태(state)를 체계적으로 관리 가능**

우리 게임의 모든 로직은 이 `DressUpGame` 클래스 안에 들어갈 거예요.

---

## 🎯 Constructor - 초기화 (1분 30초)

constructor는 클래스가 생성될 때 딱 한 번 실행됩니다.

```javascript
class DressUpGame {
  constructor() {
    // DOM 요소 참조
    this.characterArea = document.querySelector('.character-area');
    this.characterItems = document.getElementById('character-items');
    this.draggableItems = document.querySelectorAll('.draggable');
    this.draggedElement = null;
    this.isDraggingFromBoard = false;
  }
}
```

*[화면: 각 요소가 어떤 부분인지 시각적으로 표시]*

여기서 **this**는 현재 생성된 객체를 가리킵니다.

`this.characterArea`에 요소를 저장하면, 클래스의 다른 메서드에서도 사용할 수 있어요!

```javascript
// 나쁜 예 - 매번 찾아야 함
handleDrop() {
  const area = document.querySelector('.character-area');
  // ...
}

// 좋은 예 - 한 번만 찾고 재사용
handleDrop() {
  this.characterArea // 이미 저장됨!
  // ...
}
```

---

## 📦 디폴트 의상 참조 (30초)

파자마도 참조를 저장해둘게요.

```javascript
constructor() {
  // ... 이전 코드

  // 디폴트 의상
  this.pajamaTop = document.getElementById('pajama-top');
  this.pajamaBottom = document.getElementById('pajama-bottom');
}
```

나중에 다른 옷을 입으면 파자마를 숨겨야 하니까, 미리 참조를 저장해둡니다.

---

## 🗂️ 상태 관리 - wornItems (1분 30초)

이제 가장 중요한 부분입니다. **상태 관리**!

```javascript
constructor() {
  // ... 이전 코드

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
}
```

*[화면: wornItems 객체 구조 시각화]*

이 객체가 왜 중요할까요?

1. **현재 무엇을 입고 있는지 추적**
   - 예: `wornItems.top = 니트 이미지 요소`

2. **같은 카테고리는 하나만 착용**
   - 새 상의를 입으면 기존 상의를 먼저 제거

3. **디폴트 의상 표시 제어**
   - `wornItems.top`이 null이면 파자마 상의 표시

```javascript
// 사용 예시
this.wornItems.top = newShirt; // 상의 착용
this.wornItems.top = null;     // 상의 제거
```

---

## 📚 z-index 맵 설정 (1분)

옷의 쌓이는 순서를 미리 정의해둘게요.

```javascript
constructor() {
  // ... 이전 코드

  // 카테고리별 z-index 매핑
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
}
```

*[화면: 레이어 순서를 3D로 시각화]*

숫자가 클수록 위에 표시됩니다!
- 양말(1) < 신발(2) < 바지(3) < 상의(4) ...

논리적으로 생각해보면:
- 양말 위에 신발을 신죠
- 바지 위에 상의를 입죠
- 상의 위에 아우터를 입죠

---

## 🚀 초기화 메서드 (30초)

클래스가 생성된 후 초기화 작업을 할 메서드를 만들어요.

```javascript
class DressUpGame {
  constructor() {
    // ... 모든 초기화 코드

    this.init(); // 초기화 메서드 호출
  }

  init() {
    // 여기에 이벤트 리스너 등록할 예정
    console.log('게임 초기화 완료!');
  }
}
```

---

## 🎮 게임 인스턴스 생성 (30초)

마지막으로, 페이지가 로드되면 게임을 시작하도록 합니다.

```javascript
// 페이지 로드 시 게임 초기화
document.addEventListener('DOMContentLoaded', () => {
  new DressUpGame();
});
```

`DOMContentLoaded` 이벤트는 HTML이 모두 로드되면 발생합니다.

`new DressUpGame()`으로 클래스의 인스턴스를 생성하면:
1. constructor가 실행되고
2. 모든 요소 참조가 저장되고
3. init() 메서드가 호출됩니다

---

## 📝 마무리 및 다음 강의 예고 (20초)

오늘은 게임의 뼈대를 만들었습니다!

핵심은:
- ES6 클래스로 구조화
- DOM 요소 참조를 constructor에서 저장
- wornItems로 상태 관리
- zIndexMap으로 레이어 순서 정의

다음 시간에는 드디어 드래그 이벤트를 다뤄볼 거예요!
dragstart 이벤트로 드래그를 감지하는 방법을 배워보겠습니다.

그럼 다음 강의에서 만나요!

---

## 💻 전체 코드

### js/app.js (Part 2-04 완성)

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

    // 카테고리별 현재 착용 중인 아이템 추적 (각 카테고리당 하나의 아이템만)
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

    this.init();
  }

  init() {
    // 다음 강의에서 이벤트 리스너 추가 예정
    console.log('게임 초기화 완료!');
  }
}

// 페이지 로드 시 게임 초기화
document.addEventListener('DOMContentLoaded', () => {
  new DressUpGame();
});
```

---

## 🧪 테스트하기

브라우저를 열고 개발자 도구(F12)의 콘솔을 확인하세요.

"게임 초기화 완료!"가 출력되면 성공입니다!

콘솔에서 테스트해볼 수 있어요:
```javascript
// 콘솔에서 직접 실행 (디버깅용)
// 아직 전역 변수로 노출하지 않았지만, 나중에 테스트용으로 추가 가능
```

---

## 💡 핵심 요약

- ✅ ES6 클래스로 게임 구조화
- ✅ constructor에서 DOM 요소 참조 저장
- ✅ `this` 키워드로 클래스 내부에서 데이터 공유
- ✅ `wornItems` 객체로 착용 상태 관리
- ✅ `zIndexMap`으로 레이어 순서 정의
- ✅ `DOMContentLoaded`로 안전한 초기화

**다음 강의**: 드래그 이벤트 기초

---

## 🎓 추가 학습

**ES6 클래스 더 알아보기**:
- 메서드 정의
- 화살표 함수 vs 일반 함수
- private 필드 (# 사용)

**상태 관리 패턴**:
- 왜 전역 변수보다 클래스가 좋은가?
- 불변성(Immutability) 개념
