// =====================================================
// FILTER SYSTEM WITH YOUR REAL ROCK CREATIVE AGENCY DATA
// UPDATED: Sidebar hidden by default, Arrow indicator added
// =====================================================

class SidebarFilterSystem {
    constructor(config = {}) {
        this.isMobile = window.innerWidth <= 768;
        this.sidebarOpen = false; // CHANGED: Start closed by default
        this.allData = {
            services: [],
            work: [],
            expertise: [],
            team: []
        };
        this.filteredData = [];
        this.currentCategory = 'services';
        this.activeFilters = {};
        this.elements = {}; // Initialize empty
        
        this.init();
    }

    async init() {
        try {
            console.log('🎬 Initializing Sidebar Filter System...');
            this.createUI();
            await this.waitForDOM(); // Wait for elements to be in DOM
            this.cacheElements();
            this.createArrowIndicator(); // NEW: Add arrow indicator
            this.loadRealData();
            this.attachEventListeners();
            this.setupResponsive();
            console.log('✓ Filter System Ready');
        } catch (error) {
            console.error('❌ Filter System Error:', error);
        }
    }

    waitForDOM() {
        return new Promise((resolve) => {
            if (document.getElementById('resultsList')) {
                resolve();
            } else {
                setTimeout(() => this.waitForDOM().then(resolve), 100);
            }
        });
    }

    createUI() {
        const container = document.querySelector('[data-filter-container-sidebar-results]') 
            || this.createDefaultContainer();

        const html = `
            <div class="filter-system-sidebar-results">
                <button class="hamburger-btn" aria-label="Toggle filters">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <div class="filter-overlay"></div>

                <aside class="filter-sidebar-container" id="filterSidebar">
                    <div class="sidebar-header">
                        <h2 class="sidebar-title">Filter</h2>
                        <button class="sidebar-close-btn" aria-label="Close filters">✕</button>
                    </div>

                    <div class="filter-controls">
                        <div class="sidebar-section" style="margin-bottom: 1.5rem;">
                            <div class="sidebar-section-content">
                                <button class="category-tab active" data-category="services">Services</button>
                                <button class="category-tab" data-category="work">Work</button>
                                <button class="category-tab" data-category="expertise">Expertise</button>
                                <button class="category-tab" data-category="team">Team</button>
                            </div>
                        </div>

                        <input 
                            type="text" 
                            class="sidebar-search" 
                            placeholder="Search..."
                            id="searchInput"
                        >

                        <div class="filter-group" id="servicesGroup" style="display: block;">
                            <div class="sidebar-section">
                                <span class="sidebar-section-title">Services</span>
                                <div class="sidebar-section-content" id="servicesContainer"></div>
                            </div>
                        </div>

                        <div class="filter-group" id="workGroup" style="display: none;">
                            <div class="sidebar-section">
                                <span class="sidebar-section-title">Project</span>
                                <div class="sidebar-section-content" id="projectsContainer"></div>
                            </div>
                            <div class="sidebar-section">
                                <span class="sidebar-section-title">Category</span>
                                <div class="sidebar-section-content" id="workCategoryContainer"></div>
                            </div>
                        </div>

                        <div class="filter-group" id="expertiseGroup" style="display: none;">
                            <div class="sidebar-section">
                                <span class="sidebar-section-title">Topic</span>
                                <div class="sidebar-section-content" id="expertiseTopicContainer"></div>
                            </div>
                        </div>

                        <div class="filter-group" id="teamGroup" style="display: none;">
                            <div class="sidebar-section">
                                <span class="sidebar-section-title">Role</span>
                                <div class="sidebar-section-content" id="roleContainer"></div>
                            </div>
                        </div>

                        <button class="sidebar-reset-btn" id="resetBtn">Reset Filters</button>
                    </div>

                    <div class="sidebar-results-section">
                        <h3 class="results-title-small" id="resultsTitle">Services</h3>
                        <p class="results-count-small" id="resultsCount">Loading...</p>
                        <div class="sidebar-results-list" id="resultsList"></div>
                        <div class="no-results-small" id="noResults" style="display: none;">No results found</div>
                    </div>
                </aside>

                <div class="filter-content-area-empty"></div>
            </div>
        `;

        container.innerHTML = html;
    }

    createDefaultContainer() {
        const container = document.createElement('section');
        container.setAttribute('data-filter-container-sidebar-results', '');
        document.body.appendChild(container);
        return container;
    }

