// ========================================
// UNIFIED FILTER SYSTEM - ONE BUTTON, SEAMLESS API INTEGRATION
// ========================================

class NavigationFilter {
    constructor() {
        this.filters = {
            team: [],
            projects: [],
            services: []
        };
        
        // API Configuration (JSONPlaceholder - no key needed)
        this.apiConfig = {
            baseUrl: 'https://jsonplaceholder.typicode.com'
        };
        
        this.apiCache = new Map();
        this.init();
    }

    init() {
        this.loadActiveFilters();
        this.createFilterDropdown();
        this.applyAllFilters(); // Apply on page load
        this.setupEventListeners();
    }

    createFilterDropdown() {
        if (document.querySelector('.nav-filter-container')) return;

        const navbar = document.querySelector('.navbar') || document.querySelector('nav');
        if (!navbar) return;

        const navLinks = navbar.querySelector('.nav-links') || navbar.querySelector('ul');
        if (!navLinks) return;

        const filterContainer = document.createElement('div');
        filterContainer.className = 'nav-filter-container';
        
        const activeCount = this.getActiveFilterCount();
        const badgeHTML = activeCount > 0 ? `<span class="filter-active-badge">${activeCount}</span>` : '';

        filterContainer.innerHTML = `
            ${badgeHTML}
            <button class="filter-dropdown-btn">
                <span>Filter</span>
            </button>
            <div class="filter-dropdown-menu">
                <!-- Team Category -->
                <div class="filter-category">
                    <div class="filter-category-title">Team Roles</div>
                    <div class="filter-options">
                        <div class="filter-option">
                            <input type="checkbox" id="filter-creative-director" value="creative-director" data-category="team">
                            <label for="filter-creative-director">Creative Director</label>
                        </div>
                        <div class="filter-option">
                            <input type="checkbox" id="filter-producer" value="producer" data-category="team">
                            <label for="filter-producer">Producer</label>
                        </div>
                        <div class="filter-option">
                            <input type="checkbox" id="filter-designer" value="designer" data-category="team">
                            <label for="filter-designer">Designer</label>
                        </div>
                        <div class="filter-option">
                            <input type="checkbox" id="filter-developer" value="developer" data-category="team">
                            <label for="filter-developer">Developer</label>
                        </div>
                        <div class="filter-option">
                            <input type="checkbox" id="filter-manager" value="manager" data-category="team">
                            <label for="filter-manager">Manager</label>
                        </div>
                        <div class="filter-option">
                            <input type="checkbox" id="filter-strategist" value="strategist" data-category="team">
                            <label for="filter-strategist">Strategist</label>
                        </div>
                    </div>
                </div>

                <!-- Projects Category -->
                <div class="filter-category">
                    <div class="filter-category-title">Projects</div>
                    <div class="filter-options">
                        <div class="filter-option">
                            <input type="checkbox" id="filter-braam" value="braam" data-category="projects">
                            <label for="filter-braam">Braam Fashion Week</label>
                        </div>
                        <div class="filter-option">
                            <input type="checkbox" id="filter-metro-fm" value="metro-fm" data-category="projects">
                            <label for="filter-metro-fm">Metro FM</label>
                        </div>
                        <div class="filter-option">
                            <input type="checkbox" id="filter-loeries" value="loeries" data-category="projects">
                            <label for="filter-loeries">Loeries</label>
                        </div>
                        <div class="filter-option">
                            <input type="checkbox" id="filter-fashion-faceoff" value="fashion-faceoff" data-category="projects">
                            <label for="filter-fashion-faceoff">Fashion Face-Off</label>
                        </div>
                    </div>
                </div>

                <!-- Services Category -->
                <div class="filter-category">
                    <div class="filter-category-title">Services</div>
                    <div class="filter-options">
                        <div class="filter-option">
                            <input type="checkbox" id="filter-branding" value="branding" data-category="services">
                            <label for="filter-branding">Branding</label>
                        </div>
                        <div class="filter-option">
                            <input type="checkbox" id="filter-public-relations" value="public-relations" data-category="services">
                            <label for="filter-public-relations">Public Relations</label>
                        </div>
                        <div class="filter-option">
                            <input type="checkbox" id="filter-social-media" value="social-media" data-category="services">
                            <label for="filter-social-media">Social Media</label>
                        </div>
                        <div class="filter-option">
                            <input type="checkbox" id="filter-creative-direction" value="creative-direction" data-category="services">
                            <label for="filter-creative-direction">Creative Direction</label>
                        </div>
                        <div class="filter-option">
                            <input type="checkbox" id="filter-pre-production" value="pre-production" data-category="services">
                            <label for="filter-pre-production">Pre Production</label>
                        </div>
                        <div class="filter-option">
                            <input type="checkbox" id="filter-production" value="production" data-category="services">
                            <label for="filter-production">Production</label>
                        </div>
                        <div class="filter-option">
                            <input type="checkbox" id="filter-post-production" value="post-production" data-category="services">
                            <label for="filter-post-production">Post Production</label>
                        </div>
                        <div class="filter-option">
                            <input type="checkbox" id="filter-audio-visual" value="audio-visual" data-category="services">
                            <label for="filter-audio-visual">Audio/Visual</label>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons - ONLY TWO NOW -->
                <div class="filter-actions">
                    <button class="filter-apply-btn">Apply Filters</button>
                    <button class="filter-clear-btn">Clear All</button>
                </div>
            </div>
        `;

        if (navLinks.firstChild) {
            navLinks.insertBefore(filterContainer, navLinks.firstChild);
        } else {
            navLinks.appendChild(filterContainer);
        }
    }

