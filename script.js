// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Global variables
let projectData = {};
const projectsGrid = document.getElementById('projectsGrid');
let currentImages = [];
let currentImageIndex = 0;

// Department icons mapping
const departmentIcons = {
    'cybersecurity': 'fas fa-shield-alt',
    'ai': 'fas fa-brain',
    'data-science': 'fas fa-chart-line'
};

// Pagination variables
const PROJECTS_PER_PAGE = 6;
let currentPage = 1;
let filteredProjectIds = [];

// Function to load all images from a directory
async function loadImagesFromDirectory(directoryPath) {
    try {
        // For now, we'll use a simple approach with common image extensions
        // In a real implementation, you'd need a server-side script to list directory contents
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        const images = [];
        
        // This is a placeholder - in practice you'd need a server endpoint
        // that returns the list of files in the directory
        console.log('Loading images from directory:', directoryPath);
        
        // For demonstration, we'll return the directory path as a single image
        // In a real implementation, you'd fetch the directory listing from your server
        return [directoryPath];
    } catch (error) {
        console.error('Error loading images from directory:', error);
        return [];
    }
}

// Function to check if a path is a directory (ends with /)
function isDirectoryPath(path) {
    return path.endsWith('/') || path.endsWith('\\');
}

// Render skeleton loaders
function renderSkeletons(count = PROJECTS_PER_PAGE) {
    projectsGrid.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'project-card skeleton';
        skeleton.innerHTML = `
            <div class="skeleton-image"></div>
            <div class="skeleton-content">
                <div class="skeleton-title"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-tags"></div>
            </div>
        `;
        projectsGrid.appendChild(skeleton);
    }
}

// Load project data from JSON file
async function loadProjectData() {
    try {
        renderSkeletons();
        const response = await fetch('projects.json');
        const data = await response.json();
        projectData = data.projects;
        filteredProjectIds = Object.keys(projectData);
        currentPage = 1;
        renderProjects();
        console.log('Project data loaded successfully:', projectData);
    } catch (error) {
        console.error('Error loading project data:', error);
        // Fallback to empty state
        projectsGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Error loading projects. Please refresh the page.</p>';
    }
}

// Infinite scroll handler
function handleInfiniteScroll() {
    const projectsSection = document.getElementById('projects');
    if (!projectsSection) return;
    const rect = projectsSection.getBoundingClientRect();
    // If the bottom of the projects section is within 200px of the viewport bottom, load more
    if (
        rect.bottom - 200 < window.innerHeight &&
        (currentPage * PROJECTS_PER_PAGE) < filteredProjectIds.length
    ) {
        currentPage++;
        renderProjects();
    }
}

// Render projects with pagination
function renderProjects() {
    projectsGrid.innerHTML = '';
    const startIdx = 0;
    const endIdx = currentPage * PROJECTS_PER_PAGE;
    const visibleIds = filteredProjectIds.slice(startIdx, endIdx);
    visibleIds.forEach(projectId => {
        const project = projectData[projectId];
        const projectCard = createProjectCard(projectId, project);
        projectsGrid.appendChild(projectCard);
    });
    attachProjectEventListeners();
    // Add loading animation for images
    const images = document.querySelectorAll('.project-cover');
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        img.addEventListener('error', () => {
            img.style.opacity = '0.5';
        });
    });
    // No more Load More button
}

// Create a project card element
function createProjectCard(projectId, project) {
    const card = document.createElement('div');
    card.className = `project-card ${project.department}`;
    card.setAttribute('data-department', project.department);
    card.setAttribute('data-project', projectId);
    
    // Use the first image as cover, fallback to icon if no images
    const coverImage = project.images && project.images.length > 0 
        ? `<img src="${project.images[0]}" alt="${project.title}" class="project-cover" loading="lazy">`
        : `<i class="${departmentIcons[project.department] || 'fas fa-project-diagram'}"></i>`;
    
    card.innerHTML = `
        <div class="project-image">
            ${coverImage}
        </div>
        <div class="project-content">
            <h3>${project.title}</h3>
            <p>${project.description.substring(0, 150)}${project.description.length > 150 ? '...' : ''}</p>
            <div class="project-tags">
                ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `;
    
    return card;
}

// Attach event listeners to project cards
function attachProjectEventListeners() {
    // Open modal
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-project');
            const project = projectData[projectId];
            
            if (project) {
                openProjectModal(project);
            }
        });
    });
}

