(function () {
    'use strict';

    class TSlider {
        constructor() {
            console.log('Slider Initialized!');
            this.init();
        }

        init() {
            this.Slider = document.getElementById('slider');
            this.images = [...this.Slider.querySelectorAll('img')].map((img, index) => ({
                src: img.src,
                alt: img.alt || `Slide ${index + 1}`,
                url: img.dataset.url || "#",
                index
            }));

            this.currentIndex = 0;
            this.intervalTime = 6000;
            this.minScale = 0.7;
            this.isAnimating = false;

            this.createSliderElements();
            this.positionSlides();
            this.startSlider();
        }

        createSliderElements() {
            this.mainImages = this.createElement('div', 'mainImages');
            this.backgroundImages = this.createElement('div', 'backgroundImages');
            this.navigation = this.createElement('div', 'navigation');

            this.Slider.append(this.mainImages, this.backgroundImages, this.navigation);
            this.navigation.innerHTML = `<ul></ul>`;

            this.images.forEach(img => {
                this.createSlideElements(img);
                this.createNavigation(img);
            });

            this.slides = [...this.Slider.querySelectorAll('.mi__img')];
            this.bgSlides = [...this.Slider.querySelectorAll('.bi__imgCont')];
            this.navItems = [...this.navigation.querySelectorAll('li')];
        }

        createSlideElements(img) {
            const slide = this.createElement('div', 'mi__img', {
                backgroundImage: `url(${img.src})`,
                backgroundSize: 'cover',
                zIndex: this.images.length - img.index
            });

            const bgContainer = this.createElement('div', 'bi__imgCont', {
                innerHTML: `<div class="bi__img bi-${img.index}"></div>`,
                zIndex: 0
            });

            this.mainImages.appendChild(slide);
            this.backgroundImages.appendChild(bgContainer);
        }

        createNavigation(img) {
            const navItem = this.createElement('li', `navItem-${img.index}`);
            navItem.innerHTML = `
                <a href="${img.url}"></a>
                <div class="li__info">
                    <h5>${String(img.index + 1).padStart(2, '0')}</h5>
                    <h4>${img.alt}</h4>
                </div>
                <div class="li__info-mask"><div class="mask__infoContainer"></div></div>
                <div class="li__hoverLine"><div class="l"></div></div>`;

            this.navigation.querySelector('ul').appendChild(navItem);
        }

        positionSlides() {
            this.slides.forEach((slide, index) => {
                slide.classList.add(`sld-${index}`);
                slide.style.transform = index === 0 ? 'scale(1.3)' : `scale(${this.minScale}) translateY(-100vh)`;
                slide.style.opacity = index === 0 ? 1 : 0;
            });

            this.bgSlides.forEach((bgSlide, index) => {
                bgSlide.classList.add(`bg-${index}`);
                bgSlide.style.zIndex = index === this.currentIndex ? 2 : 0;
            });

            setTimeout(() => this.enterAnimation(), 1200);
        }

        enterAnimation() {
            this.slides[this.currentIndex].style.transition = 'transform 2.5s ease-out, opacity 2.5s';
            this.slides[this.currentIndex].style.transform = 'scale(1)';
            this.slides[this.currentIndex].style.opacity = 1;

            this.navigation.style.transition = 'opacity 1.2s ease-out, transform 1.2s';
            this.navigation.style.opacity = 1;
            this.navigation.style.transform = 'translateY(0)';

            this.startSlider();
        }

        startSlider() {
            setTimeout(() => this.nextSlide(), this.intervalTime);
        }

        nextSlide() {
            if (this.isAnimating) return;
            this.isAnimating = true;

            const prevIndex = this.currentIndex;
            this.currentIndex = (this.currentIndex + 1) % this.images.length;

            this.animateSlides(prevIndex, this.currentIndex);
        }

        animateSlides(prevIndex, nextIndex) {
            const prevSlide = this.slides[prevIndex];
            const nextSlide = this.slides[nextIndex];

            prevSlide.style.transition = 'transform 1.5s ease-out, opacity 1.5s';
            prevSlide.style.transform = `scale(${this.minScale}) translateY(100vh)`;
            prevSlide.style.opacity = 0;

            nextSlide.style.transition = 'transform 1.5s ease-out, opacity 1.5s';
            nextSlide.style.transform = 'scale(1)';
            nextSlide.style.opacity = 1;

            setTimeout(() => {
                prevSlide.style.transform = `scale(${this.minScale}) translateY(-100vh)`;
                prevSlide.style.opacity = 0;
                this.isAnimating = false;
                this.startSlider();
            }, 1600);
        }

        createElement(tag, className, styles = {}) {
            const element = document.createElement(tag);
            if (className) element.className = className;
            Object.assign(element.style, styles);
            return element;
        }
    }

    new TSlider();
})();
