# Part 1-03: CSS 레이아웃 기본

**강의 시간**: 7분
**핵심 목표**: Flexbox로 레이아웃 잡고 position absolute로 요소 겹치기

---

## 🎬 인트로 (20초)

안녕하세요! 지난 시간에는 HTML 구조를 모두 만들었습니다.

이번 시간에는 CSS로 이 구조를 예쁘게 꾸며볼 거예요.
Flexbox로 양쪽 레이아웃을 잡고, position absolute로 캐릭터 위에 옷을 겹치는 방법을 배워보겠습니다.

그럼 시작해볼까요!

---

## 🎨 기본 스타일 리셋 (1분)

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
  z-index: 3;
}

#pajama-top {
  z-index: 4;
}
```

여기서 **z-index**가 등장합니다!
- 숫자가 클수록 위에 표시됩니다
- 파자마 상의(4)가 하의(3)보다 위에 보이죠

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
