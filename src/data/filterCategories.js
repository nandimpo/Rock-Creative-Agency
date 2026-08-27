// Ports NavigationFilter's `categories` map from Javascript/filter dropdown.js.
// Values are pre-slugified to match the filter*/filterServices tag strings used in
// src/data/team.js, workProjects.js and services.js.
export const filterCategories = {
  team: {
    label: 'Team',
    navLabel: 'About',
    options: [
      { label: 'Creative Director', value: 'creative-director' },
      { label: 'Producer', value: 'producer' },
      { label: 'Designer', value: 'designer' },
      { label: 'Developer', value: 'developer' },
      { label: 'Manager', value: 'manager' },
      { label: 'Strategist', value: 'strategist' },
    ],
  },
  projects: {
    label: 'Projects',
    navLabel: 'Work',
    options: [
      { label: 'Braam Fashion Week', value: 'braam-fashion-week' },
      { label: 'Metro FM', value: 'metro-fm' },
      { label: 'Loeries', value: 'loeries' },
      { label: 'Cannes', value: 'cannes' },
      { label: 'Riot Agency', value: 'riot-agency' },
      { label: 'Busy Beverages', value: 'busy-beverages' },
      { label: 'Mkunda Productions', value: 'mkunda-productions' },
      { label: 'Luyanda Game Lodge', value: 'luyanda-game-lodge' },
      { label: 'M & M Firm', value: 'm-m-firm' },
    ],
  },
  services: {
    label: 'Services',
    navLabel: 'Services',
    options: [
      { label: 'Public Relations', value: 'public-relations' },
      { label: 'Audio-Visual', value: 'audio-visual' },
      { label: 'Branding', value: 'branding' },
      { label: 'Social Media', value: 'social-media' },
      { label: 'Production', value: 'production' },
      { label: 'Pre Production', value: 'pre-production' },
      { label: 'Post Production', value: 'post-production' },
    ],
  },
};
