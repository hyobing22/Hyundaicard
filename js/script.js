// ===============================================
// [0] 공통: 플러그인 등록 및 전역 세팅
// ===============================================
{
    gsap.registerPlugin(ScrollTrigger);

// 1. Lenis 부드러운 스크롤 초기화 (전역 단일 실행)
const lenis = new Lenis({
duration: 1.2,
easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0, 0);

// 2. 전역 커스텀 커서 세팅 (모든 <a> 태그 및 인터랙션 요소 호버 시 디자인 변경)
const cursor = document.querySelector(".custom-cursor");
const xTo = gsap.quickTo(cursor, "x", {duration: 0.2, ease: "power3.out"});
const yTo = gsap.quickTo(cursor, "y", {duration: 0.2, ease: "power3.out"});

window.addEventListener("mousemove", (e) => {
xTo(e.clientX);
yTo(e.clientY);
});

// A태그, 플레이트 버튼, 카드 버튼, 리스트 메뉴 등 클릭/이동 요소 처리
const interactiveElements = document.querySelectorAll("a");
interactiveElements.forEach((el) => {
el.addEventListener("mouseenter", () => cursor.className = "custom-cursor on-link");
el.addEventListener("mouseleave", () => cursor.className = "custom-cursor default");
});

}

// ===============================================
// [0.5] Section 01 Main 로직 (끈적이는 Blob 및 가로 패럴랙스)
// ===============================================
{

    gsap.to(".sec-01-main", {
            backgroundPosition: "40% center", // 0%에서 100% 위치로 부드럽게 이동
            ease: "none",
            scrollTrigger: {
                trigger: ".sec-01-main",
                start: "top top",
                end: "bottom top",
                scrub: true // 스크롤에 맞춰 동기화
            }
        });
        
    document.addEventListener("DOMContentLoaded", () => {
        
        // 1. 커서와 달라붙는 Blob 커서 처리 (GSAP quickTo로 부드럽게)
        const blobCursor = document.querySelector(".sec-01-main .blob-cursor");
        if(blobCursor) {
            const blobX = gsap.quickTo(blobCursor, "left", { duration: 0.6, ease: "power3.out" });
            const blobY = gsap.quickTo(blobCursor, "top", { duration: 0.6, ease: "power3.out" });
            
            // 기존 윈도우 마우스무브 이벤트에 연결
            window.addEventListener("mousemove", (e) => {
                blobX(e.clientX);
                blobY(e.clientY);
            });
        }

        // 2. 둥둥 떠다니는 원형 무작위 애니메이션 (JavaScript 제어)
        const blobs = document.querySelectorAll(".sec-01-main .blob-item");
        
        function animateBlob(blob) {
            // GSAP 유틸리티를 사용해 무작위 x, y 위치와 시간 생성
            gsap.to(blob, {
                x: () => `${gsap.utils.random(-15, 15)}vw`,
                y: () => `${gsap.utils.random(-15, 15)}vw`,
                duration: () => gsap.utils.random(4, 7),
                ease: "sine.inOut",
                onComplete: () => animateBlob(blob) // 완료되면 다시 무작위 이동 반복
            });
        }
        
        blobs.forEach(blob => animateBlob(blob));

        // 3. 중앙 정사각형 내부 이미지 가로 패럴랙스 (왼쪽에서 오른쪽으로)
        gsap.to(".sec-01-main .main-parallax-img", {
            // width 150% 기준, 남는 50%만큼 x축 이동 (xPercent: -33.33은 이미지 너비 기준 계산식)
            xPercent: -33.333, 
            ease: "none",
            scrollTrigger: {
                trigger: ".sec-01-main",
                start: "top top",     // 메인 섹션이 화면 상단에 있을 때 시작
                end: "bottom top",    // 메인 섹션이 화면 위로 다 넘어갈 때 끝
                scrub: true           // 스크롤과 완벽 동기화
            }
        });
        
    });
}


// ===============================================
// [1] Section 02 Intro 로직 (동기화 스크롤 및 GSAP 텍스트)
// ===============================================
{
 document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.set(".sec-02-intro .phone-composition", { width: "22.03vw", height: "47.91vw" });
    gsap.set(".sec-02-intro .screen-mask", { width: "20.2vw", height: "46.09vw", borderRadius: "2.34vw" });
    
    gsap.set(".sec-02-intro .screen-item-1", { autoAlpha: 1 });
    gsap.set(".sec-02-intro .element-item-1", { autoAlpha: 1 });

    // 🔥 [수정 1] 폰트 로딩이 완전히 끝난 후 텍스트를 쪼개서 자리 이탈(레이아웃 꼬임) 완벽 방지
    document.fonts.ready.then(() => {
        const splitIntro = new SplitType('.sec-02-intro .p-text', { types: 'lines' });
        
        // 🔥 [수정 2] 기존의 window resize 이벤트 삭제
        // 화면을 줄일 때 텍스트를 다시 쪼개면 GSAP 요소가 증발해버리므로 삭제하는 것이 안전합니다.
        // 이미 vw 단위를 쓰기 때문에 리사이즈를 안 해도 반응형으로 잘 줄어듭니다.

        const panels = document.querySelectorAll('.sec-02-intro .intro-panel');
        panels.forEach((panel, index) => {
            
            // 텍스트 애니메이션
            const headings = panel.querySelectorAll('.gsap-reveal-text'); 
            const lines = panel.querySelectorAll('.p-text .line');
            const allTargets = [...headings, ...lines];
            
            gsap.fromTo(allTargets, 
                { backgroundPositionX: "100%", x: "2.6vw" }, 
                { 
                    backgroundPositionX: "0%", 
                    x: "11.25vw", 
                    duration: 1.2, 
                    ease: "power2.inOut", 
                    stagger: 0.1, 
                    scrollTrigger: { 
                        trigger: panel, 
                        // 🔥 [수정 3] 애니메이션 시작 시점 늦춤!
                        // 기존 "top 70%" -> 패널 꼭대기가 화면 70% 지점에 올 때 시작 (빠름)
                        // 변경 "top 45%" -> 패널 꼭대기가 화면 45% 지점에 올 때 시작 (더 스크롤해야 시작됨)
                        start: "top 45%", 
                        toggleActions: "play none none reverse" 
                    }
                }
            );

            // 이미지 & 요소 페이드 인/아웃 트리거 (이미지는 화면 중앙쯤 왔을 때 자연스럽게 바뀌도록 유지)
            ScrollTrigger.create({
                trigger: panel,
                start: "top center",
                end: "bottom center",
                onEnter: () => fadeToCurrentPhone(index + 1),
                onEnterBack: () => fadeToCurrentPhone(index + 1)
            });

            // 패럴랙스(Parallax) 효과 
            const targetElement = document.querySelector(`.sec-02-intro .element-item-${index + 1}`);
            if(targetElement) {
                gsap.fromTo(targetElement, 
                    { y: "-13vw" }, 
                    { 
                        y: "-5vw", 
                        ease: "none", 
                        scrollTrigger: {
                            trigger: panel,
                            start: "top bottom", 
                            end: "bottom top",   
                            scrub: 1 
                        }
                    }
                );
            }
        });
    });

    // 폰 내부 화면 전환 함수
    function fadeToCurrentPhone(targetIndex) {
        gsap.to(".sec-02-intro .screen-item", { autoAlpha: 0, duration: 0.6, overwrite: "auto" });
        gsap.to(".sec-02-intro .element-item", { autoAlpha: 0, duration: 0.6, overwrite: "auto" });
        gsap.to(`.sec-02-intro .screen-item-${targetIndex}`, { autoAlpha: 1, duration: 0.6, overwrite: "auto" });
        gsap.to(`.sec-02-intro .element-item-${targetIndex}`, { autoAlpha: 1, duration: 0.6, overwrite: "auto" });
    }
});
}

