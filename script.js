// Language Switcher
document.addEventListener('DOMContentLoaded', function() {
    const langButtons = document.querySelectorAll('.lang-btn');
    const currentLang = localStorage.getItem('language') || 'en';
    
    // Set initial language
    setLanguage(currentLang);
    
    // Update active button
    langButtons.forEach(btn => {
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        }
    });
    
    // Language button click handlers
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            setLanguage(lang);
            localStorage.setItem('language', lang);
            
            // Update active button
            langButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove('active');
            }
        });
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active navigation link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    function activateNavLink() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', activateNavLink);
    activateNavLink();
    
    // Persona cards click to scroll to gallery
    const personaCards = document.querySelectorAll('.persona-card');
    personaCards.forEach(card => {
        card.addEventListener('click', function(e) {
            const personaType = this.getAttribute('data-persona');
            console.log('Persona card clicked:', personaType);
            
            if (personaType) {
                const gallerySection = document.getElementById(`gallery-${personaType}`);
                console.log('Gallery section found:', gallerySection, 'ID:', `gallery-${personaType}`);
                
                if (gallerySection) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Calculate position using getBoundingClientRect for accuracy
                    const rect = gallerySection.getBoundingClientRect();
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    const navbarHeight = 100;
                    const targetPosition = rect.top + scrollTop - navbarHeight;
                    
                    console.log('Current scroll:', scrollTop, 'Rect top:', rect.top, 'Target:', targetPosition);
                    
                    window.scrollTo({
                        top: Math.max(0, targetPosition),
                        behavior: 'smooth'
                    });
                } else {
                    console.error('Gallery section not found for:', personaType, 'Looking for:', `gallery-${personaType}`);
                }
            }
        });
    });
    
    // Image Modal with Zoom Animation
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const closeBtn = document.querySelector('.close');
    
    // Debug: Check if elements are found
    if (!modal) {
        console.error('Modal element not found!');
    }
    if (!modalImg) {
        console.error('Modal image element not found!');
    }
    if (galleryItems.length === 0) {
        console.error('No gallery items found!');
    } else {
        console.log('Found', galleryItems.length, 'gallery items');
    }
    
    let currentImageRect = null;
    
    function openModal(img, rect) {
        console.log('openModal called');
        
        // Store the clicked image position
        currentImageRect = rect;
        
        // Set the image source
        modalImg.src = img.src;
        modalImg.alt = img.alt || 'Gallery image';
        
        // Calculate initial position and size
        const initialRect = {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height
        };
        
        console.log('Initial rect:', initialRect);
        
        // Show modal first
        modal.style.display = 'block';
        modal.style.visibility = 'visible';
        document.body.style.overflow = 'hidden';
        
        // Set initial transform - ensure image is visible
        modalImg.style.position = 'fixed';
        modalImg.style.top = initialRect.top + 'px';
        modalImg.style.left = initialRect.left + 'px';
        modalImg.style.width = initialRect.width + 'px';
        modalImg.style.height = initialRect.height + 'px';
        modalImg.style.transform = 'scale(1)';
        modalImg.style.transition = 'none';
        modalImg.style.objectFit = 'cover';
        modalImg.style.borderRadius = '0';
        modalImg.style.zIndex = '2001';
        modalImg.style.display = 'block';
        modalImg.style.opacity = '1';
        modalImg.style.visibility = 'visible';
        
        console.log('Modal displayed, image styles set');
        
        // Force reflow
        void modal.offsetHeight;
        
        // Activate modal background
        setTimeout(() => {
            modal.classList.add('active');
            console.log('Modal active class added');
        }, 10);
        
        // Calculate final position (centered and fit to viewport)
        const padding = 40; // Padding on all sides
        const maxWidth = Math.min(window.innerWidth - (padding * 2), 1200);
        const maxHeight = window.innerHeight - (padding * 2);
        const aspectRatio = initialRect.height / initialRect.width;
        
        // Calculate dimensions that fit within viewport
        let finalWidth = maxWidth;
        let finalHeight = finalWidth * aspectRatio;
        
        // If height exceeds viewport, scale down based on height
        if (finalHeight > maxHeight) {
            finalHeight = maxHeight;
            finalWidth = finalHeight / aspectRatio;
        }
        
        // Center the image
        const finalTop = padding + (maxHeight - finalHeight) / 2;
        const finalLeft = (window.innerWidth - finalWidth) / 2;
        
        console.log('Final position:', { finalTop, finalLeft, finalWidth, finalHeight, maxHeight, viewportHeight: window.innerHeight });
        
        // Animate to final position
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                modalImg.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                modalImg.style.top = finalTop + 'px';
                modalImg.style.left = finalLeft + 'px';
                modalImg.style.width = finalWidth + 'px';
                modalImg.style.height = finalHeight + 'px';
                modalImg.style.maxWidth = 'none';
                modalImg.style.maxHeight = 'none';
                modalImg.style.objectFit = 'contain';
                modalImg.style.borderRadius = '8px';
                console.log('Animation started');
            });
        });
    }
    
    function closeModal() {
        if (!currentImageRect) return;
        
        // Remove active class for background fade
        modal.classList.remove('active');
        
        // Animate back to original position
        const initialRect = {
            top: currentImageRect.top + window.scrollY,
            left: currentImageRect.left + window.scrollX,
            width: currentImageRect.width,
            height: currentImageRect.height
        };
        
        modalImg.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        modalImg.style.top = initialRect.top + 'px';
        modalImg.style.left = initialRect.left + 'px';
        modalImg.style.width = initialRect.width + 'px';
        modalImg.style.height = initialRect.height + 'px';
        modalImg.style.objectFit = 'cover';
        modalImg.style.borderRadius = '0';
        
        // Hide modal after animation
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            currentImageRect = null;
            // Reset styles
            modalImg.style.transition = '';
            modalImg.style.position = '';
            modalImg.style.top = '';
            modalImg.style.left = '';
            modalImg.style.width = '';
            modalImg.style.height = '';
            modalImg.style.transform = '';
            modalImg.style.objectFit = '';
            modalImg.style.borderRadius = '';
        }, 300);
    }
    
    // Click on image to close (zoom out)
    modalImg.addEventListener('click', function(e) {
        if (e.target === modalImg) {
            closeModal();
        }
    });
    
    // Use event delegation on gallery items (not just images) to handle overlay clicks
    const galleryContainers = document.querySelectorAll('.gallery-item');
    
    if (galleryContainers.length > 0 && modal && modalImg) {
        console.log('Found', galleryContainers.length, 'gallery containers');
        
        galleryContainers.forEach((container, index) => {
            const img = container.querySelector('img');
            if (!img) return;
            
            // Add click to the container (works even if overlay is clicked)
            container.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Gallery item clicked:', index, img.src);
                
                const rect = img.getBoundingClientRect();
                console.log('Image rect:', rect);
                
                if (rect.width > 0 && rect.height > 0) {
                    openModal(img, rect);
                } else {
                    // Fallback: just show the modal without animation
                    console.log('Using fallback modal display');
                    modal.style.display = 'block';
                    modal.style.visibility = 'visible';
                    modal.classList.add('active');
                    modalImg.src = img.src;
                    modalImg.alt = img.alt || 'Gallery image';
                    
                    // Calculate proper size for viewport
                    const padding = 40;
                    const maxWidth = Math.min(window.innerWidth - (padding * 2), 1200);
                    const imgAspectRatio = img.naturalHeight / img.naturalWidth;
                    let displayWidth = maxWidth;
                    let displayHeight = displayWidth * imgAspectRatio;
                    
                    if (displayHeight > window.innerHeight - (padding * 2)) {
                        displayHeight = window.innerHeight - (padding * 2);
                        displayWidth = displayHeight / imgAspectRatio;
                    }
                    
                    modalImg.style.position = 'fixed';
                    modalImg.style.top = '50%';
                    modalImg.style.left = '50%';
                    modalImg.style.transform = 'translate(-50%, -50%)';
                    modalImg.style.width = displayWidth + 'px';
                    modalImg.style.height = displayHeight + 'px';
                    modalImg.style.maxWidth = 'none';
                    modalImg.style.maxHeight = 'none';
                    modalImg.style.objectFit = 'contain';
                    modalImg.style.borderRadius = '8px';
                    modalImg.style.zIndex = '2001';
                    modalImg.style.display = 'block';
                    modalImg.style.opacity = '1';
                    modalImg.style.visibility = 'visible';
                    document.body.style.overflow = 'hidden';
                }
            });
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation (exclude hero elements to prevent conflicts)
    const animateElements = document.querySelectorAll('.persona-card, .gallery-item, .biography-content');
    animateElements.forEach(el => {
        // Skip if element is in hero section
        if (!el.closest('.hero')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        }
    });
});

function setLanguage(lang) {
    const elements = document.querySelectorAll('[data-en], [data-pt], [data-fr]');
    elements.forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            element.textContent = text;
        }
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
}
