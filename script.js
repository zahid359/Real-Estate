// ELITE HOUSE Real Estate Website JavaScript

// Declare bootstrap variable
const bootstrap = window.bootstrap

// Global variables
const isScrolling = false
const navbar = document.querySelector(".navbar")
const scrollToTopBtn = document.getElementById("scrollToTop")

document.addEventListener("DOMContentLoaded", () => {
  // Initialize all functions
  initializeWebsite()
  initGalleryLightbox()
})

// Main initialization function
function initializeWebsite() {
  initNavigation()
  initScrollAnimations()
  initCounters()
  initImageLazyLoading()
  initContactForm()
  initSmoothScrolling()
  initMobileOptimizations()
  initPerformanceOptimizations()
}

// Navigation functionality
function initNavigation() {
  // Navbar scroll effect
  window.addEventListener("scroll", throttle(handleNavbarScroll, 10))

  // Active nav link highlighting
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link")
  const sections = document.querySelectorAll("section[id]")

  window.addEventListener(
    "scroll",
    throttle(() => {
      highlightActiveNavLink(navLinks, sections)
    }, 100),
  )

  // Mobile menu close on link click
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const navbarCollapse = document.querySelector(".navbar-collapse")
      if (navbarCollapse.classList.contains("show")) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse)
        bsCollapse.hide()
      }
    })
  })
}

// Handle navbar scroll effect
function handleNavbarScroll() {
  if (window.scrollY > 100) {
    navbar.classList.add("scrolled")
    navbar.style.background = "rgba(255, 255, 255, 0.95)"
    navbar.style.backdropFilter = "blur(10px)"
  } else {
    navbar.classList.remove("scrolled")
    navbar.style.background = "white"
    navbar.style.backdropFilter = "none"
  }
}

// Highlight active navigation link
function highlightActiveNavLink(navLinks, sections) {
  let current = ""

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.clientHeight

    if (window.scrollY >= sectionTop - 200) {
      current = section.getAttribute("id")
    }
  })

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active")
    }
  })
}

// Scroll Animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate")

        // Trigger counter animation if element has counter class
        if (entry.target.classList.contains("counter")) {
          animateCounter(entry.target)
        }

        // Unobserve after animation to improve performance
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  // Observe all animated elements
  const animatedElements = document.querySelectorAll(".animate-on-scroll, .counter")
  animatedElements.forEach((el) => {
    el.classList.add("loading")
    observer.observe(el)
  })
}

// Counter Animation
function initCounters() {
  const counters = document.querySelectorAll(".counter")
  counters.forEach((counter) => {
    counter.setAttribute("data-animated", "false")
  })
}

function animateCounter(element) {
  if (element.getAttribute("data-animated") === "true") return

  const target = Number.parseInt(element.getAttribute("data-target"))
  const duration = 2000 // 2 seconds
  const increment = target / (duration / 16) // 60fps
  let current = 0

  element.setAttribute("data-animated", "true")

  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      current = target
      clearInterval(timer)
    }
    element.textContent = Math.floor(current)
  }, 16)
}

// Scroll to Top Button
function initScrollToTop() {
  // Create scroll to top button
  const scrollTopBtn = document.createElement("button")
  scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>'
  scrollTopBtn.className = "scroll-top"
  scrollTopBtn.setAttribute("aria-label", "Scroll to top")
  document.body.appendChild(scrollTopBtn)

  // Show/hide button based on scroll position
  window.addEventListener(
    "scroll",
    throttle(() => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add("show")
      } else {
        scrollTopBtn.classList.remove("show")
      }
    }, 100),
  )

  // Scroll to top when clicked
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('a[href^="#"]')

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80 // Account for fixed navbar

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })

        // Close mobile menu if open
        const navbarCollapse = document.querySelector(".navbar-collapse")
        if (navbarCollapse.classList.contains("show")) {
          const bsCollapse = new bootstrap.Collapse(navbarCollapse)
          bsCollapse.hide()
        }
      }
    })
  })
}

// Mobile Menu Enhancement
function initMobileOptimizations() {
  // Touch event optimizations for mobile
  if ("ontouchstart" in window) {
    document.body.classList.add("touch-device")

    // Improve touch scrolling
    document.body.style.webkitOverflowScrolling = "touch"

    // Optimize hover effects for touch devices
    const hoverElements = document.querySelectorAll(".hover-zoom, .hover-lift")
    hoverElements.forEach((element) => {
      element.addEventListener("touchstart", function () {
        this.classList.add("touch-active")
      })

      element.addEventListener("touchend", function () {
        setTimeout(() => {
          this.classList.remove("touch-active")
        }, 300)
      })
    })
  }

  // Prevent zoom on double tap for iOS
  let lastTouchEnd = 0
  document.addEventListener(
    "touchend",
    (event) => {
      const now = new Date().getTime()
      if (now - lastTouchEnd <= 300) {
        event.preventDefault()
      }
      lastTouchEnd = now
    },
    false,
  )
}

// Performance Optimization
function initPerformanceOptimizations() {
  // Debounce scroll events
  let scrollTimeout
  const originalScrollHandler = window.onscroll

  window.onscroll = () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout)
    }
    scrollTimeout = setTimeout(originalScrollHandler, 10)
  }

  // Debounce resize events
  window.addEventListener("resize", debounce(handleResize, 250))

  // Preload critical images
  preloadCriticalImages()

  // Optimize animations for reduced motion preference
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.body.classList.add("reduced-motion")
  }
}

// Handle window resize
function handleResize() {
  // Recalculate any layout-dependent elements
  const heroSection = document.querySelector(".hero-section")
  if (heroSection) {
    heroSection.style.minHeight = window.innerHeight + "px"
  }
}

