import type { Element } from '@shared/schema';
import { randomUUID } from 'crypto';

export function createElement(type: string, parentId?: string): Element {
  const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseElement: Element = {
    id,
    type: type as any,
    content: {},
    styles: {},
    settings: {},
    children: [],
    parentId,
    order: 0,
  };

  // Set default content and styles based on element type
  switch (type) {
    case 'text':
      return {
        ...baseElement,
        content: {
          text: 'This is a text element. Click to edit.',
        },
        styles: {
          fontSize: '16px',
          lineHeight: '1.6',
          color: '#374151',
          padding: '8px',
        },
      };

    case 'heading':
      return {
        ...baseElement,
        content: {
          text: 'This is a heading',
          tag: 'h2',
        },
        styles: {
          fontSize: '32px',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '16px',
          padding: '8px',
        },
      };

    case 'image':
      return {
        ...baseElement,
        content: {
          src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300',
          alt: 'Sample image',
        },
        styles: {
          width: '100%',
          maxWidth: '600px',
          height: 'auto',
          borderRadius: '8px',
          padding: '8px',
        },
      };

    case 'button':
      return {
        ...baseElement,
        content: {
          text: 'Click me',
          link: '#',
        },
        styles: {
          backgroundColor: '#2563eb',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '6px',
          textDecoration: 'none',
          display: 'inline-block',
          fontWeight: '500',
          fontSize: '16px',
          border: 'none',
          cursor: 'pointer',
          margin: '8px',
        },
      };

    case 'video':
      return {
        ...baseElement,
        content: {
          src: '',
          poster: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300',
        },
        styles: {
          width: '100%',
          maxWidth: '600px',
          height: 'auto',
          borderRadius: '8px',
          padding: '8px',
        },
      };

    case 'spacer':
      return {
        ...baseElement,
        content: {},
        styles: {
          height: '40px',
          width: '100%',
        },
      };

    case 'section':
      return {
        ...baseElement,
        content: {
          backgroundColor: 'transparent',
        },
        styles: {
          width: '100%',
          minHeight: '100px',
          padding: '24px',
          backgroundColor: 'transparent',
        },
      };

    case 'gallery':
      return {
        ...baseElement,
        content: {
          images: [
            'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200',
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200',
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200',
          ],
          columns: 3,
        },
        styles: {
          width: '100%',
          padding: '16px',
        },
      };

    case 'contact-form':
      return {
        ...baseElement,
        content: {
          title: 'Contact Us',
          submitText: 'Send Message',
        },
        styles: {
          width: '100%',
          maxWidth: '500px',
          margin: '0 auto',
          padding: '24px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        },
      };

    case 'newsletter':
      return {
        ...baseElement,
        content: {
          title: 'Subscribe to our newsletter',
          description: 'Get the latest updates and news delivered to your inbox.',
          buttonText: 'Subscribe',
          placeholder: 'Enter your email',
        },
        styles: {
          width: '100%',
          maxWidth: '400px',
          margin: '0 auto',
          padding: '24px',
          textAlign: 'center',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
        },
      };

    case 'map':
      return {
        ...baseElement,
        content: {
          address: 'New York, NY',
          zoom: 12,
        },
        styles: {
          width: '100%',
          height: '300px',
          borderRadius: '8px',
          padding: '8px',
        },
      };

    case 'social':
      return {
        ...baseElement,
        content: {
          platforms: [
            { name: 'Facebook', url: 'https://facebook.com', icon: 'facebook' },
            { name: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
            { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
            { name: 'Instagram', url: 'https://instagram.com', icon: 'instagram' },
          ],
        },
        styles: {
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          padding: '16px',
        },
      };

    case 'testimonial':
      return {
        ...baseElement,
        content: {
          quote: 'This product has completely transformed our business. Highly recommended!',
          author: 'John Doe',
          position: 'CEO, Company Inc.',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100',
        },
        styles: {
          textAlign: 'center',
          padding: '24px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          maxWidth: '500px',
          margin: '0 auto',
        },
      };

    case 'pricing':
      return {
        ...baseElement,
        content: {
          title: 'Pro Plan',
          price: '$29',
          period: '/month',
          features: [
            'Unlimited projects',
            'Priority support',
            'Advanced analytics',
            'Custom domains',
          ],
          buttonText: 'Get Started',
          buttonLink: '#',
          featured: false,
        },
        styles: {
          textAlign: 'center',
          padding: '24px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          maxWidth: '300px',
          margin: '0 auto',
        },
      };

    case 'accordion':
      return {
        ...baseElement,
        content: {
          items: [
            {
              title: 'What is included in the plan?',
              content: 'Our plan includes all the features you need to build amazing websites.',
            },
            {
              title: 'How does billing work?',
              content: 'We bill monthly or annually, with discounts for annual subscriptions.',
            },
            {
              title: 'Can I cancel anytime?',
              content: 'Yes, you can cancel your subscription at any time with no penalties.',
            },
          ],
        },
        styles: {
          width: '100%',
          maxWidth: '600px',
          margin: '0 auto',
          padding: '16px',
        },
      };

    case 'tabs':
      return {
        ...baseElement,
        content: {
          tabs: [
            {
              title: 'Features',
              content: 'Explore our powerful features that help you build better websites.',
            },
            {
              title: 'Pricing',
              content: 'Choose from our flexible pricing plans that scale with your needs.',
            },
            {
              title: 'Support',
              content: 'Get help from our dedicated support team whenever you need it.',
            },
          ],
        },
        styles: {
          width: '100%',
          maxWidth: '600px',
          margin: '0 auto',
          padding: '16px',
        },
      };

    case 'slider':
      return {
        ...baseElement,
        content: {
          slides: [
            {
              image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
              title: 'Slide 1 Title',
              description: 'This is the first slide description.',
            },
            {
              image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
              title: 'Slide 2 Title',
              description: 'This is the second slide description.',
            },
            {
              image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
              title: 'Slide 3 Title',
              description: 'This is the third slide description.',
            },
          ],
          autoplay: true,
          interval: 5000,
        },
        styles: {
          width: '100%',
          height: '400px',
          borderRadius: '8px',
          overflow: 'hidden',
          position: 'relative',
        },
      };

    case 'row':
      return {
        ...baseElement,
        content: {},
        styles: {
          display: 'flex',
          width: '100%',
          gap: '16px',
          padding: '8px',
        },
      };

    case 'column':
      return {
        ...baseElement,
        content: {},
        styles: {
          flex: '1',
          minHeight: '50px',
          padding: '8px',
          border: '1px dashed #e5e7eb',
          borderRadius: '4px',
        },
      };

    default:
      return baseElement;
  }
}

export function getElementDefaults(type: string): Partial<Element> {
  const element = createElement(type);
  return {
    content: element.content,
    styles: element.styles,
    settings: element.settings,
  };
}

export function validateElementType(type: string): boolean {
  const validTypes = [
    // Basic Elements
    'text', 'heading', 'image', 'button', 'video', 'spacer', 'divider',
    // Layout Elements  
    'section', 'row', 'column', 'container', 'grid',
    // Content Elements
    'gallery', 'slider', 'carousel', 'hero', 'feature-box', 'icon-box',
    'testimonial', 'review', 'stats', 'counter', 'progress-bar',
    // Interactive Elements
    'accordion', 'tabs', 'modal', 'tooltip', 'dropdown', 'search-box',
    'rating', 'toggle', 'timeline',
    // Form Elements
    'contact-form', 'newsletter', 'input', 'textarea', 'select', 'checkbox',
    'radio', 'file-upload',
    // Business Elements
    'pricing', 'pricing-table', 'team-member', 'service-card',
    'product-card', 'blog-card',
    // Utility Elements
    'map', 'social', 'countdown', 'notification', 'alert', 'badge'
  ];
  
  return validTypes.includes(type);
}

export function canDropInElement(draggedType: string, targetType: string): boolean {
  // Define rules for what elements can be dropped into others
  const containerElements = ['section', 'row', 'column'];
  const leafElements = ['text', 'heading', 'image', 'button', 'video', 'spacer'];
  
  // Container elements can accept most other elements
  if (containerElements.includes(targetType)) {
    return true;
  }
  
  // Leaf elements cannot accept other elements
  if (leafElements.includes(targetType)) {
    return false;
  }
  
  // Allow dropping in other complex elements with some restrictions
  return true;
}

export function generateElementId(type: string): string {
  return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
