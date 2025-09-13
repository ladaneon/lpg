import { useEditorStore } from "@/store/editor";
import type { Element } from "@shared/schema";

interface ImageModuleProps {
  element: Element;
  onClick?: (e: React.MouseEvent) => void;
  'data-testid'?: string;
}

export default function ImageModule({ element, onClick, 'data-testid': testId }: ImageModuleProps) {
  const { selectedElement } = useEditorStore();
  const isSelected = selectedElement === element.id;

  const styles = {
    ...element.styles,
    cursor: 'pointer',
    position: 'relative' as const,
    border: isSelected ? '2px dashed hsl(var(--primary))' : '2px dashed transparent',
    borderRadius: '4px',
    padding: element.styles.padding || '8px',
    display: 'inline-block',
  };

  const imageSrc = element.content.src || 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200';
  const imageAlt = element.content.alt || 'Placeholder image';

  return (
    <div
      onClick={onClick}
      style={styles}
      data-testid={testId}
      className="group"
    >
      <img
        src={imageSrc}
        alt={imageAlt}
        style={{
          maxWidth: '100%',
          height: 'auto',
          display: 'block',
          ...element.styles,
        }}
      />
      
      {isSelected && (
        <div className="absolute -top-6 left-0 bg-primary text-primary-foreground px-2 py-1 text-xs rounded z-10">
          Image Element
        </div>
      )}
    </div>
  );
}