// Preload critical images
function preloadCriticalImages() {
  const criticalImages = ["/placeholder.svg?height=500&width=600", "/placeholder.svg?height=300&width=400"]

  criticalImages.forEach((src) => {
    const img = new Image()
    img.src = src
  })
}

// Lazy Loading for Images
function initImageLazyLoading() {
  const images = document.querySelectorAll("img[data-src]")

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          img.classList.remove("lazy")
          imageObserver.unobserve(img)
        }
      })
    })

    images.forEach((img) => imageObserver.observe(img))
  } else {
    // Fallback for older browsers
    images.forEach((img) => {
      img.src = img.dataset.src
    })
  }
}

// Contact Form Handling
function initContactForm() {
  const callButtons = document.querySelectorAll('button:contains("CALL ME NOW"), .btn:contains("CALL ME NOW")')

  callButtons.forEach((button) => {
    if (button.textContent.includes("CALL ME NOW")) {
      button.addEventListener("click", () => {
        // Show contact modal or redirect to phone
        openContactModal()
      })
    }
  })
}

// Contact Modal
function openContactModal() {
  const modal = new bootstrap.Modal(document.getElementById("contactModal"))
  modal.show()
}

// Submit Contact Form
function submitContactForm() {
  const form = document.getElementById("contactForm")
  const formData = new FormData(form)

  // Show loading state
  const submitBtn = document.querySelector("#contactModal .btn-primary")
  const originalText = submitBtn.textContent
  submitBtn.textContent = "Sending..."
  submitBtn.disabled = true

  // Simulate form submission (replace with actual API call)
  setTimeout(() => {
    // Show success message
    showNotification("Thank you for your message! We will contact you soon.", "success")

    // Reset form and close modal
    form.reset()
    const modal = bootstrap.Modal.getInstance(document.getElementById("contactModal"))
    modal.hide()

    // Reset button
    submitBtn.textContent = originalText
    submitBtn.disabled = false
  }, 1500)
}

// Show notification
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`
  notification.style.cssText = "top: 100px; right: 20px; z-index: 9999; min-width: 300px;"
  notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `

  document.body.appendChild(notification)

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove()
    }
  }, 5000)
}

// Gallery Lightbox
function initGalleryLightbox() {
  const galleryImages = document.querySelectorAll(".gallery-item img, .gallery-card img")

  galleryImages.forEach((img) => {
    img.addEventListener("click", function () {
      openLightbox(this.src, this.alt)
    })
  })
}

function openLightbox(src, alt) {
  const lightbox = document.createElement("div")
  lightbox.className = "lightbox-overlay"
  lightbox.innerHTML = `
        <div class="lightbox-content">
            <img src="${src}" alt="${alt}" class="lightbox-image">
            <button class="lightbox-close" onclick="closeLightbox()">&times;</button>
            <div class="lightbox-nav">
                <button class="lightbox-prev" onclick="navigateLightbox(-1)">&#8249;</button>
                <button class="lightbox-next" onclick="navigateLightbox(1)">&#8250;</button>
            </div>
        </div>
    `

  document.body.appendChild(lightbox)
  document.body.style.overflow = "hidden"

  // Close on overlay click
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox()
    }
  })

  // Close on escape key
  document.addEventListener("keydown", handleLightboxKeydown)
}

function closeLightbox() {
  const lightbox = document.querySelector(".lightbox-overlay")
  if (lightbox) {
    lightbox.remove()
    document.body.style.overflow = "auto"
    document.removeEventListener("keydown", handleLightboxKeydown)
  }
}

function handleLightboxKeydown(e) {
  if (e.key === "Escape") {
    closeLightbox()
  }
}

// Utility functions
function throttle(func, limit) {
  let inThrottle
  return function () {
    const args = arguments
    
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

function debounce(func, wait, immediate) {
  let timeout
  return function () {
    const args = arguments
    const later = () => {
      timeout = null
      if (!immediate) func.apply(this, args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(this, args)
  }
}

// Analytics and tracking (placeholder)
function initAnalytics() {
  // Add your analytics tracking code here
  console.log("Analytics initialized")
}

// Error handling
window.addEventListener("error", (e) => {
  console.error("JavaScript error:", e.error)
  // You can send error reports to your logging service here
})

// Service worker registration (for PWA features)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Uncomment when you have a service worker file
    // navigator.serviceWorker.register('/sw.js')
    //     .then(registration => console.log('SW registered'))
    //     .catch(error => console.log('SW registration failed'));
  })
}

// Initialize analytics
document.addEventListener("DOMContentLoaded", initAnalytics)

console.log("Woodmart Real Estate Website loaded successfully!")

// Add CSS for lightbox
const lightboxStyles = `
<style>
.lightbox-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    cursor: pointer;
    animation: fadeIn 0.3s ease;
}

.lightbox-content {
    position: relative;
    max-width: 90%;
    max-height: 90%;
    cursor: default;
}

.lightbox-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
}

.lightbox-close {
    position: absolute;
    top: -50px;
    right: 0;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    font-size: 2rem;
    cursor: pointer;
    padding: 10px;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s ease;
}

.lightbox-close:hover {
    background: rgba(255, 255, 255, 0.3);
}

.touch-active {
    transform: scale(0.98);
    opacity: 0.8;
}

.reduced-motion * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@media (max-width: 768px) {
    .lightbox-close {
        top: 20px;
        right: 20px;
        font-size: 1.5rem;
        width: 40px;
        height: 40px;
    }
}
</style>
`

document.head.insertAdjacentHTML("beforeend", lightboxStyles)
