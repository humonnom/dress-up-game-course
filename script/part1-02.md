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

## 🎨 아이템 보드 구성 (2분)

이제 아이템 보드를 만들어볼게요. 먼저 머리 카테고리부터 시작하겠습니다.

```html
<div class="item-board">
  <!-- 머리 카테고리 -->
  <div class="item-category">
    <h3>머리</h3>
    <div class="item-list">
      <img src="img/svgs/hair/short.svg"
           class="item draggable"
           data-category="hair"
           alt="짧은 머리"
           draggable="true">
      <img src="img/svgs/hair/green.svg"
           class="item draggable"
           data-category="hair"
           alt="초록 머리"
           draggable="true">
      <img src="img/svgs/hair/long-straight.svg"
           class="item draggable"
           data-category="hair"
           alt="긴 생머리"
           draggable="true">
    </div>
  </div>
</div>
```

여기서 핵심은 **data-category 속성**입니다!

```html
data-category="hair"
```

이 속성을 사용하는 이유:
1. JavaScript에서 아이템의 카테고리를 쉽게 식별
2. 같은 카테고리의 아이템은 하나만 착용 가능하도록 제어
3. 카테고리별로 다른 z-index를 적용하기 위해

그리고 **draggable="true"** 속성은 HTML5 드래그 앤 드롭 API를 활성화합니다.

---

## 📦 나머지 카테고리 추가 (30초)

같은 방식으로 다른 카테고리들도 추가해볼게요.

```html
<!-- 상의 카테고리 -->
<div class="item-category">
  <h3>상의</h3>
  <div class="item-list">
    <img src="img/svgs/clothes/three-color-knit.svg"
         class="item draggable"
         data-category="top"
         alt="니트"
         draggable="true">
    <img src="img/svgs/clothes/check-shirt.svg"
         class="item draggable"
         data-category="top"
         alt="체크셔츠"
         draggable="true">
  </div>
</div>

<!-- 바지 카테고리 -->
<div class="item-category">
  <h3>바지</h3>
  <div class="item-list">
    <img src="img/svgs/clothes/jeans.svg"
         class="item draggable"
         data-category="pants"
         alt="청바지"
         draggable="true">
    <img src="img/svgs/clothes/cotton-pants.svg"
         class="item draggable"
         data-category="pants"
         alt="면바지"
         draggable="true">
  </div>
</div>
```

이런 식으로 양말, 신발, 가방, 액세서리 카테고리도 모두 추가하시면 됩니다.

---

## ♿ 접근성 중요성 (30초)

잠깐! 여기서 중요한 포인트 하나 짚고 넘어갈게요.

```html
alt="청바지"
```

모든 이미지에 **alt 속성**을 꼭 작성해야 합니다. 이유는:
1. 스크린 리더 사용자를 위한 접근성
2. 이미지 로드 실패 시 대체 텍스트 표시
3. SEO 최적화

간단하지만 매우 중요한 부분이니 꼭 잊지 마세요!

---

## 📝 마무리 및 다음 강의 예고 (20초)

오늘은 HTML 구조를 모두 만들어봤습니다.

핵심은:
- 시맨틱 HTML 사용
- data-category로 아이템 분류
- draggable 속성으로 드래그 가능하게 설정
- alt 속성으로 접근성 확보

다음 시간에는 CSS로 이 구조를 예쁘게 꾸며보겠습니다.
Flexbox와 Grid로 레이아웃을 잡고, position absolute로 요소를 겹치는 방법을 배워볼 거예요.

그럼 다음 강의에서 만나요!

---

## 💻 전체 코드

