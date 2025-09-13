import { useEditorStore } from "@/store/editor";
import type { Element } from "@shared/schema";

interface GalleryModuleProps {
  element: Element;
  onClick?: (e: React.MouseEvent) => void;
  'data-testid'?: string;
}

export default function GalleryModule({ element, onClick, 'data-testid': testId }: GalleryModuleProps) {
  const { selectedElement } = useEditorStore();
  const isSelected = selectedElement === element.id;

  const styles = {
    ...element.styles,
    cursor: 'pointer',
    position: 'relative' as const,
    border: isSelected ? '2px dashed hsl(var(--primary))' : '2px dashed transparent',
    borderRadius: '4px',
    padding: element.styles.padding || '16px',
  };

  const images = element.content.images || [
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200',
  ];

  const columns = element.content.columns || 3;

  return (
    <div
      onClick={onClick}
      style={styles}
      data-testid={testId}
      className="group"
    >
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: '12px',
        }}
      >
        {images.map((src: string, index: number) => (
          <img
            key={index}
            src={src}
            alt={`Gallery image ${index + 1}`}
            style={{
              width: '100%',
              height: '150px',
              objectFit: 'cover',
              borderRadius: '4px',
            }}
          />
        ))}
      </div>
      
      {isSelected && (
        <div className="absolute -top-6 left-0 bg-primary text-primary-foreground px-2 py-1 text-xs rounded z-10">
          Gallery Element
        </div>
      )}
    </div>
  );
}