// Modal functionality
const modal = document.getElementById('projectModal');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const imageGallery = document.getElementById('imageGallery');
const videoContainer = document.getElementById('videoContainer');
const teamLeaderName = document.getElementById('teamLeaderName');
const teamLeaderRole = document.getElementById('teamLeaderRole');
const teamMembers = document.getElementById('teamMembers');
const supervisorsList = document.getElementById('supervisorsList');

// Open project modal
function openProjectModal(project) {
    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;
    
    // Load images with better Google Drive handling and error fallbacks
    imageGallery.innerHTML = project.images.map((img, index) => {
        // Convert Google Drive URLs to proper format
        let imageUrl = img;
        if (img.includes('drive.google.com')) {
            if (img.includes('/file/d/')) {
                const fileId = img.split('/file/d/')[1].split('/')[0];
                imageUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
            }
        }
        
        return `<img src="${imageUrl}" alt="Project Image" class="gallery-image" loading="lazy" onclick="openFullscreenImage('${imageUrl}', ${index}, ${JSON.stringify(project.images.map(img => {
            if (img.includes('drive.google.com') && img.includes('/file/d/')) {
                const fileId = img.split('/file/d/')[1].split('/')[0];
                return `https://drive.google.com/uc?export=view&id=${fileId}`;
            }
            return img;
        })).replace(/"/g, '&quot;')})" onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjM2Y0NzU3Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2Y5ZmFmYiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+'; this.style.border='2px dashed #6b7280'; console.log('Failed to load image:', '${imageUrl}');">`;
    }).join('');
    
    // Load video - handle different video formats
    if (project.video.includes('drive.google.com')) {
        // Handle Google Drive videos
        if (project.video.includes('/preview')) {
            // Use iframe for Google Drive preview - this is the most reliable method
            videoContainer.innerHTML = `
                <iframe 
                    width="100%" 
                    height="100%" 
                    src="${project.video}" 
                    frameborder="0" 
                    allowfullscreen
                    style="border-radius: 10px;">
                </iframe>
            `;
        } else if (project.video.includes('/view')) {
            // Convert view links to preview
            const fileId = project.video.split('/d/')[1].split('/view')[0];
            videoContainer.innerHTML = `
                <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://drive.google.com/file/d/${fileId}/preview" 
                    frameborder="0" 
                    allowfullscreen
                    style="border-radius: 10px;">
                </iframe>
            `;
        } else if (project.video.includes('/uc?export=download')) {
            // For download links, try to convert to preview
            const fileId = project.video.split('id=')[1];
            videoContainer.innerHTML = `
                <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://drive.google.com/file/d/${fileId}/preview" 
                    frameborder="0" 
                    allowfullscreen
                    style="border-radius: 10px;">
                </iframe>
            `;
        } else {
            // Fallback for other Google Drive formats
            videoContainer.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-secondary);">
                    <i class="fas fa-video" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <p>Video not available in this format.</p>
                    <a href="${project.video}" target="_blank" style="color: var(--primary-color); text-decoration: none; margin-top: 1rem;">
                        <i class="fas fa-external-link-alt"></i> View on Google Drive
                    </a>
                </div>
            `;
        }
    } else if (project.video.includes('youtube.com') || project.video.includes('youtu.be')) {
        // Handle YouTube URLs
        let videoId = '';
        if (project.video.includes('youtube.com/embed/')) {
            videoId = project.video.split('youtube.com/embed/')[1];
        } else if (project.video.includes('youtube.com/watch?v=')) {
            videoId = project.video.split('youtube.com/watch?v=')[1];
        } else if (project.video.includes('youtu.be/')) {
            videoId = project.video.split('youtu.be/')[1];
        }
        
        videoContainer.innerHTML = `
            <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/${videoId}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
    } else {
        // Handle direct video files
        videoContainer.innerHTML = `
            <video controls>
                <source src="${project.video}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        `;
    }
    
    // Load team leader
    teamLeaderName.textContent = project.teamLeader.name;
    teamLeaderRole.textContent = project.teamLeader.role;
    
    // Load team leader image
    const teamLeaderAvatar = document.getElementById('teamLeaderAvatar');
    if (project.teamLeader.image) {
        teamLeaderAvatar.innerHTML = `<img src="${project.teamLeader.image}" alt="${project.teamLeader.name}" class="leader-image" loading="lazy">`;
    } else {
        teamLeaderAvatar.innerHTML = '<i class="fas fa-user"></i>';
    }
    
    // Load team members (simplified - just names)
    teamMembers.innerHTML = project.teamMembers.map(member => `
        <div class="member-item">
            <span class="member-name">${member}</span>
        </div>
    `).join('');
    
    // Load supervisors
    supervisorsList.innerHTML = project.supervisors.map(supervisor => 
        `<div class="supervisor-item">${supervisor}</div>`
    ).join('');
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal
modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Media tabs functionality
document.querySelectorAll('.media-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        
        // Remove active class from all tabs and panels
        document.querySelectorAll('.media-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.media-panel').forEach(p => p.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding panel
        tab.classList.add('active');
        document.getElementById(`${targetTab}-panel`).classList.add('active');
    });
});

