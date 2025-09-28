document.addEventListener("DOMContentLoaded", () => {
    // 갤러리 데이터 (이미지, 캡션, 설명)
    const galleryData = [
        { img: "../images/permit.jpg", caption: "Permit (2024)", desc: "퍼밋에서 한건데 제목이 뭐지 이건<br>잘모르겟다" },
        { img: "../images/greygray.png", caption: "grey. gray. (2024)", desc: "작품 설명 2입니다." },
        { img: "../images/waterandlight.jpeg", caption: "Water and Light (2024)", desc: "작품 설명 3입니다." },
        { img: "../images/GC.png", caption: "GC (2024)", desc: "작품 설명 4입니다." },
        { img: "../images/wesa_res.jpg", caption: "WESA Residency (2023)", desc: "작품 설명 5입니다." },
        { img: "../images/insta.jpg", caption: "Insta (2022)", desc: "작품 설명 6입니다." },
        { img: "../images/insta.jpg", caption: "Insta (2022)", desc: "작품 설명 6입니다." },
        { img: "../images/insta.jpg", caption: "Insta (2022)", desc: "작품 설명 6입니다." },
        // ...더 추가 가능
    ];

    const itemsPerPage = 4;
    let currentPage = 0;
    const totalPages = Math.ceil(galleryData.length / itemsPerPage);

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
        // 페이드 아웃
        galleryGrid.style.opacity = "0";
        setTimeout(() => {
            galleryGrid.innerHTML = "";
            const startIdx = currentPage * itemsPerPage;
            for (let i = 0; i < itemsPerPage; i++) {
                const idx = startIdx + i;
                if (galleryData[idx]) {
                    const data = galleryData[idx];
                    const div = document.createElement('div');
                    div.className = "gallery-item";
                    div.dataset.index = idx;
                    div.innerHTML = `
                        ${data.iframe ? data.iframe : `<img src="${data.img}">`}
                        <div class="caption">${data.caption}</div>
                    `;
                    galleryGrid.appendChild(div);
                }
            }
            // 페이드 인
            galleryGrid.style.opacity = "1";
        }, 180); // 220ms 정도로 부드럽게
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
            pageDiv.className = "minimap-page" + (page === currentPage ? " active" : "");
            pageDiv.dataset.page = page; // 클릭용
            const startIdx = page * itemsPerPage;
            for (let i = 0; i < itemsPerPage; i++) {
                const idx = startIdx + i;
                const thumbImg = document.createElement('img');
                thumbImg.className = "minimap-thumb";
                thumbImg.src = galleryData[idx]?.img || "";
                pageDiv.appendChild(thumbImg);
            }
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

    // 갤러리 아이템 클릭 시 상세창 열기
    galleryGrid.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item');
        if (!item) return;
        const idx = parseInt(item.dataset.index);
        const data = galleryData[idx];

        // 미디어 영역 초기화
        detailMedia.innerHTML = "";

        if (data.iframe) {
            detailMedia.innerHTML = data.iframe;
        } else if (data.img) {
            detailMedia.innerHTML = `<img src="${data.img}" style="max-width:90vw;max-height:80vh;object-fit:contain;">`;
        }

        detailCaption.textContent = data.caption;
        detailDesc.innerHTML = data.desc;
        detail.style.display = "flex";
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