// 드래그 앤 드롭 게임
class DressUpGame {
  constructor() {
    this.characterArea = document.querySelector('.character-area');
    this.characterItems = document.getElementById('character-items');
    this.draggableItems = document.querySelectorAll('.draggable');
    this.draggedElement = null;
    this.offset = { x: 0, y: 0 };
    this.isDraggingFromBoard = false;

    this.init();
  }

  init() {
    // 아이템 보드의 아이템들에 드래그 이벤트 추가
    this.draggableItems.forEach(item => {
      item.addEventListener('dragstart', (e) => this.handleDragStart(e, true));
      item.addEventListener('dragend', (e) => this.handleDragEnd(e));
    });

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

    // 드래그 이미지 설정
    if (e.currentTarget.classList.contains('item-group')) {
      // 그룹 아이템인 경우 전체 div를 드래그 이미지로 사용
      e.dataTransfer.setDragImage(e.currentTarget, 50, 50);
    } else {
      // 단일 이미지인 경우
      const img = new Image();
      img.src = e.currentTarget.src;
      e.dataTransfer.setDragImage(img, 50, 50);
    }
    e.dataTransfer.effectAllowed = 'copy';
  }

  handleDragEnd(e) {
    e.target.classList.remove('dragging');
    this.characterArea.classList.remove('drag-over');
  }

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }

  handleDragLeave(e) {
    if (e.target === this.characterArea) {
      this.characterArea.classList.remove('drag-over');
    }
  }

  handleDrop(e) {
    e.preventDefault();
    this.characterArea.classList.remove('drag-over');

    if (!this.draggedElement) return;

    // 아이템 보드에서 드래그한 경우 새 아이템 생성
    if (this.isDraggingFromBoard) {
      this.createItemOnCharacter(this.draggedElement, 0, 0);
    }

    this.draggedElement = null;
    this.isDraggingFromBoard = false;
  }

  // 파일 경로에서 -on-body.svg 버전으로 변환
  getOnBodyPath(originalSrc) {
    return originalSrc.replace('.svg', '-on-body.svg');
  }

  createItemOnCharacter(sourceItem, x, y) {
    // 그룹 아이템인지 확인
    if (sourceItem.classList.contains('item-group')) {
      // 그룹 아이템인 경우 div 컨테이너 생성
      const newGroup = document.createElement('div');
      newGroup.className = 'placed-item placed-group';
      newGroup.style.position = 'absolute';
      newGroup.style.left = `${x}px`;
      newGroup.style.top = `${y}px`;

      // 첫 번째 이미지의 경로를 기준으로 -on-body.svg 경로 생성
      const firstImg = sourceItem.querySelector('.group-part');
      const onBodySrc = this.getOnBodyPath(firstImg.src);

      // -on-body.svg 이미지 사용
      const newImg = document.createElement('img');
      newImg.src = onBodySrc;
      newImg.alt = firstImg.alt;
      newImg.className = 'group-part';
      newImg.style.position = 'absolute';
      newImg.style.width = '100%';
      newImg.style.height = 'auto';
      newImg.style.top = '0';
      newImg.style.left = '0';
      newGroup.appendChild(newImg);

      // 배치된 아이템에 이동 및 제거 기능 추가
      this.addItemControls(newGroup);
      this.characterItems.appendChild(newGroup);
    } else {
      // 단일 이미지인 경우
      const newItem = document.createElement('img');
      newItem.src = this.getOnBodyPath(sourceItem.src);  // -on-body.svg 버전 사용
      newItem.alt = sourceItem.alt;
      newItem.className = 'placed-item';
      newItem.style.left = `${x}px`;
      newItem.style.top = `${y}px`;

      // 배치된 아이템에 이동 및 제거 기능 추가
      this.addItemControls(newItem);
      this.characterItems.appendChild(newItem);
    }
  }

  addItemControls(item) {
    let isDragging = false;
    let currentX = 0;
    let currentY = 0;
    let initialX = 0;
    let initialY = 0;

    // 마우스로 아이템 이동
    const handleMouseDown = (e) => {
      if (e.button !== 0) return; // 왼쪽 클릭만

      isDragging = true;
      initialX = e.clientX - currentX;
      initialY = e.clientY - currentY;

      item.style.cursor = 'grabbing';
      e.preventDefault();
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;

      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;

      const rect = this.characterItems.getBoundingClientRect();
      const x = currentX;
      const y = currentY;

      item.style.left = `${x}px`;
      item.style.top = `${y}px`;
    };

    const handleMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        item.style.cursor = 'move';
      }
    };

    // 더블클릭으로 아이템 제거
    const handleDoubleClick = () => {
      if (confirm('이 아이템을 제거하시겠습니까?')) {
        item.remove();
      }
    };

    // 이벤트 리스너 추가
    item.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    item.addEventListener('dblclick', handleDoubleClick);

    // 초기 위치 설정
    const rect = item.getBoundingClientRect();
    currentX = parseInt(item.style.left) || 0;
    currentY = parseInt(item.style.top) || 0;
  }
}

// 페이지 로드 시 게임 초기화
document.addEventListener('DOMContentLoaded', () => {
  new DressUpGame();
});