// Project Filtering (update to work with pagination)
const tabButtons = document.querySelectorAll('.tab-button');
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const department = button.getAttribute('data-department');
        if (department === 'all') {
            filteredProjectIds = Object.keys(projectData);
        } else {
            filteredProjectIds = Object.keys(projectData).filter(
                id => projectData[id].department === department
            );
        }
        currentPage = 1;
        renderProjects();
        // After filtering, check if we need to load more (in case not enough projects to fill viewport)
        setTimeout(handleInfiniteScroll, 100);
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header background change on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(17, 24, 39, 0.98)';
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.background = 'rgba(17, 24, 39, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Load project data first
    loadProjectData();
    
    // Observe elements for animation after projects are loaded
    setTimeout(() => {
        const animateElements = document.querySelectorAll('.project-card');
        animateElements.forEach(el => {
            observer.observe(el);
        });
    }, 1000);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const floatingCards = document.querySelector('.floating-cards');
    
    if (hero && floatingCards) {
        const rate = scrolled * -0.5;
        floatingCards.style.transform = `translateY(${rate}px)`;
    }
});

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 50);
        }, 1000);
    }
});

// Project card hover effects
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }, 1000);
});

// Smooth reveal animation for sections
const revealSections = document.querySelectorAll('section');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

revealSections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(section);
});

// Counter animation for hero stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    }
    
    updateCounter();
}

// Initialize counter animations
const statNumbers = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            const text = element.textContent;
            const number = parseInt(text.replace('+', ''));
            
            if (!element.classList.contains('animated')) {
                element.classList.add('animated');
                animateCounter(element, number);
            }
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => {
    counterObserver.observe(stat);
});

// Add ripple effect to buttons
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple effect to all buttons
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.querySelectorAll('button, .cta-button').forEach(button => {
            button.addEventListener('click', createRipple);
        });
    }, 1000);
});

// Add CSS for ripple effect
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    button, .cta-button {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

console.log('Portfolio website loaded successfully! 🚀');

// Fullscreen modal elements
const fullscreenModal = document.getElementById('fullscreenImageModal');
const fullscreenImage = document.getElementById('fullscreenImage');
const fullscreenModalClose = document.getElementById('fullscreenModalClose');
const fullscreenPrev = document.getElementById('fullscreenPrev');
const fullscreenNext = document.getElementById('fullscreenNext');

// Fullscreen modal functionality
function openFullscreenImage(imageSrc, imageIndex, images) {
    currentImages = images;
    currentImageIndex = imageIndex;
    fullscreenImage.src = imageSrc;
    fullscreenModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateNavigationButtons();
}

function closeFullscreenImage() {
    fullscreenModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showNextImage() {
    if (currentImageIndex < currentImages.length - 1) {
        currentImageIndex++;
        fullscreenImage.src = currentImages[currentImageIndex];
        updateNavigationButtons();
    }
}

function showPrevImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        fullscreenImage.src = currentImages[currentImageIndex];
        updateNavigationButtons();
    }
}

function updateNavigationButtons() {
    fullscreenPrev.disabled = currentImageIndex === 0;
    fullscreenNext.disabled = currentImageIndex === currentImages.length - 1;
}

// Fullscreen modal event listeners
fullscreenModalClose.addEventListener('click', closeFullscreenImage);
fullscreenPrev.addEventListener('click', showPrevImage);
fullscreenNext.addEventListener('click', showNextImage);

// Close fullscreen modal when clicking outside
fullscreenModal.addEventListener('click', (e) => {
    if (e.target === fullscreenModal) {
        closeFullscreenImage();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (fullscreenModal.classList.contains('active')) {
        switch(e.key) {
            case 'Escape':
                closeFullscreenImage();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    }
});

// Attach infinite scroll event
window.addEventListener('scroll', handleInfiniteScroll);

// Also trigger infinite scroll on resize (in case of short content)
window.addEventListener('resize', handleInfiniteScroll); 
