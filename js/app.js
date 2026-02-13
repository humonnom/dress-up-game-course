// 드래그 앤 드롭 게임
class DressUpGame {
  constructor() {
    this.boardDragMimeType = 'application/x-dressup-board-item';
    this.characterArea = document.querySelector('.character-area');
    this.characterItems = document.getElementById('character-items');
    this.draggableItems = document.querySelectorAll('.draggable');
    this.draggedElement = null;
    this.isDraggingFromBoard = false;
    this.activeMove = null;

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
      headwear: null
    };

    // 카테고리별 z-index 매핑
    this.zIndexMap = {
      body: 0, // 몸
      socks: 1,    // 양말
      shoes: 2,    // 신발
      pants: 3,    // 바지
      top: 4,      // 상의
      outer: 5,    // 아우터
      bag: 6,      // 가방
      hair: 7,     // 머리
      headwear: 8, // 머리 액세서리
      'music-device': 9, // 음악기기
    };

    this.init();
  }

  init() {
    // 아이템 보드의 아이템들에 드래그 이벤트 추가
    this.draggableItems.forEach(item => {
      item.addEventListener('dragstart', (e) => this.handleDragStart(e, true));
      item.addEventListener('dragend', (e) => this.handleDragEnd(e));
    });

    // 캐릭터에 배치된 아이템에서 브라우저 기본 이미지 드래그를 차단
    this.characterItems.addEventListener('dragstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
    }, true);
    this.characterItems.addEventListener('drop', (e) => {
      // 보드 드래그가 아닌 모든 내부 drop 차단
      const isBoardDrag = e.dataTransfer && e.dataTransfer.types && e.dataTransfer.types.includes(this.boardDragMimeType);
      if (!isBoardDrag) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    // 캐릭터 영역에 드롭 이벤트 추가
    this.characterArea.addEventListener('dragover', (e) => this.handleDragOver(e));
    this.characterArea.addEventListener('drop', (e) => this.handleDrop(e));
    this.characterArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
  }

  handleDragStart(e, fromBoard = false) {
    this.draggedElement = e.currentTarget;
    this.isDraggingFromBoard = fromBoard;

    e.currentTarget.classList.add('dragging');
    this.characterArea.classList.add('drag-over');

    e.dataTransfer.effectAllowed = 'move';
    if (fromBoard) {
      e.dataTransfer.setData(this.boardDragMimeType, '1');
    }
  }

  handleDragEnd(e) {
    e.target.classList.remove('dragging');
    this.characterArea.classList.remove('drag-over');
  }

  handleDragOver(e) {
    const isBoardDrag = e.dataTransfer && e.dataTransfer.types && e.dataTransfer.types.includes(this.boardDragMimeType);
    if (!this.isDraggingFromBoard || !isBoardDrag) return;

    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    // 드래그 소스의 effectAllowed와 타겟의 dropEffect가 불일치하면 드롭이 거부됨
  }

  handleDragLeave(e) {
    if (e.target === this.characterArea) {
      this.characterArea.classList.remove('drag-over');
    }
  }

  handleDrop(e) {
    e.preventDefault();
    const isBoardDrag = e.dataTransfer && e.dataTransfer.types && e.dataTransfer.types.includes(this.boardDragMimeType);
    if (!this.isDraggingFromBoard || !isBoardDrag) return;

    this.characterArea.classList.remove('drag-over');

    if (!this.draggedElement) return;

    if (this.isDraggingFromBoard) {
      this.createItemOnCharacter(this.draggedElement);
      this.draggedElement.style.display = 'none';
    }

    this.draggedElement = null;
    this.isDraggingFromBoard = false;
  }

  getOnBodyPath(originalSrc, suffix = '-on-body.svg') {
    return originalSrc.replace('.svg', suffix);
  }

  getFilename(path) {
    return path.split('/').pop().split('.')[0];
  }

  createNewImgElement(src, alt, className) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.className = className;
    img.style.position = 'absolute';
    img.style.width = '100%';
    img.style.height = 'auto';
    img.style.top = '0';
    img.style.left = '0';
    img.style.userSelect = 'none';
    img.style.webkitUserDrag = 'none';
    img.draggable = false;
    return img;
  }

  createItemOnCharacter(sourceItem) {
    const category = sourceItem.dataset.category;

    // 같은 카테고리의 기존 아이템이 있으면 제거
    if (this.wornItems[category]) {
      const oldItem = this.wornItems[category];

      // 기존 아이템의 원본을 보드에 다시 표시
      if (oldItem.sourceItem) {
        oldItem.sourceItem.style.display = '';
      }

      oldItem.remove();
      this.wornItems[category] = null;
    }

    let newItem;
    const filename = this.getFilename(sourceItem.src);

    // 가방은 앞/뒤 이미지로 구성된 그룹 생성
    if (category === 'bag' && filename === 'backpack') {
      const newGroup = document.createElement('div');
      newGroup.className = 'placed-item placed-group';
      newGroup.dataset.category = category;
      newGroup.style.position = 'absolute';
      newGroup.style.left = "0";
      newGroup.style.top = "0";

      const backSvgPath = this.getOnBodyPath(sourceItem.src, '-on-body-back.svg');
      const frontSvgPath = this.getOnBodyPath(sourceItem.src, '-on-body-front.svg');
      const newBackImg = this.createNewImgElement(backSvgPath, sourceItem.alt);
      const newFrontImg = this.createNewImgElement(frontSvgPath, sourceItem.alt);

      newBackImg.style.zIndex = (this.zIndexMap.body - 1).toString(); // 캐릭터 뒤
      newFrontImg.style.zIndex = this.zIndexMap.bag.toString(); // 가방 위치

      newGroup.appendChild(newBackImg);
      newGroup.appendChild(newFrontImg);

      newItem = newGroup;
    } else {
      newItem = this.createNewImgElement(this.getOnBodyPath(sourceItem.src), sourceItem.alt);
      newItem.dataset.category = category;

      // 카테고리별 z-index 적용
      let zIndex;
      // z-index 예외처리
      if(category === 'hair' && filename === 'long-straight') {
        zIndex = this.zIndexMap.body + 1;
      } else {
        zIndex = this.zIndexMap[category] || 1;
      }

      newItem.style.zIndex = zIndex.toString();
    }

    // 원본 아이템 참조 저장
    newItem.sourceItem = sourceItem;

    // 배치된 아이템에 이동 및 제거 기능 추가
    this.addItemControls(newItem, category);
    this.characterItems.appendChild(newItem);

    // 현재 카테고리에 착용한 아이템으로 등록
    this.wornItems[category] = newItem;

    // 파자마 표시 업데이트
    this.updatePajamaVisibility();
  }

  addItemControls(item, category) {
    // 배포 환경에서 이미지 기본 drag 동작(복사 고스트) 방지
    item.draggable = false;
    item.setAttribute('draggable', 'false');
    item.style.webkitUserDrag = 'none';
    item.style.userSelect = 'none';
    item.ondragstart = () => false;
    item.addEventListener('dragstart', (e) => e.preventDefault());
    item.addEventListener('mousedown', (e) => e.preventDefault());

    const innerImages = item.querySelectorAll ? item.querySelectorAll('img') : [];
    innerImages.forEach((img) => {
      img.draggable = false;
      img.setAttribute('draggable', 'false');
      img.style.userSelect = 'none';
      img.style.webkitUserDrag = 'none';
      img.ondragstart = () => false;
      img.addEventListener('dragstart', (e) => e.preventDefault());
      img.addEventListener('mousedown', (e) => e.preventDefault());
    });

    // 포인터 드래그로 아이템 위치 조정
    item.style.cursor = 'grab';
    item.style.touchAction = 'none';

    const handlePointerDown = (e) => this.handlePlacedItemPointerDown(e, item);
    const handlePointerMove = (e) => this.handlePlacedItemPointerMove(e);
    const handlePointerUp = (e) => this.handlePlacedItemPointerUp(e);

    item.addEventListener('pointerdown', handlePointerDown);
    item.addEventListener('pointermove', handlePointerMove);
    item.addEventListener('pointerup', handlePointerUp);
    item.addEventListener('pointercancel', handlePointerUp);

    // 더블클릭으로 아이템 제거
    const handleDoubleClick = () => {
      if (confirm('이 아이템을 제거하시겠습니까?')) {
        this.removePlacedItem(item, category);
      }
    };

    item.addEventListener('dblclick', handleDoubleClick);
  }

  handlePlacedItemPointerDown(e, item) {
    // 좌클릭/터치만 허용
    if (e.button !== undefined && e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation();
    this.cleanupDuplicatePlacedItems(item);

    this.activeMove = {
      item,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startLeft: parseFloat(item.style.left) || 0,
      startTop: parseFloat(item.style.top) || 0
    };

    item.style.cursor = 'grabbing';
    item.setPointerCapture(e.pointerId);
  }

  cleanupDuplicatePlacedItems(activeItem) {
    const category = activeItem.dataset.category;
    if (!category) return;

    const sameCategoryItems = this.characterItems.querySelectorAll(`[data-category="${category}"]`);
    sameCategoryItems.forEach((item) => {
      if (item !== activeItem) {
        item.remove();
      }
    });

    if (this.wornItems[category] !== activeItem) {
      this.wornItems[category] = activeItem;
    }
  }

  handlePlacedItemPointerMove(e) {
    if (!this.activeMove || this.activeMove.pointerId !== e.pointerId) return;

    const deltaX = e.clientX - this.activeMove.startX;
    const deltaY = e.clientY - this.activeMove.startY;

    this.activeMove.item.style.left = `${this.activeMove.startLeft + deltaX}px`;
    this.activeMove.item.style.top = `${this.activeMove.startTop + deltaY}px`;
  }

  handlePlacedItemPointerUp(e) {
    if (!this.activeMove || this.activeMove.pointerId !== e.pointerId) return;

    const item = this.activeMove.item;
    const category = item.dataset.category;
    const releasedOutsideCharacter = !this.isPointInsideElement(
      e.clientX,
      e.clientY,
      this.characterArea
    );

    if (item.hasPointerCapture(e.pointerId)) {
      item.releasePointerCapture(e.pointerId);
    }

    item.style.cursor = 'grab';

    if (releasedOutsideCharacter && category) {
      this.removePlacedItem(item, category);
    }

    this.activeMove = null;
  }

  isPointInsideElement(clientX, clientY, element) {
    const rect = element.getBoundingClientRect();
    return (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    );
  }

  removePlacedItem(item, category) {
    item.remove();

    // wornItems에서 제거
    if (this.wornItems[category] === item) {
      this.wornItems[category] = null;
    }

    // 원본 아이템 보드에 다시 표시
    if (item.sourceItem) {
      item.sourceItem.style.display = '';
    }

    // 파자마 표시 업데이트
    this.updatePajamaVisibility();
  }

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
}

// 이미지 로드 완료 확인 함수
function waitForImagesToLoad() {
  const itemBoardContent = document.getElementById('item-board-content');
  const images = itemBoardContent.querySelectorAll('img.item');

  const imagePromises = Array.from(images).map(img => {
    return new Promise((resolve, reject) => {
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
