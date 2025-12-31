# Part 1-02: HTML 구조 만들기

**강의 시간**: 6분
**핵심 목표**: 시맨틱 HTML로 게임 기본 구조 작성하고 data 속성 활용하기

---

## 🎬 인트로 (20초)

안녕하세요! 지난 시간에는 프로젝트 전체 구조를 살펴봤습니다.

이번 시간에는 본격적으로 HTML 파일을 작성해볼 거예요.
캐릭터 영역과 아이템 보드를 어떻게 구성하는지, 특히 `data-category` 속성을 왜 사용하는지 배워보겠습니다.

그럼 시작해볼까요!

---

## 📝 기본 HTML 구조 작성 (1분)

먼저 `index.html` 파일을 열어주세요.

기본적인 HTML5 템플릿부터 작성하겠습니다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>개발자 옷 입히기 게임</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <main>
    <div class="game-container">
      <!-- 여기에 게임 내용이 들어갈 거예요 -->
    </div>
  </main>
  <script src="js/app.js"></script>
</body>
</html>
```

여기서 주목할 점은:
- `lang="ko"`: 한국어 문서임을 명시
- `viewport` 설정: 반응형 디자인을 위한 기본 설정
- `<main>` 태그: 시맨틱 HTML로 메인 콘텐츠 표시

화면에 아무것도 안보이지만, 'test'를 입력하면 화면에 나타남

---

## 🎮 게임 컨테이너 구조 (1분)

이제 `game-container` 안에 두 개의 주요 영역을 만들어볼게요.

```html
<div class="game-container">
  <!-- 캐릭터 영역 -->
  <div class="character-area">
    <!-- 캐릭터 관련 내용 -->
  </div>

  <!-- 아이템 보드 -->
  <div class="item-board">
    <!-- 아이템들이 표시될 곳 -->
  </div>
</div>
```

게임은 크게 두 부분으로 나뉩니다:
1. **character-area**: 왼쪽에 캐릭터와 착용한 아이템들
2. **item-board**: 오른쪽에 선택할 수 있는 아이템들

---

## 🎨 기본 스타일 리셋 (1분)

이제 만든 구조에 대해서 스타일링을 해볼게요.
먼저 `css/style.css` 파일을 열어주세요.

모든 브라우저에서 일관된 결과를 위해 기본 스타일을 리셋하겠습니다.

```css
/* 기본 리셋 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  padding: 20px;
}

main {
  max-width: 1400px;
  margin: 0 auto;
}
```

여기서 중요한 점:
- `box-sizing: border-box`: 패딩과 테두리를 너비에 포함
- `max-width`: 화면이 너무 넓어지지 않도록 제한
- `margin: 0 auto`: 중앙 정렬

---

## 📐 게임 컨테이너 레이아웃 (1분 30초)

이제 게임의 전체 레이아웃을 Flexbox로 잡아볼게요.

```css
.game-container {
  display: flex;
  gap: 40px;
  align-items: flex-start;
  height: 880px;
}
```

*[화면: 개발자 도구에서 Flexbox 레이아웃 시각화]*

- `display: flex`: Flexbox 레이아웃 활성화
- `gap: 40px`: 캐릭터 영역과 아이템 보드 사이 간격
- `align-items: flex-start`: 위쪽 정렬
- `height: 880px`: 전체 높이 고정
이렇게 하면 캐릭터 영역과 아이템 보드가 자동으로 좌우로 배치됩니다!
아직 각 영역을 스타일링하지 않아 보이지는 않음

---



## 👤 캐릭터 영역 구성 (1분 30초)

캐릭터 영역을 자세히 만들어볼게요.

```html
<div class="character-area">
  <img id="character" src="img/svgs/character.svg" alt="캐릭터">

  <!-- 기본 파자마 -->
  <div id="default-pajama">
    <img id="pajama-bottom"
         src="img/svgs/clothes/pajama-bottom-on-body.svg"
         alt="파자마 하의">
    <img id="pajama-top"
         src="img/svgs/clothes/pajama-top-on-body.svg"
         alt="파자마 상의">
  </div>

  <!-- 드롭된 아이템들이 여기에 배치됩니다 -->
  <div id="character-items"></div>
</div>
```

여기서 중요한 포인트:
- **character**: 캐릭터 기본 몸통 이미지
- **default-pajama**: 게임 시작 시 입고 있는 기본 의상
- **character-items**: JavaScript로 동적으로 추가될 아이템들이 들어갈 컨테이너

ID를 사용한 이유는 JavaScript에서 이 요소들을 직접 제어해야 하기 때문입니다.

---

## 👤 캐릭터 영역 스타일링 (1분 30초)

캐릭터 영역을 꾸며볼게요. 여기서 핵심은 **position: relative**입니다.

```css
.character-area {
  position: relative;
  background: white;
  margin-left: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

#character {
  display: block;
  pointer-events: none;
}
```

왜 `position: relative`가 중요할까요?

*[화면: position 개념 시각화]*

부모 요소를 `relative`로 설정하면, 내부의 `absolute` 요소들이 이 영역을 기준으로 위치하게 됩니다.

`pointer-events: none`은 캐릭터 이미지를 클릭할 수 없게 만들어서, 드래그 이벤트가 아래 요소로 전달되게 합니다.

---

## 🎭 요소 겹치기 - position absolute (2분)

이제 가장 중요한 부분입니다. 캐릭터 위에 옷을 어떻게 겹칠까요?

```css
#character-items {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

#character-items img {
  position: absolute;
  cursor: move;
  pointer-events: auto;
}
```

*[화면: 레이어 개념 설명]*

구조를 보면:
1. **#character**: 기본 레이어 (캐릭터 몸)
2. **#default-pajama**: 파자마 레이어
3. **#character-items**: 착용한 아이템들의 컨테이너

모두 같은 위치에 겹쳐집니다!

```css
#default-pajama {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

#default-pajama img {
  position: absolute;
  width: 100%;
  height: auto;
}

#pajama-bottom {
  z-index: 1;
}

#pajama-top {
  z-index: 2;
}
```

여기서 **z-index**가 등장합니다!
- 숫자가 클수록 위에 표시됩니다
- 파자마 상의(2)가 하의(1)보다 위에 보이죠

---


## 📝 마무리 및 다음 강의 예고 (20초)

핵심은:

다음 시간에는 오른쪽 아이템 보드를 만들어볼게요.

그럼 다음 강의에서 만나요!

---

## 💻 전체 코드

### index.html (전체)

```html

```

---

## 💡 핵심 요약
