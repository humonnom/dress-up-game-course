# Part 1-03: CSS 레이아웃 기본

**강의 시간**: 7분
**핵심 목표**:

---

## 🎬 인트로 (20초)

안녕하세요! 지난 시간에는 왼쪽 캐릭터 부분 구조를 만들고 스타일링 까지 했습니다.

이번 시간에는 오른쪽 아이템 보드 구조를 만들고 스타일링 할 거예요.

그럼 시작해볼까요!

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

## 🎨 아이템 보드 스타일링 (1분)

이제 아이템 보드를 꾸며볼게요.

```css
.item-board {
  flex: 1;
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 880px;
  overflow-y: auto;
}

.item-category {
  margin-bottom: 30px;
}

.item-category h3 {
  margin: 0 0 15px 0;
  color: #555;
  font-size: 18px;
}
```

- `flex: 1`: 남은 공간을 모두 차지
- `overflow-y: auto`: 내용이 많으면 스크롤 표시

---

## 🖼️ 아이템 리스트 레이아웃 (1분)

아이템들을 Flexbox로 배치해볼게요.

```css
.item-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 10px;
}

.item {
  width: 120px;
  height: auto;
  padding: 10px;
  background: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: grab;
  transition: all 0.2s ease;
}

.item:hover {
  transform: scale(1.05);
  border-color: #4CAF50;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}
```

*[화면: 호버 효과 시연]*

- `flex-wrap: wrap`: 공간이 부족하면 다음 줄로
- `cursor: grab`: 드래그 가능함을 시각적으로 표시
- `transition`: 부드러운 애니메이션 효과
- `transform: scale(1.05)`: 호버 시 5% 확대

---

## 🎯 카테고리별 크기 조정 (30초)

일부 아이템은 크기가 달라야 합니다.

```css
.item[data-category="top"],
.item[data-category="outer"],
.item[data-category="headwear"] {
  width: 150px;
}

.item[data-category="socks"],
.item[data-category="shoes"] {
  width: 200px;
}
```

CSS에서도 `data-category` 속성을 선택자로 사용할 수 있습니다!

---

## 🎬 드래그 중 스타일 (30초)

드래그할 때 시각적 피드백을 추가해볼게요.

```css
.item.dragging {
  opacity: 0.5;
  cursor: grabbing;
}

.character-area.drag-over {
  background-color: #e8f5e9;
  border: 2px dashed #4CAF50;
}
```

나중에 JavaScript로 이 클래스들을 추가/제거할 거예요.

---

## 📝 마무리 및 다음 강의 예고 (20초)

오늘은 CSS로 전체 레이아웃을 완성했습니다!

핵심은:
- Flexbox로 양쪽 레이아웃
- position absolute로 요소 겹치기
- z-index로 레이어 순서 제어
- data 속성 선택자 활용

다음 시간부터는 드디어 JavaScript로 들어갑니다!
클래스 구조를 설계하고 상태 관리를 어떻게 할지 배워볼 거예요.

그럼 다음 강의에서 만나요!

---

## 💻 전체 코드

### css/style.css (전체)

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

/* 게임 컨테이너 */
.game-container {
  display: flex;
  gap: 40px;
  align-items: flex-start;
  height: 880px;
}

/* 캐릭터 영역 */
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

/* 기본 파자마 */
#default-pajama {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

#default-pajama img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
}

#pajama-bottom {
  z-index: 3;
}

#pajama-top {
  z-index: 4;
}

/* 아이템 보드 */
.item-board {
  flex: 1;
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 880px;
  overflow-y: auto;
}

.item-category {
  margin-bottom: 30px;
}

.item-category h3 {
  margin: 0 0 15px 0;
  color: #555;
  font-size: 18px;
}

.item-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 10px;
}

/* 아이템 스타일 */
.item {
  width: 120px;
  height: auto;
  padding: 10px;
  background: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: grab;
  transition: all 0.2s ease;
}

.item:hover {
  transform: scale(1.05);
  border-color: #4CAF50;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

/* 카테고리별 크기 조정 */
.item[data-category="top"],
.item[data-category="outer"],
.item[data-category="headwear"] {
  width: 150px;
}

.item[data-category="socks"],
.item[data-category="shoes"] {
  width: 200px;
}

/* 드래그 상태 */
.item.dragging {
  opacity: 0.5;
  cursor: grabbing;
}

.character-area.drag-over {
  background-color: #e8f5e9;
  border: 2px dashed #4CAF50;
}
```

---

## 💡 핵심 요약

- ✅ Flexbox로 양쪽 레이아웃 구성
- ✅ `position: relative` + `absolute`로 요소 겹치기
- ✅ `z-index`로 레이어 순서 제어
- ✅ `data-category` 속성 선택자 활용
- ✅ 호버 효과와 transition으로 사용자 경험 개선

**다음 강의**: JavaScript 클래스 구조 설계

---

## 🎨 시각 자료 제안

강의 중 보여주면 좋은 것들:
1. **Flexbox 레이아웃**: Chrome 개발자 도구의 Flexbox 시각화
2. **position absolute**: 레이어 개념 다이어그램
3. **z-index**: 3D 스택 시각화
4. **호버 효과**: 실제로 마우스를 올려서 효과 시연