    setupEventListeners() {
        const dropdownBtn = document.querySelector('.filter-dropdown-btn');
        const dropdownMenu = document.querySelector('.filter-dropdown-menu');
        const applyBtn = document.querySelector('.filter-apply-btn');
        const clearBtn = document.querySelector('.filter-clear-btn');

        if (!dropdownBtn || !dropdownMenu) return;

        dropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownBtn.classList.toggle('active');
            dropdownMenu.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-filter-container')) {
                dropdownBtn.classList.remove('active');
                dropdownMenu.classList.remove('active');
            }
        });

        // ONE BUTTON DOES EVERYTHING
        if (applyBtn) {
            applyBtn.addEventListener('click', async () => {
                this.collectFilters();
                this.saveFilters();
                
                // Apply filters to both HTML content AND API data
                await this.applyAllFilters();
                
                dropdownBtn.classList.remove('active');
                dropdownMenu.classList.remove('active');
                this.updateBadge();
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearFilters();
                dropdownBtn.classList.remove('active');
                dropdownMenu.classList.remove('active');
                this.updateBadge();
            });
        }
    }

    // ========================================
    // UNIFIED FILTER APPLICATION
    // ========================================

    async applyAllFilters() {
        const hasActiveFilters = this.getActiveFilterCount() > 0;

        // Check for homepage redirect
        const isHomepage = window.location.pathname.endsWith('index.html') || 
                          window.location.pathname === '/' ||
                          window.location.pathname.endsWith('/');
        
        if (isHomepage && hasActiveFilters) {
            this.redirectToFilteredPage();
            return;
        }

        // Show subtle loading
        this.showSubtleLoading();

        try {
            // 1. Filter existing HTML content
            this.filterHTMLContent();

            // 2. Fetch and filter API data (in background)
            if (hasActiveFilters) {
                await this.fetchAndIntegrateAPIData();
            } else {
                // No filters: show all HTML, remove API results
                this.removeAPIResults();
            }

            this.hideSubtleLoading();

        } catch (error) {
            console.error('Filter error:', error);
            this.hideSubtleLoading();
        }
    }

    filterHTMLContent() {
        const hasActiveFilters = this.getActiveFilterCount() > 0;

        if (!hasActiveFilters) {
            // Show all HTML content
            document.querySelectorAll('[data-filter-team], [data-filter-project], [data-filter-service]').forEach(el => {
                el.classList.remove('filtered-hidden');
            });
            this.removeNoResultsMessage();
            return;
        }

        // Hide all filterable content first
        document.querySelectorAll('[data-filter-team], [data-filter-project], [data-filter-service]').forEach(el => {
            el.classList.add('filtered-hidden');
        });

        let hasVisibleContent = false;

        // Apply team filters
        if (this.filters.team.length > 0) {
            this.filters.team.forEach(role => {
                document.querySelectorAll(`[data-filter-team*="${role}"]`).forEach(el => {
                    el.classList.remove('filtered-hidden');
                    hasVisibleContent = true;
                });
            });
        }

        // Apply project filters
        if (this.filters.projects.length > 0) {
            this.filters.projects.forEach(project => {
                document.querySelectorAll(`[data-filter-project*="${project}"]`).forEach(el => {
                    el.classList.remove('filtered-hidden');
                    hasVisibleContent = true;
                });
            });
        }

        // Apply service filters
        if (this.filters.services.length > 0) {
            this.filters.services.forEach(service => {
                document.querySelectorAll(`[data-filter-service*="${service}"]`).forEach(el => {
                    el.classList.remove('filtered-hidden');
                    hasVisibleContent = true;
                });
            });
        }

        if (!hasVisibleContent) {
            this.showNoResultsMessage();
        } else {
            this.removeNoResultsMessage();
        }
    }

    async fetchAndIntegrateAPIData() {
        try {
            // Fetch from API
            const data = await this.fetchFromAPI();
            
            // Filter the API data
            const filteredData = this.filterAPIData(data);
            
            // Integrate with existing content
            this.integrateAPIResults(filteredData);
            
        } catch (error) {
            console.error('API Error:', error);
            // Silently fail - user doesn't need to know
        }
    }

    async fetchFromAPI() {
        const cacheKey = 'api_full_dataset';
        if (this.apiCache.has(cacheKey)) {
            return this.apiCache.get(cacheKey);
        }

        const response = await fetch(`${this.apiConfig.baseUrl}/users`);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const users = await response.json();
        const transformedData = this.transformAPIData(users);
        
        this.apiCache.set(cacheKey, transformedData);
        return transformedData;
    }

    transformAPIData(apiUsers) {
        const roles = ['creative-director', 'producer', 'designer', 'developer', 'manager', 'strategist'];
        const projects = ['braam', 'metro-fm', 'loeries', 'fashion-faceoff'];
        const services = ['branding', 'public-relations', 'social-media', 'creative-direction', 
                         'pre-production', 'production', 'post-production', 'audio-visual'];
        
        return apiUsers.map((user, index) => {
            const role = roles[index % roles.length];
            const project = projects[index % projects.length];
            const service = services[index % services.length];
            
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                company: user.company.name,
                role: role,
                project: project,
                service: service,
                phone: user.phone,
                website: user.website,
                image: `https://i.pravatar.cc/300?img=${user.id}`,
                source: 'api' // Mark as API data
            };
        });
    }

    filterAPIData(data) {
        let filtered = data;

        if (this.filters.team.length > 0) {
            filtered = filtered.filter(item => 
                this.filters.team.includes(item.role)
            );
        }

        if (this.filters.projects.length > 0) {
            filtered = filtered.filter(item => 
                this.filters.projects.includes(item.project)
            );
        }

        if (this.filters.services.length > 0) {
            filtered = filtered.filter(item => 
                this.filters.services.includes(item.service)
            );
        }

        return filtered;
    }

    integrateAPIResults(apiData) {
        // Remove old API results
        this.removeAPIResults();

        if (apiData.length === 0) return;

        // Find the main content container where we'll add results
        const mainContainer = document.querySelector('.team-grid') || 
                            document.querySelector('.project-grid') ||
                            document.querySelector('main .container') ||
                            document.querySelector('main');

        if (!mainContainer) return;

        // Create API results that blend in with existing content
        apiData.forEach(item => {
            const card = this.createSeamlessCard(item);
            mainContainer.appendChild(card);
        });
    }

    createSeamlessCard(item) {
        // Create a card that matches your site's existing style
        const card = document.createElement('div');
        card.className = 'team-member-card api-enhanced-result'; // Matches your existing cards
        card.setAttribute('data-api-result', 'true');
        card.setAttribute('data-filter-team', item.role);
        card.setAttribute('data-filter-project', item.project);
        card.setAttribute('data-filter-service', item.service);
        
        card.innerHTML = `
            <div class="member-image">
                <img src="${item.image}" alt="${item.name}">
                <div class="api-badge">Live Data</div>
            </div>
            <div class="member-info">
                <h3>${item.name}</h3>
                <p class="member-role">${this.formatLabel(item.role)}</p>
                <p class="member-project"><strong>Project:</strong> ${this.formatLabel(item.project)}</p>
                <p class="member-service"><strong>Service:</strong> ${this.formatLabel(item.service)}</p>
                <p class="member-company">${item.company}</p>
                <p class="member-email">${item.email}</p>
            </div>
        `;
        
        return card;
    }

    removeAPIResults() {
        document.querySelectorAll('[data-api-result="true"]').forEach(el => el.remove());
    }

    formatLabel(value) {
        return value.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    // ========================================
    // UI HELPERS
    // ========================================

    showSubtleLoading() {
        const filterBtn = document.querySelector('.filter-dropdown-btn');
        if (filterBtn) {
            filterBtn.style.opacity = '0.6';
            filterBtn.style.cursor = 'wait';
        }
    }

    hideSubtleLoading() {
        const filterBtn = document.querySelector('.filter-dropdown-btn');
        if (filterBtn) {
            filterBtn.style.opacity = '1';
            filterBtn.style.cursor = 'pointer';
        }
    }

    // ========================================
    // STANDARD FILTER METHODS
    // ========================================

    collectFilters() {
        this.filters = {
            team: [],
            projects: [],
            services: []
        };

        document.querySelectorAll('.filter-dropdown-menu input[type="checkbox"]:checked').forEach(checkbox => {
            const category = checkbox.dataset.category;
            const value = checkbox.value;
            if (this.filters[category]) {
                this.filters[category].push(value);
            }
        });
    }

    saveFilters() {
        localStorage.setItem('navigationFilters', JSON.stringify(this.filters));
        
        const params = new URLSearchParams();
        Object.keys(this.filters).forEach(category => {
            if (this.filters[category].length > 0) {
                params.set(category, this.filters[category].join(','));
            }
        });
        
        const newUrl = params.toString() ? 
            `${window.location.pathname}?${params.toString()}` : 
            window.location.pathname;
        
        window.history.replaceState({}, '', newUrl);
    }

    loadActiveFilters() {
        const urlParams = new URLSearchParams(window.location.search);
        let filtersLoaded = false;

        ['team', 'projects', 'services'].forEach(category => {
            const paramValue = urlParams.get(category);
            if (paramValue) {
                this.filters[category] = paramValue.split(',');
                filtersLoaded = true;
            }
        });

        if (!filtersLoaded) {
            const savedFilters = localStorage.getItem('navigationFilters');
            if (savedFilters) {
                this.filters = JSON.parse(savedFilters);
            }
        }

        setTimeout(() => {
            Object.keys(this.filters).forEach(category => {
                this.filters[category].forEach(value => {
                    const checkbox = document.querySelector(`input[value="${value}"][data-category="${category}"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                    }
                });
            });
        }, 100);
    }

    redirectToFilteredPage() {
        let targetPage = '';

        if (this.filters.team.length > 0) {
            targetPage = './About/about.html';
        } else if (this.filters.projects.length > 0) {
            targetPage = './Work/work.html';
        } else if (this.filters.services.length > 0) {
            targetPage = './Services/services.html';
        } else {
            targetPage = './Work/work.html';
        }

        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #111A18;
            color: #E2DCCC;
            padding: 20px 40px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `;
        message.textContent = 'Loading filtered results...';
        document.body.appendChild(message);

        setTimeout(() => {
            window.location.href = targetPage;
        }, 500);
    }

    clearFilters() {
        this.filters = {
            team: [],
            projects: [],
            services: []
        };

        document.querySelectorAll('.filter-dropdown-menu input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });

        localStorage.removeItem('navigationFilters');
        window.history.replaceState({}, '', window.location.pathname);
        
        // Show all content
        document.querySelectorAll('[data-filter-team], [data-filter-project], [data-filter-service]').forEach(el => {
            el.classList.remove('filtered-hidden');
        });
        
        this.removeAPIResults();
        this.removeNoResultsMessage();
    }

    getActiveFilterCount() {
        return this.filters.team.length + this.filters.projects.length + this.filters.services.length;
    }

    updateBadge() {
        const count = this.getActiveFilterCount();
        let badge = document.querySelector('.filter-active-badge');
        
        if (count > 0) {
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'filter-active-badge';
                document.querySelector('.nav-filter-container').insertBefore(badge, document.querySelector('.filter-dropdown-btn'));
            }
            badge.textContent = count;
        } else {
            if (badge) {
                badge.remove();
            }
        }
    }

    showNoResultsMessage() {
        this.removeNoResultsMessage();
        const main = document.querySelector('main') || document.querySelector('body');
        const noResults = document.createElement('div');
        noResults.className = 'filter-no-results';
        noResults.innerHTML = '<p>No results match your selected filters. Try adjusting your selection.</p>';
        main.insertBefore(noResults, main.firstChild);
    }

    removeNoResultsMessage() {
        const existing = document.querySelector('.filter-no-results');
        if (existing) existing.remove();
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new NavigationFilter();
    });
} else {
    new NavigationFilter();
}