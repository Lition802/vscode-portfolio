// src/config/sidebar.js


export const folders = [
    {
        name: "我的网站",
        open: true,
        files: [
            { id: 'home', name: 'home.html', icon: 'fab fa-html5', color: '#e34c26', markdownFile: 'home.md' },
            { id: 'about', name: 'about.css', icon: 'fab fa-css3-alt', color: '#264de4', markdownFile: 'about/about.md' },
            { id: 'projects', name: 'projects.js', icon: 'fab fa-js-square', color: '#f0db4f', markdownFile: 'projects.md' },
            { id: 'skills', name: 'skills.config', icon: 'fas fa-cogs', color: '#61dafb', markdownFile: 'skills.md' },
            { id: 'contact', name: 'contact.md', icon: 'fas fa-paper-plane', color: '#ffffff', markdownFile: 'contact.md' },
        ]
    },
    {
        name: "其他项目",
        open: false,
        files: [
            { id: 'project-a', name: '项目A.py', icon: 'fab fa-python', color: '#3776ab', markdownFile: 'project-a.md' },
            { id: 'project-b', name: '项目B.go', icon: 'fab fa-golang', color: '#00add8', markdownFile: 'project-b.md' },
        ]
    }
];