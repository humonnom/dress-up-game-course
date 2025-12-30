# Part 5-16: 이미지 로드 완료 감지 (심화)

**강의 시간**: 7분
**핵심 목표**: Promise로 실제 이미지 로드를 감지하고 Promise.all()로 모든 이미지를 기다리기

---

## 🎬 인트로 (20초)

안녕하세요! 지난 시간에는 setTimeout으로 2초 후 로딩 화면을 숨겼습니다.

하지만 문제가 있죠. 실제로 이미지가 다 로드되었는지는 확인하지 않았어요!
- 인터넷이 느리면 2초 안에 안 끝날 수도 있고
- 인터넷이 빠르면 2초보다 훨씬 빨리 끝날 수도 있죠

이번 시간에는 **실제로** 모든 이미지가 로드될 때까지 기다리는 방법을 배워볼 거예요.
Promise와 비동기 처리의 핵심을 배워보겠습니다!

그럼 시작해볼까요!

---

## 🔍 문제점 분석 (30초)

현재 코드의 문제는?

*[화면: 타임라인 비교]*

### 현재 방식 (setTimeout)

```
0초   → 로딩 시작
 |
 | (무조건 2초 대기)
 |
2초   → 로딩 완료
```

**문제**:
- 이미지가 1초 만에 로드돼도 2초 기다림 😢
- 이미지가 3초 걸리는데 2초만 기다림 😱

### 개선 방식 (이미지 로드 감지)

```
0초   → 로딩 시작
 |
 | (이미지 실제 로드 시간)
 |
?초   → 모든 이미지 로드 완료 → 로딩 완료
```

**장점**:
- 실제 로드 시간만큼만 기다림 ✅
- 이미지가 안 끝났는데 보여주지 않음 ✅

---

## 🎯 이미지 로드 이벤트 (1분)

이미지 요소는 로드가 끝나면 `load` 이벤트를 발생시킵니다.

*[화면: 이미지 로드 과정]*

```javascript
const img = document.querySelector('img');

img.addEventListener('load', () => {
  console.log('이미지 로드 완료!');
});
```

### 이미 로드된 경우는?

```javascript
if (img.complete) {
  // 이미 로드됨 (캐시에 있거나 너무 빨라서)
  console.log('이미 로드된 이미지');
} else {
  // 아직 로딩 중
  img.addEventListener('load', () => {
    console.log('로드 완료!');
  });
}
```

**`img.complete`**:
- `true`: 이미 로드됨
- `false`: 아직 로딩 중

---

## 💡 Promise 기초 (1분 30초)

Promise는 "미래에 완료될 작업"을 나타냅니다.

*[화면: Promise 개념 다이어그램]*

```javascript
const promise = new Promise((resolve, reject) => {
  // 비동기 작업
  setTimeout(() => {
    resolve('성공!');  // 성공 시
    // 또는
    // reject('실패!');  // 실패 시
  }, 1000);
});

promise.then((result) => {
  console.log(result);  // '성공!'
});
```

**핵심 개념**:
- `new Promise`: Promise 생성
- `resolve`: 성공 처리
- `reject`: 실패 처리
- `.then()`: 완료 후 실행

### 이미지 로드를 Promise로

```javascript
function loadImage(img) {
  return new Promise((resolve, reject) => {
    if (img.complete) {
      // 이미 로드됨
      resolve();
    } else {
      // 로드 대기
      img.addEventListener('load', resolve);
      img.addEventListener('error', reject);
    }
  });
}
```

*[화면: 코드 흐름 설명]*

1. `img.complete` 체크
   - true면 즉시 `resolve()` 호출
2. false면 이벤트 리스너 등록
   - 로드 성공: `load` → `resolve()`
   - 로드 실패: `error` → `reject()`

---

## 🔧 waitForImagesToLoad 함수 구현 (2분)

이제 모든 이미지를 기다리는 함수를 만들어봅시다!

```javascript
function waitForImagesToLoad() {
  const itemBoardContent = document.getElementById('item-board-content');
  const images = itemBoardContent.querySelectorAll('img.item');

  const imagePromises = Array.from(images).map(img => {
    return new Promise((resolve) => {
      if (img.complete) {
        // 이미 로드된 이미지
        resolve();
      } else {
        // 로드 대기
        img.addEventListener('load', resolve);
        img.addEventListener('error', () => {
          console.warn(`Failed to load image: ${img.src}`);
          resolve(); // 에러가 나도 계속 진행
        });
      }
    });
  });

  return Promise.all(imagePromises);
}
```

*[화면: 코드 블록별로 나눠서 설명]*

### 블록 1: 이미지 요소 가져오기

```javascript
const itemBoardContent = document.getElementById('item-board-content');
const images = itemBoardContent.querySelectorAll('img.item');
```

- 아이템 보드의 모든 이미지 선택
- `img.item` 클래스만 (캐릭터 이미지는 제외)

