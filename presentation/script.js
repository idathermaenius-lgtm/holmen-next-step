const slides = Array.from(document.querySelectorAll(".section-panel"));
const deck = document.querySelector("main");
const navLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
let activeIndex = 0;
let wheelLocked = false;

function indexFromHash(hash) {
  if (!hash) return 0;
  const id = hash.replace("#", "");
  const index = slides.findIndex((slide) => slide.id === id);
  return index >= 0 ? index : 0;
}

function setActiveSlide(index, updateHash = true) {
  activeIndex = Math.max(0, Math.min(index, slides.length - 1));
  deck.style.transform = `translateX(-${activeIndex * 100}vw)`;

  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeIndex;
    slide.toggleAttribute("aria-current", isActive);
    slide.querySelectorAll(".reveal").forEach((item) => {
      item.classList.toggle("is-visible", isActive);
    });
  });

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${slides[activeIndex].id}`);
  });

  if (updateHash && window.location.hash !== `#${slides[activeIndex].id}`) {
    history.replaceState(null, "", `#${slides[activeIndex].id}`);
  }
}

function goToNextSlide() {
  setActiveSlide(activeIndex + 1);
}

function goToPreviousSlide() {
  setActiveSlide(activeIndex - 1);
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetIndex = indexFromHash(link.getAttribute("href"));
    event.preventDefault();
    setActiveSlide(targetIndex);
  });
});

window.addEventListener("hashchange", () => {
  setActiveSlide(indexFromHash(window.location.hash), false);
});

window.addEventListener("keydown", (event) => {
  if (["ArrowRight", "PageDown", " "].includes(event.key)) {
    event.preventDefault();
    goToNextSlide();
  }

  if (["ArrowLeft", "PageUp"].includes(event.key)) {
    event.preventDefault();
    goToPreviousSlide();
  }

  if (event.key === "Home") {
    event.preventDefault();
    setActiveSlide(0);
  }

  if (event.key === "End") {
    event.preventDefault();
    setActiveSlide(slides.length - 1);
  }
});

window.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();
    if (wheelLocked || Math.abs(event.deltaY) < 28) return;

    wheelLocked = true;
    if (event.deltaY > 0) {
      goToNextSlide();
    } else {
      goToPreviousSlide();
    }

    window.setTimeout(() => {
      wheelLocked = false;
    }, 820);
  },
  { passive: false }
);

setActiveSlide(indexFromHash(window.location.hash), false);