    // NEW: Create blinking arrow indicator
    createArrowIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'filter-arrow-indicator';
        indicator.innerHTML = '<span class="arrow-icon">←</span>';
        indicator.setAttribute('aria-label', 'Click to open filters');
        indicator.setAttribute('title', 'Click to open filters');
        document.body.appendChild(indicator);
        
        this.arrowIndicator = indicator;
        
        console.log('✓ Arrow indicator created');
        
        // Click arrow to open sidebar
        indicator.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('Arrow indicator clicked');
            this.openSidebar();
        });
        
        // Also add keyboard support (Enter/Space)
        indicator.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.openSidebar();
            }
        });
    }

    cacheElements() {
        console.log('📦 Caching DOM elements...');
        
        this.elements = {
            sidebar: document.getElementById('filterSidebar'),
            hamburger: document.querySelector('.hamburger-btn'),
            overlay: document.querySelector('.filter-overlay'),
            closeBtn: document.querySelector('.sidebar-close-btn'),
            searchInput: document.getElementById('searchInput'),
            resetBtn: document.getElementById('resetBtn'),
            categoryTabs: document.querySelectorAll('.category-tab'),
            filterGroups: document.querySelectorAll('.filter-group'),
            resultsList: document.getElementById('resultsList'),
            noResults: document.getElementById('noResults'),
            resultsCount: document.getElementById('resultsCount'),
            resultsTitle: document.getElementById('resultsTitle')
        };

        // Verify all elements exist
        const missing = [];
        for (const [key, value] of Object.entries(this.elements)) {
            if (!value && key !== 'categoryTabs' && key !== 'filterGroups') {
                missing.push(key);
            }
        }

        if (missing.length > 0) {
            console.error('❌ Missing elements:', missing);
            throw new Error(`Cannot cache elements: ${missing.join(', ')}`);
        }

        console.log('✓ All elements cached successfully');
    }

    attachEventListeners() {
        console.log('🔌 Attaching event listeners...');

        // Hamburger menu
        this.elements.hamburger.addEventListener('click', () => {
            console.log('Hamburger clicked');
            this.toggleSidebar();
        });

        this.elements.closeBtn.addEventListener('click', () => {
            console.log('Close button clicked');
            this.closeSidebar();
        });

        this.elements.overlay.addEventListener('click', () => {
            console.log('Overlay clicked');
            this.closeSidebar();
        });

        // Category tabs
        this.elements.categoryTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const category = e.target.dataset.category;
                console.log('Tab clicked - Switching to:', category);
                this.switchCategory(category);
            });
        });

        // Search input
        this.elements.searchInput.addEventListener('input', 
            this.debounce(() => {
                console.log('Search input changed');
                this.applyFilters();
            }, 300)
        );

        // Reset button
        this.elements.resetBtn.addEventListener('click', () => {
            console.log('Reset button clicked');
            this.resetFilters();
        });

        // Checkbox changes
        document.addEventListener('change', (e) => {
            if (e.target.matches('input[type="checkbox"]')) {
                console.log('Checkbox changed:', e.target.value);
                this.applyFilters();
            }
        });

        // Window resize
        window.addEventListener('resize', () => this.handleResize());

        console.log('✓ Event listeners attached');
    }

    toggleSidebar() {
        this.sidebarOpen ? this.closeSidebar() : this.openSidebar();
    }

    openSidebar() {
        console.log('Opening sidebar');
        this.sidebarOpen = true;
        this.elements.sidebar.classList.add('open');
        this.elements.sidebar.classList.remove('closed');
        this.elements.overlay.classList.add('active');
        this.elements.hamburger.classList.add('open');
        
        // Hide arrow indicator when sidebar is open
        if (this.arrowIndicator) {
            this.arrowIndicator.classList.add('hidden');
        }
        
        document.body.style.overflow = 'hidden';
    }

    closeSidebar() {
        console.log('Closing sidebar');
        this.sidebarOpen = false;
        this.elements.sidebar.classList.remove('open');
        this.elements.sidebar.classList.add('closed');
        this.elements.overlay.classList.remove('active');
        this.elements.hamburger.classList.remove('open');
        
        // Show arrow indicator when sidebar is closed
        if (this.arrowIndicator) {
            this.arrowIndicator.classList.remove('hidden');
        }
        
        document.body.style.overflow = '';
    }

    switchCategory(category) {
        console.log('🔄 Switching to category:', category);
        
        this.currentCategory = category;
        this.activeFilters = {};
        this.elements.searchInput.value = '';

        // Update active tab
        this.elements.categoryTabs.forEach(tab => {
            if (tab.dataset.category === category) {
                tab.classList.add('active');
                console.log('✓ Tab activated:', tab.textContent);
            } else {
                tab.classList.remove('active');
            }
        });

        // Show/hide filter groups
        this.elements.filterGroups.forEach(group => {
            const shouldShow = group.id === `${category}Group`;
            group.style.display = shouldShow ? 'block' : 'none';
            if (shouldShow) {
                console.log('✓ Filter group shown:', group.id);
            }
        });

        // Update results title
        const titleText = category.charAt(0).toUpperCase() + category.slice(1);
        this.elements.resultsTitle.textContent = titleText;

        // Uncheck all checkboxes
        document.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
            cb.checked = false;
        });

        // Display all results for this category
        const categoryData = this.allData[category];
        console.log(`📊 Displaying ${categoryData.length} items for ${category}`);
        this.displayResults(categoryData);
    }

    loadRealData() {
        console.log('📡 Loading Rock Creative Agency data...');
        
        // YOUR REAL SERVICES
        this.allData.services = [
            { id: 1, name: 'Branding', description: 'Strategic brand development and identity design', link: '../Services/services.html' },
            { id: 2, name: 'Social Media', description: 'Content creation & community management', link: '../Services/services.html' },
            { id: 3, name: 'Production', description: 'Professional video and media production', link: '../Services/services.html' },
            { id: 4, name: 'Post Production', description: 'Editing, color grading & visual effects', link: '../Services/services.html' },
            { id: 5, name: 'Public Relations', description: 'Media relations and PR strategy', link: '../Services/services.html' },
            { id: 6, name: 'Creative Direction', description: 'Strategic creative concept development', link: '../Services/services.html' },
            { id: 7, name: 'Pre Production', description: 'Planning, scripting & scheduling', link: '../Services/services.html' },
            { id: 8, name: 'Audio/Visual', description: 'Audio design & visual production', link: '../Services/services.html' }
        ];

        // YOUR REAL WORK/PROJECTS
        this.allData.work = [
            { 
                id: 1, 
                projectName: 'Braam Fashion Week', 
                category: 'Fashion', 
                description: 'Premium fashion showcase',
                link: '../Work/work.html' 
            },
            { 
                id: 2, 
                projectName: 'Metro FM', 
                category: 'Radio Branding', 
                description: 'Complete rebranding initiative',
                link: '../Work/work.html' 
            },
            { 
                id: 3, 
                projectName: 'Loeires', 
                category: 'Brand Identity', 
                description: 'Brand identity and creative direction',
                link: '../Work/work.html' 
            },
            { 
                id: 4, 
                projectName: 'African Fashion Research Institute', 
                category: 'Consulting', 
                description: 'Strategic consulting and brand development',
                link: '../Work/work.html' 
            },
            { 
                id: 5, 
                projectName: 'Sky Bookings', 
                category: 'Web Development', 
                description: 'Digital platform for travel bookings',
                link: '../Work/work.html' 
            }
        ];

        // YOUR REAL EXPERTISE CONTENT
        this.allData.expertise = [
            { 
                id: 1, 
                title: 'The Fashion Face-Off', 
                topic: 'Production', 
                description: 'Annual fashion showcase and production',
                link: '../Expertise/expertise.html' 
            },
            { 
                id: 2, 
                title: 'Pre Production Process', 
                topic: 'Production', 
                description: 'Designing and production scheduling',
                link: '../Expertise/expertise.html' 
            },
            { 
                id: 3, 
                title: 'Production & Shooting', 
                topic: 'Production', 
                description: 'Shooting and creative direction',
                link: '../Expertise/expertise.html' 
            },
            { 
                id: 4, 
                title: 'Post Production & Editing', 
                topic: 'Production', 
                description: 'Editing footage and visual effects',
                link: '../Expertise/expertise.html' 
            },
            { 
                id: 5, 
                title: 'Audio Visual Design', 
                topic: 'Audio Visual', 
                description: 'Audio and visual production with technology',
                link: '../Expertise/expertise.html' 
            },
            { 
                id: 6, 
                title: 'Social Media Strategy', 
                topic: 'Social Media', 
                description: 'Marketing and engagement generation',
                link: '../Expertise/expertise.html' 
            },
            { 
                id: 7, 
                title: 'Public Relations', 
                topic: 'PR', 
                description: 'Media relations and promotion',
                link: '../Expertise/expertise.html' 
            },
            { 
                id: 8, 
                title: 'Creative Direction', 
                topic: 'Strategy', 
                description: 'Vision creation and brand editing',
                link: '../Expertise/expertise.html' 
            }
        ];

        // YOUR REAL TEAM MEMBERS
        this.allData.team = [
            { 
                id: 1, 
                name: 'Bosa Mali', 
                role: 'Creative Director', 
                specialty: ['Creative Direction', 'Branding', 'Strategy'],
                link: '../About/about.html' 
            },
            { 
                id: 2, 
                name: 'Mandsa Sepeng', 
                role: 'Producer', 
                specialty: ['Production', 'Post Production'],
                link: '../About/about.html' 
            },
            { 
                id: 3, 
                name: 'Ryanda Ariyeng', 
                role: 'Designer', 
                specialty: ['Web', 'Design', 'Planning'],
                link: '../About/about.html' 
            },
            { 
                id: 4, 
                name: 'Erin May', 
                role: 'Developer', 
                specialty: ['Web', 'Development', 'Planning'],
                link: '../About/about.html' 
            },
            { 
                id: 5, 
                name: 'Cia Tite', 
                role: 'Manager', 
                specialty: ['Planning', 'Production', 'Event'],
                link: '../About/about.html' 
            },
            { 
                id: 6, 
                name: 'Daurie Child', 
                role: 'Strategist', 
                specialty: ['Strategy', 'Design', 'Planning'],
                link: '../About/about.html' 
            }
        ];

        console.log('✓ Real Data loaded successfully');
        console.log(`  - Services: ${this.allData.services.length}`);
        console.log(`  - Work: ${this.allData.work.length}`);
        console.log(`  - Expertise: ${this.allData.expertise.length}`);
        console.log(`  - Team: ${this.allData.team.length}`);
        
        this.populateFilters();
        this.displayResults(this.allData.services);
    }

    populateFilters() {
        console.log('🔧 Populating filters...');

        // Services checkboxes
        if (this.allData.services.length) {
            const servicesContainer = document.getElementById('servicesContainer');
            if (servicesContainer) {
                servicesContainer.innerHTML = this.allData.services
                    .map(s => this.createCheckbox('service', s.id, s.name))
                    .join('');
            }
        }

        // Work filters
        if (this.allData.work.length) {
            const projects = [...new Set(this.allData.work.map(w => w.projectName))];
            const categories = [...new Set(this.allData.work.map(w => w.category))];

            const projectsContainer = document.getElementById('projectsContainer');
            const workCatContainer = document.getElementById('workCategoryContainer');
            
            if (projectsContainer) {
                projectsContainer.innerHTML = projects
                    .map(p => this.createCheckbox('project', p, p)).join('');
            }
            if (workCatContainer) {
                workCatContainer.innerHTML = categories
                    .map(c => this.createCheckbox('workCategory', c, c)).join('');
            }
        }

        // Expertise filters
        if (this.allData.expertise.length) {
            const topics = [...new Set(this.allData.expertise.map(e => e.topic))];
            const expertiseContainer = document.getElementById('expertiseTopicContainer');
            if (expertiseContainer) {
                expertiseContainer.innerHTML = topics
                    .map(t => this.createCheckbox('expTopic', t, t)).join('');
            }
        }

        // Team filters
        if (this.allData.team.length) {
            const roles = [...new Set(this.allData.team.map(t => t.role))];
            const roleContainer = document.getElementById('roleContainer');
            if (roleContainer) {
                roleContainer.innerHTML = roles
                    .map(r => this.createCheckbox('role', r, r)).join('');
            }
        }

        console.log('✓ Filters populated');
    }

    createCheckbox(name, value, label) {
        const id = `${name}-${value}`;
        return `
            <label class="filter-checkbox">
                <input 
                    type="checkbox" 
                    name="${name}" 
                    value="${value}"
                    id="${id}"
                >
                <label for="${id}">${label}</label>
            </label>
        `;
    }

    applyFilters() {
        const searchTerm = this.elements.searchInput.value.toLowerCase();
        const checkedBoxes = document.querySelectorAll(`input[type="checkbox"]:checked`);
        
        this.activeFilters = {};
        checkedBoxes.forEach(cb => {
            if (!this.activeFilters[cb.name]) {
                this.activeFilters[cb.name] = [];
            }
            this.activeFilters[cb.name].push(cb.value);
        });

        let filtered = this.allData[this.currentCategory].filter(item => {
            if (searchTerm) {
                const searchableFields = this.getSearchableFields(item);
                if (!searchableFields.some(field => field.toLowerCase().includes(searchTerm))) {
                    return false;
                }
            }

            for (const [filterName, filterValues] of Object.entries(this.activeFilters)) {
                if (!this.matchesFilter(item, filterName, filterValues)) {
                    return false;
                }
            }

            return true;
        });

        this.displayResults(filtered);
    }

    getSearchableFields(item) {
        if (this.currentCategory === 'services') {
            return [item.name, item.description];
        } else if (this.currentCategory === 'work') {
            return [item.projectName, item.category, item.description];
        } else if (this.currentCategory === 'expertise') {
            return [item.title, item.topic, item.description];
        } else if (this.currentCategory === 'team') {
            return [item.name, item.role, ...(Array.isArray(item.specialty) ? item.specialty : [item.specialty || ''])];
        }
        return [];
    }

    matchesFilter(item, filterName, filterValues) {
        if (this.currentCategory === 'services') {
            if (filterName === 'service') return filterValues.includes(item.id.toString());
        } else if (this.currentCategory === 'work') {
            if (filterName === 'project') return filterValues.includes(item.projectName);
            if (filterName === 'workCategory') return filterValues.includes(item.category);
        } else if (this.currentCategory === 'expertise') {
            if (filterName === 'expTopic') return filterValues.includes(item.topic);
        } else if (this.currentCategory === 'team') {
            if (filterName === 'role') return filterValues.includes(item.role);
        }
        return true;
    }

    displayResults(data) {
        console.log(`📋 Displaying ${data.length} results`);
        
        const list = this.elements.resultsList;
        list.innerHTML = '';

        if (data.length === 0) {
            this.elements.noResults.style.display = 'block';
            this.elements.resultsCount.textContent = 'No results';
            console.log('No results to display');
            return;
        }

        this.elements.noResults.style.display = 'none';
        this.elements.resultsCount.textContent = `${data.length} result${data.length !== 1 ? 's' : ''}`;

        const itemsHTML = data.map(item => this.createResultItem(item)).join('');
        list.innerHTML = itemsHTML;
        console.log('✓ Results rendered');
    }

    createResultItem(item) {
        if (this.currentCategory === 'services') {
            return `
                <a href="${item.link}" class="result-item-link">
                    <div class="result-item-small">
                        <h4 class="result-item-title-small">${item.name}</h4>
                        <p class="result-item-description-small">${item.description}</p>
                        <span class="result-link-arrow">→ View Service</span>
                    </div>
                </a>
            `;
        } else if (this.currentCategory === 'work') {
            return `
                <a href="${item.link}" class="result-item-link">
                    <div class="result-item-small">
                        <h4 class="result-item-title-small">${item.projectName}</h4>
                        <p class="result-item-meta-small">${item.category}</p>
                        <p class="result-item-description-small">${item.description}</p>
                        <span class="result-link-arrow">→ View Project</span>
                    </div>
                </a>
            `;
        } else if (this.currentCategory === 'expertise') {
            return `
                <a href="${item.link}" class="result-item-link">
                    <div class="result-item-small">
                        <h4 class="result-item-title-small">${item.title}</h4>
                        <p class="result-item-meta-small">${item.topic}</p>
                        <p class="result-item-description-small">${item.description}</p>
                        <span class="result-link-arrow">→ Read More</span>
                    </div>
                </a>
            `;
        } else if (this.currentCategory === 'team') {
            return `
                <a href="${item.link}" class="result-item-link">
                    <div class="result-item-small">
                        <h4 class="result-item-title-small">${item.name}</h4>
                        <p class="result-item-meta-small">${item.role}</p>
                        <p class="result-item-description-small">${item.specialty.join(', ')}</p>
                        <span class="result-link-arrow">→ View Profile</span>
                    </div>
                </a>
            `;
        }
        return '';
    }

    resetFilters() {
        console.log('🔄 Resetting all filters');
        document.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
            cb.checked = false;
        });
        this.elements.searchInput.value = '';
        this.applyFilters();
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;

        if (wasMobile && !this.isMobile) {
            // Transitioned from mobile to desktop
            // Sidebar should still be hidden by default
            this.closeSidebar();
            document.body.style.overflow = '';
        } else if (!wasMobile && this.isMobile) {
            // Transitioned from desktop to mobile
            this.closeSidebar();
        }
    }

    setupResponsive() {
        console.log('📱 Setting up responsive behavior');
        // Additional setup for responsive behavior if needed
    }

    debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('✓ DOM Content Loaded - Initializing Rock Creative Agency Filter System');
    window.filterSystem = new SidebarFilterSystem();
});

console.log('✓ Filter System Script Loaded');