### 블록 2: 각 이미지를 Promise로 변환

```javascript
const imagePromises = Array.from(images).map(img => {
  return new Promise((resolve) => {
    // ...
  });
});
```

*[화면: map 과정 시각화]*

```
images = [img1, img2, img3]
         ↓ .map()
imagePromises = [promise1, promise2, promise3]
```

### 블록 3: 이미지 로드 처리

```javascript
if (img.complete) {
  resolve();
} else {
  img.addEventListener('load', resolve);
  img.addEventListener('error', () => {
    console.warn(`Failed to load image: ${img.src}`);
    resolve(); // 에러가 나도 계속 진행
  });
}
```

**중요**: 에러가 나도 `resolve()` 호출!
- `reject()`를 하면 전체가 멈춤
- 일부 이미지 실패해도 나머지는 보여주기

### 블록 4: Promise.all()

```javascript
return Promise.all(imagePromises);
```

**`Promise.all()`**:
- 여러 Promise를 하나로 합침
- **모든** Promise가 완료될 때까지 대기
- 하나라도 reject되면 전체 reject

*[화면: Promise.all 타임라인]*

```
promise1: ──────✓ (1초)
promise2: ────────────✓ (2초)
promise3: ───────✓ (1.5초)

Promise.all: ────────────✓ (가장 긴 2초)
```

가장 늦은 것까지 기다립니다!

---

## 💻 DOMContentLoaded 수정 (1분)

이제 setTimeout 대신 이 함수를 사용합니다!

```javascript
document.addEventListener('DOMContentLoaded', () => {
  // 게임 초기화
  new DressUpGame();

  // 모든 아이템 이미지가 로드될 때까지 기다린 후 로딩 화면 숨기기
  waitForImagesToLoad().then(() => {
    const loadingScreen = document.getElementById('loading-screen');
    const itemBoardContent = document.getElementById('item-board-content');

    if (loadingScreen && itemBoardContent) {
      loadingScreen.style.display = 'none';
      itemBoardContent.style.display = 'block';
    }
  });
});
```

*[화면: 변경 전후 비교]*

### 변경 전 (setTimeout)

```javascript
setTimeout(() => {
  // 2초 후 무조건 실행
}, 2000);
```

### 변경 후 (Promise)

```javascript
waitForImagesToLoad().then(() => {
  // 모든 이미지 로드 완료 후 실행
});
```

**`.then()`**:
- Promise가 완료되면 실행
- 1초 걸리면 1초 후, 3초 걸리면 3초 후

---

## 🧪 테스트하기 (40초)

브라우저에서 테스트해볼까요!

*[화면: 네트워크 탭 열기]*

### 테스트 1: 정상 속도

1. **캐시 비우기**
   - 개발자 도구 → Network 탭
   - "Disable cache" 체크

2. **새로고침 (F5)**

*[화면: 네트워크 탭에서 이미지 로드 확인]*

```
jeans.svg         ──────✓ 0.5s
three-color...    ────────✓ 0.8s
hoodie.svg        ──────✓ 0.6s
...
```

*[화면: 콘솔 출력]*

```
게임 초기화 완료!
(이미지 로딩...)
(로딩 화면 사라짐)
```

모든 이미지가 로드된 후에 사라집니다! ✅

### 테스트 2: 느린 네트워크

1. **네트워크 속도 제한**
   - Network 탭 → Throttling: "Slow 3G"

2. **새로고침**

*[화면: 로딩 화면이 더 오래 보임]*

```
(5초 정도 로딩...)
→ 로딩 화면 사라짐
```

실제 로드 시간만큼 기다립니다! ✅

### 테스트 3: 캐시된 경우

1. **다시 새로고침**

*[화면: 거의 즉시 사라짐]*

```
(0.1초 만에 완료)
→ 로딩 화면 사라짐
```

이미 캐시돼서 빠릅니다! ✅

---

## 📝 마무리 및 다음 강의 예고 (15초)

오늘은 Promise로 실제 이미지 로드를 감지했습니다!

핵심은:
- `img.complete`로 이미 로드된 이미지 체크
- `load` 이벤트로 로드 완료 감지
- Promise로 비동기 작업 처리
- `Promise.all()`로 여러 Promise 대기
- `.then()`으로 완료 후 처리

다음 시간에는 시각적 피드백을 더 추가할 거예요!
드래그 시 효과, 호버 효과 등을 개선하겠습니다.

그럼 다음 강의에서 만나요!

---

## 💻 전체 코드

### js/app.js - waitForImagesToLoad 함수 (Part 5-16 완성)

