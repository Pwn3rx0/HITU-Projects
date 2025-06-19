# University Projects Portfolio Website

A modern, responsive static website showcasing university projects across three technology departments: **Cybersecurity**, **Artificial Intelligence**, and **Data Science**.

## 🚀 Features

### Modern Design
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Interactive Elements**: Hover effects, smooth transitions, and engaging animations
- **Beautiful Gradients**: Custom color schemes for each department

### Project Organization
- **Three Departments**: 
  - 🔒 **Cybersecurity**: Network security, cryptography, penetration testing
  - 🤖 **Artificial Intelligence**: NLP, computer vision, reinforcement learning
  - 📊 **Data Science**: Predictive analytics, big data, data mining

### Interactive Features
- **Project Filtering**: Filter projects by department using tab buttons
- **Smooth Navigation**: Fixed header with smooth scrolling to sections
- **Contact Form**: Functional contact form with validation
- **Mobile Menu**: Responsive hamburger menu for mobile devices
- **Skill Visualization**: Animated skill bars showing technical expertise

### Animations & Effects
- **Parallax Scrolling**: Floating cards in hero section
- **Typing Effect**: Animated hero title
- **Counter Animation**: Animated statistics
- **Fade-in Effects**: Elements appear as you scroll
- **Hover Effects**: Interactive project cards and buttons

## 📁 File Structure

```
university-portfolio/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and animations
├── script.js           # JavaScript functionality
└── README.md           # Project documentation
```

## 🎨 Design Elements

### Color Scheme
- **Primary**: Indigo (#6366f1)
- **Secondary**: Emerald (#10b981)
- **Accent**: Amber (#f59e0b)
- **Department Gradients**:
  - Cybersecurity: Red gradient
  - AI: Teal gradient
  - Data Science: Pink gradient

### Typography
- **Font**: Inter (Google Fonts)
- **Modern, clean, and highly readable**

### Layout
- **Grid-based**: CSS Grid for responsive layouts
- **Flexbox**: For component alignment
- **Mobile-first**: Responsive design approach

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **JavaScript (ES6+)**: Interactive functionality
- **Font Awesome**: Icons
- **Google Fonts**: Typography

## 📱 Responsive Design

The website is fully responsive and optimized for:
- **Desktop**: 1200px+ (Full layout with side-by-side sections)
- **Tablet**: 768px - 1199px (Adjusted grid layouts)
- **Mobile**: < 768px (Stacked layout, mobile menu)

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server required - it's a static website!

### Installation
1. Download or clone the project files
2. Open `index.html` in your web browser
3. That's it! The website is ready to use

### Local Development
If you want to run it locally with a server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## 📝 Customization

### Adding Your Projects
1. **Edit `index.html`**: Find the projects section and add your project cards
2. **Structure**: Each project should follow this format:
```html
<div class="project-card [department]" data-department="[department]">
    <div class="project-image">
        <i class="fas fa-[icon]"></i>
    </div>
    <div class="project-content">
        <h3>Project Title</h3>
        <p>Project description...</p>
        <div class="project-tags">
            <span class="tag">Technology</span>
        </div>
        <div class="project-links">
            <a href="#" class="project-link"><i class="fab fa-github"></i> Code</a>
        </div>
    </div>
</div>
```

### Updating Personal Information
- **Contact Details**: Update email, LinkedIn, and GitHub links
- **Skills**: Modify skill bars in the about section
- **Statistics**: Change the numbers in the hero section
- **About Text**: Customize the description and expertise areas

### Styling Changes
- **Colors**: Modify CSS custom properties in `:root`
- **Fonts**: Change Google Fonts import in HTML
- **Layout**: Adjust grid and flexbox properties in CSS

## 🎯 Key Sections

### 1. Hero Section
- Eye-catching gradient background
- Animated statistics
- Floating department cards
- Call-to-action button

### 2. Projects Section
- Filterable project grid
- Department-specific color schemes
- Project tags and links
- Hover animations

### 3. About Section
- Personal introduction
- Expertise areas
- Animated skill bars
- Professional background

### 4. Contact Section
- Contact information cards
- Functional contact form
- Social media links
- Professional presentation

## 🔧 Browser Support

- **Chrome**: 60+
- **Firefox**: 55+
- **Safari**: 12+
- **Edge**: 79+

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Feel free to fork this project and customize it for your own use. If you make improvements, consider sharing them!

## 📞 Support

If you have any questions or need help customizing the website, feel free to reach out!

---

**Built with ❤️ for showcasing university projects and academic achievements** 