// ===============================================
// [2] Section 03 Plate 로직 (3D 카드 회전 및 이미지 변경 + 패럴랙스 배경)
// ===============================================
{
    // 배경 가로 패럴랙스 효과 (유지)
    gsap.to(".sec-03-plate .plate-wrapper", {
        backgroundPosition: "100% 0", 
        ease: "none", 
        scrollTrigger: {
            trigger: ".sec-03-plate",
            start: "top bottom", 
            end: "bottom top",   
            scrub: true          
        }
    });
    
    const plateSection = document.querySelector('.sec-03-plate');
    const plateCardInner = document.querySelector('.sec-03-plate .card-inner');
    const plateOverlay = document.querySelector('.sec-03-plate .overlay');
    const plateCard = document.querySelector('.sec-03-plate .card');

    if(plateSection) {
        // 기존의 CSS transition 개입을 완전히 차단 (GSAP이 전담하도록 설정)
        plateCardInner.style.transition = 'none';
        plateOverlay.style.transition = 'none';

        plateSection.addEventListener('mousemove', function(e) {
            let rect = plateSection.getBoundingClientRect(); 
            
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
            
            // 3D 회전 각도 계산
            let rotateX = ((y / rect.height) - 0.5) * -40;
            let rotateY = ((x / rect.width) - 0.5) * 40;
            
            // 마우스 좌표를 퍼센트(%) 단위로 변환
            let percentX = (x / rect.width) * 100;
            let percentY = (y / rect.height) * 100;
            
            // 빛 반사 효과 중심점 실시간 추적
            plateOverlay.style.backgroundImage = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.58) 24%, rgba(255, 166, 0, 0.12) 65%, transparent 82%)`;
            
            // ★ GSAP을 활용한 부드러운 틸트(Tilt) 적용
            // 마우스가 들어오는 순간 0 위치에서 계산된 각도까지 0.5초간 부드럽게 이동시킵니다.
            gsap.to(plateCardInner, {
                rotationX: rotateX,
                rotationY: rotateY,
                duration: 0.5,
                ease: "power2.out",
                overwrite: "auto" // 겹치는 애니메이션 방지
            });

            gsap.to(plateOverlay, {
                filter: 'brightness(1.2) opacity(0.8)',
                duration: 0.5,
                ease: "power2.out",
                overwrite: "auto"
            });
        }); 

        plateSection.addEventListener('mouseleave', function() {
            // 마우스가 나갈 때도 GSAP으로 원상복구
            gsap.to(plateCardInner, {
                rotationX: 0,
                rotationY: 0,
                duration: 0.7, // 나갈 때는 조금 더 여유롭게 복구되도록 시간 늘림
                ease: "power2.out",
                overwrite: "auto"
            });
            
            gsap.to(plateOverlay, {
                filter: 'brightness(1.2) opacity(0)',
                duration: 0.7,
                ease: "power2.out",
                overwrite: "auto"
            });
        });
    }

    // 2-1. 플레이트 버튼 클릭 시 이미지 교체 (유지)
    const plateBtns = document.querySelectorAll('.sec-03-plate .plate-btns div');
    const plateImagePaths = [
        'images/cardIMG/plateCard/metal.png',
        'images/cardIMG/plateCard/copper.png',
        'images/cardIMG/plateCard/clear.png',
        'images/cardIMG/plateCard/art.png'
    ];
    plateBtns.forEach((button, index) => {
        button.addEventListener('click', () => {
            plateCard.style.backgroundImage = `url('${plateImagePaths[index]}')`;
            plateCard.style.transition = 'background-image 0.3s ease';
        });
    });
}
// ===============================================
// [3] Section 04 Culture 로직 (텍스트 애니메이션 및 jQuery 메뉴 롤링)
// ===============================================
{
    $(document).ready(function() {
    gsap.from(".sec-04-culture .culture-title, .sec-04-culture .culture-sentence", {
        scrollTrigger: { trigger: ".sec-04-culture .tgroup", start: "top 80%", toggleActions: "play none none reverse" },
        y: "3vw", opacity: 0, duration: 1, stagger: 0.3, ease: "power3.out"
    });

    gsap.from(".sec-04-culture .nav-item", {
        scrollTrigger: { trigger: ".sec-04-culture .list-nav", start: "top 85%", toggleActions: "play none none reverse" },
        y: "2vw", opacity: 0, duration: 0.8, stagger: 0.3, ease: "power3.out"
    });

    let rollInterval;
    function startImageRoll(targetFrame) {
        clearInterval(rollInterval);
        let $currentGroup = $(targetFrame);
        let $images = $currentGroup.find('img');
        let imgCount = $images.length;
        if(imgCount <= 1) return;

        rollInterval = setInterval(() => {
            let $activeImg = $currentGroup.find('img.active');
            let nextIndex = ($activeImg.index() + 1) % imgCount;
            $activeImg.removeClass('active');
            $images.eq(nextIndex).addClass('active');
        }, 2000); 
    }

    gsap.set('.sec-04-culture .nav-item.active .text-fill', { clipPath: 'inset(0 0% 0 0)' });
    gsap.set('.sec-04-culture .nav-item.active .underline', { width: '100%' });
    startImageRoll('#frame-1');

    $('.sec-04-culture .nav-item').on('mouseenter', function() {
        if($(this).hasClass('active')) return; 

        let $prevItem = $('.sec-04-culture .nav-item.active');
        $prevItem.removeClass('active');
        gsap.to($prevItem.find('.text-fill'), { clipPath: 'inset(0 0 0 100%)', duration: 0.4, ease: "power2.out" });
        gsap.to($prevItem.find('.underline'), { width: '0%', duration: 0.4, ease: "power2.out" });

        $(this).addClass('active');
        gsap.to($(this).find('.text-fill'), { clipPath: 'inset(0 0% 0 0)', duration: 0.4, ease: "power2.out" });
        gsap.to($(this).find('.underline'), { width: '100%', duration: 0.4, ease: "power2.out" });

        let targetFrame = $(this).data('target');
        $('.sec-04-culture .image-group').removeClass('active');
        $(targetFrame).addClass('active');
        startImageRoll(targetFrame);
    });
});
}



// ===============================================
// [4] Section 05 Alphabet 로직 (롤링 타이틀, 등장 애니메이션 및 카드 제어)
// ===============================================
{
    // 1. 등장 애니메이션 (타이틀, 설명, 카드 리스트)
    document.fonts.ready.then(() => {
        // [타이틀] 롤링 텍스트 애니메이션 설정
        const titleEl = document.querySelector('.sec-05-alphabet h2');
        const splitAlphabet = new SplitType(titleEl, { types: 'chars' });

        // 첨부해주신 이미지의 8가지 알파벳 컬러 배열 (빨, 노, 파, 늘, 핑, 주, 다, 베)
        const cardColors = ['#d11235', '#fce100', '#0a369d', '#13a5e5', '#f6cce0', '#ff6600', '#f15a22', '#f6e4ce'];

        // 각 글자(char) 내부에 원본 글자와 색상이 들어간 글자를 위아래로 배치
        splitAlphabet.chars.forEach((char, index) => {
            const text = char.innerText;
            const color = cardColors[index % cardColors.length]; // 색상 반복 배정

            char.innerHTML = `
                <div class="roll-wrap">
                    <span class="roll-txt original">${text}</span>
                    <span class="roll-txt colored" style="color: ${color};">${text}</span>
                </div>
            `;
        });

        // [타이틀] 스크롤 시 위로 굴러가는 애니메이션 (딱 한 번만)
        gsap.to(".sec-05-alphabet h2 .roll-wrap", {
            yPercent: -50, // 50%만큼 위로 밀어올려 아래에 숨겨둔 컬러 텍스트 노출
            duration: 0.8,
            stagger: 0.05, // 왼쪽부터 순차적으로 다다닥 돌아감
            ease: "back.out(1.5)",
            scrollTrigger: {
                trigger: ".sec-05-alphabet",
                start: "top 70%",
                once: true // 한 번만 실행
            }
        });
    });

    // [설명 p태그] 아래에서 위로 등장 (딱 한 번만)
    gsap.from(".sec-05-alphabet .title-area p", {
        y: "2vw",
        opacity: 0,
        duration: 0.8,
        delay: 0.3, // 타이틀이 돌기 시작할 즈음 등장
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".sec-05-alphabet",
            start: "top 70%",
            once: true
        }
    });

    // [카드 리스트] 아래에서 위로 하나씩 등장 (딱 한 번만)
    gsap.from(".sec-05-alphabet .card-item", {
        y: "6vw",
        opacity: 0,
        duration: 0.8,
        stagger: 0.1, // 0.1초 간격으로 순서대로 올라옴
        ease: "back.out(1.2)", // 끝부분에서 살짝 튕기는 텐션 부여
        scrollTrigger: {
            trigger: ".sec-05-alphabet",
            start: "top 50%", // 카드가 화면 중간쯤 왔을 때 시작
            once: true
        }
    });

    // ----------------------------------------------------
    // 기존 로직: 배경 패럴랙스 및 카드 호버/클릭 이벤트 유지
    // ----------------------------------------------------
    const bgParallax = document.querySelector('.sec-05-alphabet .bg-parallax');
    const alphaCards = document.querySelectorAll('.sec-05-alphabet .card');

    alphaCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const cardNum = this.getAttribute('data-card-num');
            bgParallax.style.backgroundImage = `url('images/cardIMG/alphabet/${cardNum}-bg.png')`;
        });
    });

    gsap.to(bgParallax, {
        yPercent: 60, ease: 'none',
        scrollTrigger: { trigger: '.sec-05-alphabet', start: 'top bottom', end: 'bottom top', scrub: true }
    });

    alphaCards.forEach(card => {
        card.addEventListener('click', function() {
            if (gsap.isTweening(this)) return;
            const cardNum = this.getAttribute('data-card-num');
            let imgIndex = parseInt(this.getAttribute('data-img-index'));
            const imgElement = this.querySelector('.card-img');
            const hoverElement = this.querySelector('.card-hover');

            gsap.to(hoverElement, { opacity: 0, duration: 0.1 });
            let tl = gsap.timeline({ onComplete: () => { hoverElement.style.opacity = ''; } });

            tl.to(this, { rotationY: '+=90', duration: 0.25, ease: 'power1.in' })
              .call(() => {
                  imgIndex = imgIndex >= 3 ? 1 : imgIndex + 1;
                  this.setAttribute('data-img-index', imgIndex);
                  imgElement.src = `images/cardIMG/alphabet/${cardNum}-${imgIndex}.png`;
                  gsap.set(this, { rotationY: '-=180' });
              })
              .to(this, { rotationY: '+=90', duration: 0.25, ease: 'power1.out' });
        });
    });
}


// ===============================================
// [5] Section 06 Premium 로직 (패럴랙스 & 곡선형 카드 스와이프)
// ===============================================
{

gsap.to('.sec-06-premium .parallax-bg', {
    yPercent: 15, ease: 'none',
    scrollTrigger: { trigger: '.sec-06-premium', start: 'top bottom', end: 'bottom top', scrub: true }
});
gsap.to('.sec-06-premium .top-text-area', {
    y: -150, opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '.sec-06-premium', start: 'top 20%', end: 'top -50%', scrub: true }
});
gsap.fromTo('.sec-06-premium .bottom-text-area', 
    { y: "-30vh" }, 
    { y: '55vh', ease: 'none', scrollTrigger: { trigger: '.sec-06-premium', start: 'top bottom', end: 'center center', scrub: true } }
);

// 동적 카드 생성 배열
const cardData = [
    { id: 1, name: 'the Orange', desc: '일상의 밀도를 높이는 혜택', background: 'images/cardIMG/premium/theOrange_1.png' },
    { id: 2, name: 'the Red', desc: '쇼핑도 여행도 언제나 핫하게', background: 'images/cardIMG/premium/theRed_1.png' },
    { id: 3, name: 'the Green Edition3', desc: '나를 위한 첫 번째 프리미엄', background: 'images/cardIMG/premium/theGreenEdition3_1.png' },
    { id: 4, name: 'Summit', desc: '정상에 선 당신의 카드', background: 'images/cardIMG/premium/Summit_1.png' },
    { id: 5, name: 'the Black', desc: '명성 그 이상의 가치', background: 'images/cardIMG/premium/theBlack_1.png' },
    { id: 6, name: 'the Purple', desc: '하이엔드 라이프스타일', background: 'images/cardIMG/premium/thePurple_1.png' },
    { id: 7, name: 'MX Black', desc: '적립과 할인의 완벽한 조합', background: 'images/cardIMG/premium/MXBlackEdition2_1.png' },
    { id: 8, name: 'the Pink', desc: '가장 감각적인 쇼핑 메이트', background: 'images/cardIMG/premium/thePinkEdition2_1.png' },
    { id: 9, name: 'the Red Stripe', desc: '끝없이 쌓이는 특권', background: 'images/cardIMG/premium/theRedStripeEdition2_1.png' },
];

const carousel = document.querySelector('.sec-06-premium .card-carousel');
if(carousel) {
    cardData.forEach(card => {
        const li = document.createElement('li');
        li.className = 'carousel-item';
        li.innerHTML = `
            <div class="card-info"><span>${card.name}</span><h3>${card.desc}</h3></div>
            <img src="${card.background}" alt="${card.name}" class="card-graphic">
        `;
        carousel.appendChild(li);
    });

    const premiumItems = document.querySelectorAll('.sec-06-premium .carousel-item');
    let premiumCurrentIndex = -1;
    const slots = [
        { x: -15, yPercent: 40,  scale: 0.8, opacity: 0, zIndex: 1 },  
        { x: 1,   yPercent: 40,  scale: 0.8, opacity: 1, zIndex: 2 },  
        { x: 13,  yPercent: 40,  scale: 0.8, opacity: 1, zIndex: 2 },  
        { x: 25,  yPercent: 40,  scale: 0.8, opacity: 1, zIndex: 2 },  
        { x: 37,  yPercent: 40,  scale: 0.8, opacity: 1, zIndex: 2 },  
        { x: 49,  yPercent: 40,  scale: 0.8, opacity: 1, zIndex: 2 },  
        { x: 65,  yPercent: -15, scale: 1.2, opacity: 1, zIndex: 10 }, 
        { x: 84,  yPercent: 40,  scale: 0.8, opacity: 1, zIndex: 2 },  
        { x: 96,  yPercent: 40,  scale: 0.8, opacity: 1, zIndex: 2 },  
    ];

    function updateCards(activeIdx) {
        premiumItems.forEach((item, i) => {
            let diff = (i - activeIdx + 9) % 9;
            let slotMap = { 0: 6, 1: 5, 2: 4, 3: 3, 4: 2, 5: 1, 6: 0, 7: 8, 8: 7 };
            let targetSlot = slots[slotMap[diff]];
            
            gsap.to(item, {
                left: targetSlot.x + 'vw', yPercent: targetSlot.yPercent, scale: targetSlot.scale,
                opacity: targetSlot.opacity, zIndex: targetSlot.zIndex, duration: 0.5, ease: "power2.out", overwrite: "auto"
            });
            diff === 0 ? item.classList.add('active') : item.classList.remove('active');
        });
    }

    ScrollTrigger.create({
        trigger: '.sec-06-premium', start: 'top top', end: '+=250%', pin: true,           
        onUpdate: (self) => {
            let progress = self.progress; 
            let newIndex = Math.min(8, Math.floor(progress * 9)); 
            if(newIndex !== premiumCurrentIndex) {
                premiumCurrentIndex = newIndex;
                updateCards(premiumCurrentIndex);
            }
        }
    });
}
}



// ===============================================
// [6] Section 07 PLCC 로직 (리스트 호버 시 이미지와 컬러 변경 + 3장 레이아웃 처리)
// ===============================================
{
    gsap.from(".sec-07-plcc .plcc-title, .sec-07-plcc .plcc-desc", {
        y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out",
        scrollTrigger: { trigger: ".sec-07-plcc", start: "top 70%", toggleActions: "play none none reset" }
    });

    const plccListItems = document.querySelectorAll('.sec-07-plcc .plcc-list li');
    const plccLeft = document.querySelector('.sec-07-plcc .plcc-left'); // 레이아웃 제어용 컨테이너
    const plccCards = document.querySelectorAll('.sec-07-plcc .plcc-card');
    const plccCardImgs = document.querySelectorAll('.sec-07-plcc .plcc-card img');
    let plccHoverTimeout;

    // 초기 진입 애니메이션
    gsap.fromTo(plccCards, 
        { x: '-30vw', opacity: 0 }, 
        { x: 0, opacity: 1, duration: 0.8, stagger: 0.5, ease: 'back.out(0.8)', delay: 0.5, scrollTrigger: { trigger: ".sec-07-plcc", start: "top 70%" } }
    );

    function getRandomColor() { return `hsl(${Math.floor(Math.random() * 360)}, 80%, 70%)`; }

    plccListItems.forEach((li) => {
        li.addEventListener('mouseenter', function() {
            const brandName = this.getAttribute('data-name');
            const is3Card = this.classList.contains('3card'); // 호버한 li가 3card 클래스를 가졌는지 판별

            plccHoverTimeout = setTimeout(() => {
                plccListItems.forEach(item => item.style.color = '#555');
                this.style.color = getRandomColor();
                
                // 1. 레이아웃 클래스 토글 (CSS 연동)
                if(is3Card) {
                    plccLeft.classList.add('is-3card');
                } else {
                    plccLeft.classList.remove('is-3card');
                }

                // 2. 이미지 소스 교체 (3장일 때는 4번째 이미지를 찾지 않도록 에러 방지)
                const activeCardsCount = is3Card ? 3 : 4;
                for(let i = 0; i < 4; i++) {
                    if(i < activeCardsCount) {
                        plccCardImgs[i].src = `images/cardIMG/PLCC/${brandName}_${i + 1}.png`;
                    }
                }
                
                // 3. GSAP 애니메이션 실행 타겟 설정 (3장이면 3번째 카드까지만 애니메이션)
                const targetCards = is3Card ? Array.from(plccCards).slice(0, 3) : plccCards;

                // 기존 애니메이션 초기화 후 새로 실행
                gsap.killTweensOf(plccCards); // 진행 중인 애니메이션 겹침 방지
                gsap.fromTo(targetCards, 
                    { x: '-30vw', opacity: 0 }, 
                    { x: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "back.out(0.8)", overwrite: "auto" }
                );
            }, 500); 
        });
        li.addEventListener('mouseleave', () => clearTimeout(plccHoverTimeout));
    });
}

// ===============================================
// [7] Footer 로직 (배너 애니메이션 및 텍스트 마스킹)
// ===============================================
{
    document.addEventListener("DOMContentLoaded", () => {
        // 1. Footer 배너 이미지 애니메이션 (위에서 아래로 살짝 내려오며 부드럽게 나타남)
        gsap.from(".footer-banner img", {
            scrollTrigger: {
                trigger: ".footer-banner",
                start: "top 90%", // 화면 하단에 배너가 보이기 시작할 때 실행
                toggleActions: "play none none reverse"
            },
            y: -30,         // 살짝 작아진 상태에서
            opacity: 0,     // 투명하게 시작
            duration: 2,
            ease: "ease-in"
        });

        // 2. 폰트 로딩 완료 후 텍스트 개별 쪼개기 및 애니메이션 적용 (레이아웃 꼬임 방지)
        document.fonts.ready.then(() => {
            const animTargets = [];

            // 2-1. p 태그 (문장) - SplitType으로 줄(line) 단위로 쪼개기
            const footerText = document.querySelector('footer .top p');
            if (footerText) {
                const split = new SplitType(footerText, { types: 'lines' });
                split.lines.forEach(line => {
                    // GSAP 마스킹을 위한 overflow: hidden 래퍼 생성
                    const wrapper = document.createElement('div');
                    wrapper.style.overflow = 'hidden';
                    wrapper.style.display = 'block'; 
                    
                    line.parentNode.insertBefore(wrapper, line);
                    wrapper.appendChild(line);
                    
                    animTargets.push(line);
                });
            }

            // 2-2. a 태그 (SNS 링크 및 Nav 메뉴) - 각각 개별적으로 감싸기
            const footerLinks = document.querySelectorAll('footer .top a');
            footerLinks.forEach(link => {
                // 기존 CSS 레이아웃(간격 등)을 유지하기 위해 <a> 태그 내부 텍스트만 래핑
                const textContent = link.innerHTML;
                link.innerHTML = '';
                
                const wrapper = document.createElement('span');
                wrapper.style.overflow = 'hidden';
                wrapper.style.display = 'inline-block';
                wrapper.style.verticalAlign = 'top';
                
                const innerText = document.createElement('span');
                innerText.style.display = 'inline-block';
                innerText.innerHTML = textContent;
                
                wrapper.appendChild(innerText);
                link.appendChild(wrapper);
                
                animTargets.push(innerText);
            });

            // 3. 수집된 모든 타겟(문장 두 줄 + 개별 링크들)을 개별 순차 애니메이션 처리
            gsap.from(animTargets, {
                scrollTrigger: {
                    trigger: "footer .top",
                    start: "top 85%", 
                    toggleActions: "play none none reverse"
                },
                yPercent: -100, // 마스크 위쪽 보이지 않는 곳에서 시작
                duration: 0.8,
                stagger: 0.05,  // 0.05초 간격으로 왼쪽부터 오른쪽으로 하나씩 타다닥 내려옴
                ease: "power3.out"
            });
        });
    });
}