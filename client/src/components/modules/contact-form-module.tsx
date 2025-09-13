import { useEditorStore } from "@/store/editor";
import type { Element } from "@shared/schema";

interface ContactFormModuleProps {
  element: Element;
  onClick?: (e: React.MouseEvent) => void;
  'data-testid'?: string;
}

export default function ContactFormModule({ element, onClick, 'data-testid': testId }: ContactFormModuleProps) {
  const { selectedElement } = useEditorStore();
  const isSelected = selectedElement === element.id;

  const styles = {
    ...element.styles,
    cursor: 'pointer',
    position: 'relative' as const,
    border: isSelected ? '2px dashed hsl(var(--primary))' : '2px dashed transparent',
    borderRadius: '4px',
    padding: element.styles.padding || '24px',
    backgroundColor: element.styles.backgroundColor || '#ffffff',
  };

  const formTitle = element.content.title || 'Contact Us';
  const submitText = element.content.submitText || 'Send Message';

  return (
    <div
      onClick={onClick}
      style={styles}
      data-testid={testId}
      className="group"
    >
      <form style={{ maxWidth: '500px', margin: '0 auto' }} onSubmit={(e) => e.preventDefault()}>
        <h3 style={{ 
          marginBottom: '20px', 
          fontSize: '24px', 
          fontWeight: '600',
          color: element.styles.color || '#000000'
        }}>
          {formTitle}
        </h3>
        
        <div style={{ marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Your Name"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px',
            }}
            disabled
          />
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <input
            type="email"
            placeholder="Your Email"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px',
            }}
            disabled
          />
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <textarea
            placeholder="Your Message"
            rows={4}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px',
              resize: 'vertical',
            }}
            disabled
          />
        </div>
        
        <button
          type="submit"
          style={{
            backgroundColor: element.styles.buttonColor || '#2563eb',
            color: '#ffffff',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'not-allowed',
            opacity: 0.7,
          }}
          disabled
        >
          {submitText}
        </button>
      </form>
      
      {isSelected && (
        <div className="absolute -top-6 left-0 bg-primary text-primary-foreground px-2 py-1 text-xs rounded z-10">
          Contact Form Element
        </div>
      )}
    </div>
  );
}