### index.html (전체)

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
      <!-- 캐릭터 영역 -->
      <div class="character-area">
        <img id="character" src="img/svgs/character.svg" alt="캐릭터">
        <!-- 기본 파자마 -->
        <div id="default-pajama">
          <img id="pajama-bottom" src="img/svgs/clothes/pajama-bottom-on-body.svg" alt="파자마 하의">
          <img id="pajama-top" src="img/svgs/clothes/pajama-top-on-body.svg" alt="파자마 상의">
        </div>
        <!-- 드롭된 아이템들이 여기에 배치됩니다 -->
        <div id="character-items"></div>
      </div>

      <!-- 아이템 보드 -->
      <div class="item-board">
        <!-- 머리 카테고리 -->
        <div class="item-category">
          <h3>머리</h3>
          <div class="item-list">
            <img src="img/svgs/hair/short.svg" class="item draggable" data-category="hair" alt="짧은 머리" draggable="true">
            <img src="img/svgs/hair/green.svg" class="item draggable" data-category="hair" alt="초록 머리" draggable="true">
            <img src="img/svgs/hair/long-straight.svg" class="item draggable" data-category="hair" alt="긴 생머리" draggable="true">
          </div>
        </div>

        <!-- 상의 카테고리 -->
        <div class="item-category">
          <h3>상의</h3>
          <div class="item-list">
            <img src="img/svgs/clothes/three-color-knit.svg" class="item draggable" data-category="top" alt="니트" draggable="true">
            <img src="img/svgs/clothes/check-shirt.svg" class="item draggable" data-category="top" alt="체크셔츠" draggable="true">
          </div>
        </div>

        <!-- 바지 카테고리 -->
        <div class="item-category">
          <h3>바지</h3>
          <div class="item-list">
            <img src="img/svgs/clothes/jeans.svg" class="item draggable" data-category="pants" alt="청바지" draggable="true">
            <img src="img/svgs/clothes/cotton-pants.svg" class="item draggable" data-category="pants" alt="면바지" draggable="true">
          </div>
        </div>

        <!-- 양말 카테고리 -->
        <div class="item-category">
          <h3>양말</h3>
          <div class="item-list">
            <img src="img/svgs/clothes/socks.svg" class="item draggable" data-category="socks" alt="양말" draggable="true">
            <img src="img/svgs/clothes/programmer-socks.svg" class="item draggable" data-category="socks" alt="코드 무늬 양말" draggable="true">
          </div>
        </div>

        <!-- 신발 카테고리 -->
        <div class="item-category">
          <h3>신발</h3>
          <div class="item-list">
            <img src="img/svgs/shoes/crocs.svg" class="item draggable" data-category="shoes" alt="크록스" draggable="true">
            <img src="img/svgs/shoes/slipper.svg" class="item draggable" data-category="shoes" alt="슬리퍼" draggable="true">
          </div>
        </div>

        <!-- 가방 카테고리 -->
        <div class="item-category">
          <h3>가방</h3>
          <div class="item-list">
            <img src="img/svgs/item/backpack.svg" class="item draggable" data-category="bag" alt="백팩" draggable="true">
            <img src="img/svgs/item/cross-bag.svg" class="item draggable" data-category="bag" alt="크로스백" draggable="true">
          </div>
        </div>

        <!-- 머리 액세서리 카테고리 -->
        <div class="item-category">
          <h3>머리 액세서리</h3>
          <div class="item-list">
            <img src="img/svgs/item/head-tag-cap.svg" class="item draggable" data-category="headwear" alt="헤드 태그 캡모자" draggable="true">
            <img src="img/svgs/item/love-cap.svg" class="item draggable" data-category="headwear" alt="코딩 좋아 캡모자" draggable="true">
          </div>
        </div>
      </div>
    </div>
  </main>
  <script src="js/app.js"></script>
</body>
</html>
```

---

## 💡 핵심 요약

- ✅ 시맨틱 HTML 구조 작성 (`<main>`, 의미 있는 클래스명)
- ✅ `data-category` 속성으로 아이템 분류
- ✅ `draggable="true"`로 드래그 가능하게 설정
- ✅ `alt` 속성으로 접근성 확보
- ✅ ID vs Class 사용 기준 이해

**다음 강의**: CSS 레이아웃 기본
