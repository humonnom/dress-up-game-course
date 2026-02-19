# Part 1-02: HTML 구조 만들기

이제 본격적으로 코드를 작성해볼 거예요.
먼저, 깃헙 레포지토리 링크에서 fork하신 후에 클론해주세요.
폴더 구조는 이미
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

코드 작성하면서 중요한 부분을 설명:
[webstorm - 코드 작성하는 화면]
- `lang="ko"`: html 태그의 랭 속성, 랭귀지의 줄임말인데요. 값을 ko로 설정해서 한국어 문서임을 명시합니다.
- 메타태그의 `viewport` 설정도 해줍니다. 반응형 디자인을 위한 기본 설정이에요.
- 그리고 `<main>` 태그를 사용했어요. 메인 콘텐츠를 이 태그 안에다 표시할거에요. 라는 의미입니다.

[브라우저 - 아무것도 안보임]
아직 화면에는 아무것도 안보이지만, 'test'를 입력하면 화면에 나타나죠.
[브라우저 - test라는 글자가 보임]
---

## 🎮 게임 컨테이너 구조 (1분)

이제 빈 div인 `game-container` 안에 두 개의 주요 영역을 만들어볼게요.

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

게임은 크게 두 부분으로 나뉩니다. 이 두 부분을 div로 감싸서 구조를 잡아볼게요.
완성 화면에서 보여드렸던 왼쪽 부분을 **캐릭터 에리어**라고 클래스 이름을 지어주고, 오른쪽 부분을 **아이템 보드**라고 클래스 이름을 작성해줄게요.
여전히 화면에서는 아무것도 보이지 않겠지만, 구조는 완성되었습니다!

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
- `box-sizing: border-box`
박스 사이징 속성은 요소의 너비와 높이를 계산하는 방식을 정의하는데요.
디폴트로 `content-box`가 설정되어 있어서, 요소의 너비와 높이는 콘텐츠 영역만 포함합니다. 패딩과 테두리는 별도로 계산되죠.
요소의 총 너비와 높이에 패딩과 테두리가 포함되도록 하는 것이 더 직관적이기 때문에
일반적으로 이 속성을 `border-box`로 설정해서 작업해요.

- `max-width`: 화면이 너무 넓어지지 않도록 1400px로 제한 할게요.
- `margin: 0 auto`: 마진을 이렇게 설정하면 중앙 정렬 할 수 있어요.

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

- `display: flex`: 디스플레이 flex로, Flexbox 레이아웃을 활성화 해줍니다.
- `gap: 40px`: 캐릭터 영역과 아이템 보드 사이 간격은 40px로 설정할게요.
- `align-items: flex-start`: 어라인 아이템스를 flex-start로 설정해서 위쪽으로 정렬합니다.
- `height: 880px`: 마지막으로 전체 높이를 880px로 고정합니다.

[브라우저 - 개발자 도구에서 Flexbox 레이아웃 시각화]
이렇게 하면 캐릭터 영역과 아이템 보드가 자동으로 좌우로 배치됩니다!
아직 스타일링은 하지 않았기 때문에, 눈에 보이는 차이는 없죠.
개발자 도구에서 배경색을 설정해보면 레이아웃이 어떻게 구성되어 있는지 더 명확하게 볼 수 있어요.

---



## 👤 캐릭터 영역 구성 (1분 30초)

이제 캐릭터 영역을 자세히 만들어볼게요.

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
part1-02 브랜치 참고

## 💡 핵심 요약
