import type { Project, Element, GlobalStyles } from '@shared/schema';

export interface ExportOptions {
  includeCSS?: boolean;
  includeJS?: boolean;
  minify?: boolean;
  responsive?: boolean;
}

export function generateHTMLExport(project: Project, options: ExportOptions = {}): string {
  const {
    includeCSS = true,
    includeJS = true,
    minify = false,
    responsive = true
  } = options;

  const { elements, globalStyles, settings } = project;
  
  // Generate HTML structure
  const bodyContent = generateElementsHTML(Array.isArray(elements) ? elements : []);
  
  // Generate CSS
  const css = includeCSS ? generateCSS(globalStyles as GlobalStyles, Array.isArray(elements) ? elements : [], responsive) : '';
  
  // Generate JS (basic interactions)
  const js = includeJS ? generateJS() : '';
  
  // SEO metadata
  const seoSettings = settings && typeof settings === 'object' && 'seo' in settings ? settings.seo as any : {};
  const seoTitle = seoSettings?.title || project.name || 'Landing Page';
  const seoDescription = seoSettings?.description || project.description || 'Generated with PageBuilder Pro';
  const seoKeywords = seoSettings?.keywords || '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(seoTitle)}</title>
    <meta name="description" content="${escapeHtml(seoDescription)}">
    ${seoKeywords ? `<meta name="keywords" content="${escapeHtml(seoKeywords)}">` : ''}
    <meta name="generator" content="PageBuilder Pro">
    
    <!-- Responsive Design -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=Open+Sans:wght@300;400;600;700&family=Montserrat:wght@300;400;500;600;700&family=Georgia:wght@400;700&display=swap" rel="stylesheet">
    
    ${includeCSS ? `<style>${minify ? minifyCSS(css) : css}</style>` : ''}
</head>
<body>
    ${bodyContent}
    
    ${includeJS ? `<script>${minify ? minifyJS(js) : js}</script>` : ''}
</body>
</html>`;

  return minify ? minifyHTML(html) : html;
}

function generateElementsHTML(elements: Element[]): string {
  const rootElements = elements.filter(el => !el.parentId);
  return rootElements.map(element => generateElementHTML(element, elements)).join('\n');
}

function generateElementHTML(element: Element, allElements: Element[]): string {
  const { type, content, styles, children } = element;
  
  // Convert React-style CSS to regular CSS
  const styleString = convertStylesToCSS(styles);
  const className = `element-${type} element-${element.id}`;
  
  // Get child elements
  const childElements = children ? 
    allElements.filter(el => children.includes(el.id)) : [];
  
  const childrenHTML = childElements
    .map(child => generateElementHTML(child, allElements))
    .join('\n');

  switch (type) {
    case 'heading':
      const tag = content?.tag || 'h1';
      return `<${tag} class="${className}" style="${styleString}">${escapeHtml(content?.text || '')}</${tag}>`;
    
    case 'text':
      return `<p class="${className}" style="${styleString}">${escapeHtml(content?.text || '')}</p>`;
    
    case 'button':
      const href = content?.link || '#';
      const buttonText = content?.text || 'Button';
      return `<a href="${escapeHtml(href)}" class="${className}" style="${styleString}">${escapeHtml(buttonText)}</a>`;
    
    case 'image':
      const src = content?.src || '';
      const alt = content?.alt || '';
      return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" class="${className}" style="${styleString}">`;
    
    case 'video':
      const videoSrc = content?.src || '';
      const poster = content?.poster || '';
      if (videoSrc) {
        return `<video class="${className}" style="${styleString}" controls${poster ? ` poster="${escapeHtml(poster)}"` : ''}>
          <source src="${escapeHtml(videoSrc)}" type="video/mp4">
          Your browser does not support the video tag.
        </video>`;
      }
      return `<div class="${className}" style="${styleString}"><!-- Video placeholder --></div>`;
    
    case 'spacer':
      return `<div class="${className}" style="${styleString}"></div>`;
    
    case 'section':
      return `<section class="${className}" style="${styleString}">
        ${childrenHTML}
      </section>`;
    
    case 'gallery':
      const images = content?.images || [];
      const columns = content?.columns || 3;
      const galleryHTML = images.map((src: string, index: number) => 
        `<img src="${escapeHtml(src)}" alt="Gallery image ${index + 1}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 4px;">`
      ).join('');
      
      return `<div class="${className}" style="${styleString}">
        <div style="display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: 12px;">
          ${galleryHTML}
        </div>
      </div>`;
    
    case 'contact-form':
      const formTitle = content?.title || 'Contact Us';
      const submitText = content?.submitText || 'Send Message';
      return `<div class="${className}" style="${styleString}">
        <form method="POST" action="#" style="max-width: 500px; margin: 0 auto;">
          <h3 style="margin-bottom: 20px; font-size: 24px; font-weight: 600;">${escapeHtml(formTitle)}</h3>
          <div style="margin-bottom: 16px;">
            <input type="text" name="name" placeholder="Your Name" required style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px;">
          </div>
          <div style="margin-bottom: 16px;">
            <input type="email" name="email" placeholder="Your Email" required style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px;">
          </div>
          <div style="margin-bottom: 16px;">
            <textarea name="message" placeholder="Your Message" rows="4" required style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; resize: vertical;"></textarea>
          </div>
          <button type="submit" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; border: none; border-radius: 6px; font-size: 16px; font-weight: 500; cursor: pointer;">${escapeHtml(submitText)}</button>
        </form>
      </div>`;
    
    default:
      return `<div class="${className}" style="${styleString}">${childrenHTML || escapeHtml(content?.text || '')}</div>`;
  }
}

