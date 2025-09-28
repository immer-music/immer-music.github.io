document.addEventListener("DOMContentLoaded", () => {
    // 갤러리 데이터 (이미지, 캡션, 설명)
    const galleryData = [
    {
        iframe: `<iframe title="vimeo-player" src="https://player.vimeo.com/video/1075643093?h=679de50c09" width="640" height="360" frameborder="0" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"   allowfullscreen></iframe>`,
        thumb: "../images/ad_1.png"
    },
    {
        iframe: `<iframe title="vimeo-player" src="https://player.vimeo.com/video/1090451732?h=679de50c09" width="640" height="360" frameborder="0" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"   allowfullscreen></iframe>`,
        thumb: "../images/ad_2.png"
    },
    // ...더 추가
];

    const itemsPerPage = 1;
    let currentPage = 0;
    const totalPages = galleryData.length;

    const galleryGrid = document.querySelector('.gallery-grid');
    const scrollbar = document.querySelector('.gallery-scrollbar');
    const scrollbarThumbs = document.querySelector('.scrollbar-thumbnails');
    const scrollThumb = document.querySelector('.scroll-thumb');
    const detail = document.querySelector('.gallery-detail');
    const detailImg = document.getElementById('detail-img');
    const detailCaption = document.getElementById('detail-caption');
    const detailDesc = document.getElementById('detail-desc');
    const closeBtn = document.querySelector('.close-detail');
    const minimapOverview = document.querySelector('.minimap-overview');
    const detailMedia = document.getElementById('detail-media');

    // 갤러리 렌더링
    function renderGallery() {
        galleryGrid.innerHTML = "";
        const data = galleryData[currentPage];
        if (data && data.iframe) {
            const div = document.createElement('div');
            div.className = "gallery-item";
            div.innerHTML = data.iframe;
            galleryGrid.appendChild(div);
        }
        galleryGrid.style.opacity = "1";
    }
    galleryGrid.style.transition = "opacity 0.3s";

    // 썸네일 생성
    function renderScrollbarThumbnails() {
        scrollbarThumbs.innerHTML = "";
        for (let i = 0; i < totalPages; i++) {
            // 각 페이지의 첫번째 이미지 썸네일 사용
            const thumbIdx = i * itemsPerPage;
            const thumbImg = document.createElement('img');
            thumbImg.className = "scrollbar-thumb-img";
            thumbImg.src = galleryData[thumbIdx]?.img || "";
            if (i === currentPage) thumbImg.classList.add("active");
            scrollbarThumbs.appendChild(thumbImg);
        }
    }

    // 미니맵 오버뷰 생성
    function renderMinimapOverview() {
        minimapOverview.innerHTML = "";
        for (let page = 0; page < totalPages; page++) {
            const pageDiv = document.createElement('div');
            pageDiv.className = "minimap-page ad-minimap-page" + (page === currentPage ? " active" : "");
            pageDiv.dataset.page = page;
            // 한 페이지당 하나의 썸네일만 추가
            const thumbImg = document.createElement('img');
            thumbImg.className = "minimap-thumb ad-minimap-thumb";
            thumbImg.src = galleryData[page]?.thumb || "";
            pageDiv.appendChild(thumbImg);
            minimapOverview.appendChild(pageDiv);
        }
    }

    // 스크롤 위치/크기 업데이트
    function updateScrollThumb() {
        const thumbHeight = Math.max(48, scrollbar.offsetHeight / totalPages - 8); // 최소 48px
        scrollThumb.style.height = thumbHeight + "px";
        scrollThumb.style.top = (currentPage * (scrollbar.offsetHeight - thumbHeight) / (totalPages - 1)) + "px";
    }

    // 페이지 전환 시 호출
    function updateGalleryAndScrollbar() {
        renderGallery();
        renderScrollbarThumbnails();
        updateScrollThumb();
    }

    // 페이지 전환 및 미니맵 업데이트
    function updateGalleryAndMinimap() {
        renderGallery();
        renderMinimapOverview();
        updateScrollThumb();
    }

    // 페이지 전환 함수
    function changePage(newPage) {
        currentPage = newPage;
        renderGallery();           // 사진 4개 교체
        renderMinimapOverview();   // 미니맵 하이라이트 갱신
    }

    // 휠 이벤트에서 페이지 전환 시 호출
    document.querySelector('.gallery').addEventListener('wheel', (e) => {
        if (e.deltaY > 0 && currentPage < totalPages - 1) {
            changePage(currentPage + 1);
        } else if (e.deltaY < 0 && currentPage > 0) {
            changePage(currentPage - 1);
        }
        e.preventDefault();
    });

    // 상세창 닫기 함수
    function closeDetail() {
        detail.style.display = "none";
    }

    // 상세창 영역 클릭 시 닫기
    detail.addEventListener('click', closeDetail);

    // ESC 키로 닫기
    document.addEventListener('keydown', (e) => {
        if (detail.style.display === "flex" && e.key === "Escape") {
            closeDetail();
        }
    });

    // 미니맵 클릭 시 해당 페이지로 이동
    minimapOverview.addEventListener('click', (e) => {
        const pageDiv = e.target.closest('.minimap-page');
        if (pageDiv && pageDiv.dataset.page) {
            currentPage = parseInt(pageDiv.dataset.page);
            renderGallery();
            renderMinimapOverview();
        }
    });

    // 미니맵에서 마우스 휠로 페이지 전환
    document.querySelector('.gallery-minimap').addEventListener('wheel', (e) => {
        if (e.deltaY > 0 && currentPage < totalPages - 1) {
            currentPage++;
            renderGallery();
            renderMinimapOverview();
        } else if (e.deltaY < 0 && currentPage > 0) {
            currentPage--;
            renderGallery();
            renderMinimapOverview();
        }
        e.preventDefault();
    });

    // 초기 렌더링
    updateGalleryAndMinimap();
});