```javascript
// 이미지 로드 완료 확인 함수
function waitForImagesToLoad() {
  const itemBoardContent = document.getElementById('item-board-content');
  const images = itemBoardContent.querySelectorAll('img.item');

  const imagePromises = Array.from(images).map(img => {
    return new Promise((resolve) => {
      if (img.complete) {
        // 이미 로드된 이미지
        resolve();
      } else {
        // 로드 대기
        img.addEventListener('load', resolve);
        img.addEventListener('error', () => {
          console.warn(`Failed to load image: ${img.src}`);
          resolve(); // 에러가 나도 계속 진행
        });
      }
    });
  });

  return Promise.all(imagePromises);
}

// 페이지 로드 시 게임 초기화
document.addEventListener('DOMContentLoaded', () => {
  new DressUpGame();

  // 모든 아이템 이미지가 로드될 때까지 기다린 후 로딩 화면 숨기기
  waitForImagesToLoad().then(() => {
    const loadingScreen = document.getElementById('loading-screen');
    const itemBoardContent = document.getElementById('item-board-content');

    if (loadingScreen && itemBoardContent) {
      loadingScreen.style.display = 'none';
      itemBoardContent.style.display = 'block';
    }
  });
});
```

---

## 💡 핵심 요약

- ✅ `img.complete`로 이미 로드된 이미지 확인
- ✅ `load` 이벤트로 로드 완료 감지
- ✅ `new Promise()`로 비동기 작업 Promise화
- ✅ `Array.from().map()`으로 Promise 배열 생성
- ✅ `Promise.all()`로 모든 Promise 대기
- ✅ `.then()`으로 완료 후 처리
- ✅ 에러 발생 시에도 `resolve()`로 계속 진행

**다음 강의**: 시각적 피드백 추가

---

## 🎓 추가 학습

**Promise 상태**:
```javascript
// Pending (대기): 아직 완료되지 않음
const promise = new Promise((resolve, reject) => {
  // 작업 중...
});

// Fulfilled (이행): 성공적으로 완료
resolve(value);

// Rejected (거부): 실패
reject(error);
```

**Promise 체이닝**:
```javascript
loadImage(img1)
  .then(() => loadImage(img2))
  .then(() => loadImage(img3))
  .then(() => {
    console.log('모두 완료!');
  })
  .catch(error => {
    console.error('에러 발생:', error);
  });
```

**Promise.all() vs Promise.race()**:
```javascript
// Promise.all: 모두 완료될 때까지
Promise.all([promise1, promise2, promise3])
  .then(results => {
    // results = [result1, result2, result3]
  });

// Promise.race: 가장 먼저 완료되는 것만
Promise.race([promise1, promise2, promise3])
  .then(result => {
    // 가장 빠른 것의 결과만
  });
```

**async/await (최신 문법)**:
```javascript
// Promise 방식
waitForImagesToLoad().then(() => {
  console.log('완료!');
});

// async/await 방식 (같은 동작)
async function init() {
  await waitForImagesToLoad();
  console.log('완료!');
}
```

**에러 처리**:
```javascript
// .catch()로 에러 처리
waitForImagesToLoad()
  .then(() => {
    console.log('성공!');
  })
  .catch(error => {
    console.error('에러:', error);
  });

// async/await의 에러 처리
async function init() {
  try {
    await waitForImagesToLoad();
    console.log('성공!');
  } catch (error) {
    console.error('에러:', error);
  }
}
```

**Promise 헬퍼 메서드**:
```javascript
// Promise.resolve: 즉시 완료된 Promise
const promise = Promise.resolve('값');

// Promise.reject: 즉시 거부된 Promise
const promise = Promise.reject('에러');

// Promise.allSettled: 모두 완료될 때까지 (성공/실패 무관)
Promise.allSettled([promise1, promise2, promise3])
  .then(results => {
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        console.log('성공:', result.value);
      } else {
        console.log('실패:', result.reason);
      }
    });
  });
```

**이미지 preload 패턴**:
```javascript
// 이미지 미리 로드
function preloadImages(urls) {
  return Promise.all(
    urls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = resolve;
        img.onerror = reject;
      });
    })
  );
}

preloadImages([
  'img1.jpg',
  'img2.jpg',
  'img3.jpg'
]).then(() => {
  console.log('모든 이미지 로드 완료!');
});
```

**로딩 진행률 표시**:
```javascript
function waitForImagesToLoad(onProgress) {
  const images = document.querySelectorAll('img.item');
  let loaded = 0;
  const total = images.length;

  const imagePromises = Array.from(images).map(img => {
    return new Promise(resolve => {
      if (img.complete) {
        loaded++;
        onProgress(loaded, total);
        resolve();
      } else {
        img.addEventListener('load', () => {
          loaded++;
          onProgress(loaded, total);
          resolve();
        });
      }
    });
  });

  return Promise.all(imagePromises);
}

// 사용
waitForImagesToLoad((loaded, total) => {
  const percent = Math.round((loaded / total) * 100);
  console.log(`${percent}% 완료`);
}).then(() => {
  console.log('100% 완료!');
});
```