function generateCSS(globalStyles: GlobalStyles, elements: Element[], responsive: boolean): string {
  const colors = globalStyles?.colors || {};
  const fonts = globalStyles?.fonts || {};
  
  let css = `
/* Global Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: '${fonts.primary || 'Inter'}', sans-serif;
  line-height: 1.6;
  color: ${colors.foreground || '#0f172a'};
  background-color: ${colors.background || '#ffffff'};
}

/* Element Styles */
.element-heading {
  margin-bottom: 1rem;
}

.element-text {
  margin-bottom: 1rem;
}

.element-button {
  display: inline-block;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.element-button:hover {
  opacity: 0.9;
}

.element-image {
  max-width: 100%;
  height: auto;
  display: block;
}

.element-video {
  max-width: 100%;
  height: auto;
}

.element-section {
  width: 100%;
}

.element-gallery {
  width: 100%;
}

.element-contact-form {
  width: 100%;
}

/* Form Styles */
.element-contact-form input:focus,
.element-contact-form textarea:focus {
  outline: none;
  border-color: ${colors.primary || '#2563eb'};
  box-shadow: 0 0 0 3px ${colors.primary || '#2563eb'}20;
}

.element-contact-form button:hover {
  background-color: ${colors.primary || '#2563eb'}dd;
}
`;

  // Add responsive styles
  if (responsive) {
    css += `
/* Responsive Styles */
@media (max-width: 768px) {
  .element-gallery > div {
    grid-template-columns: repeat(2, 1fr) !important;
  }
  
  .element-heading {
    font-size: 90% !important;
  }
  
  .element-section {
    padding: 16px !important;
  }
  
  .element-contact-form {
    padding: 16px !important;
  }
}

@media (max-width: 480px) {
  .element-gallery > div {
    grid-template-columns: 1fr !important;
  }
  
  .element-heading {
    font-size: 80% !important;
  }
  
  .element-button {
    display: block !important;
    text-align: center !important;
    width: 100% !important;
  }
}
`;
  }

  return css;
}

function generateJS(): string {
  return `
// Basic form handling
document.addEventListener('DOMContentLoaded', function() {
  // Handle contact forms
  const forms = document.querySelectorAll('.element-contact-form form');
  forms.forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Thank you for your message! (This is a demo - form submissions need to be configured)');
    });
  });
  
  // Smooth scrolling for anchor links
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(function(link) {
    link.addEventListener('click', function(e) {
      const href = link.getAttribute('href');
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
`;
}

function convertStylesToCSS(styles: Record<string, any>): string {
  return Object.entries(styles)
    .map(([key, value]) => {
      // Convert camelCase to kebab-case
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${cssKey}: ${value}`;
    })
    .join('; ');
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function minifyHTML(html: string): string {
  return html
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .trim();
}

function minifyCSS(css: string): string {
  return css
    .replace(/\s+/g, ' ')
    .replace(/;\s*}/g, '}')
    .replace(/{\s*/g, '{')
    .replace(/;\s*/g, ';')
    .trim();
}

function minifyJS(js: string): string {
  return js
    .replace(/\s+/g, ' ')
    .replace(/;\s*}/g, ';}')
    .replace(/{\s*/g, '{')
    .trim();
}

export function downloadHTMLFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateZipExport(project: Project): Promise<Blob> {
  // This would require JSZip library for full implementation
  // For now, return the HTML as a simple blob
  const html = generateHTMLExport(project);
  return Promise.resolve(new Blob([html], { type: 'text/html' }));
}
