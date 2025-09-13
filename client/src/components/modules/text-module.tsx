import { useEditorStore } from "@/store/editor";
import type { Element } from "@shared/schema";

interface TextModuleProps {
  element: Element;
  onClick?: (e: React.MouseEvent) => void;
  'data-testid'?: string;
}

export default function TextModule({ element, onClick, 'data-testid': testId }: TextModuleProps) {
  const { selectedElement } = useEditorStore();
  const isSelected = selectedElement === element.id;

  const styles = {
    ...element.styles,
    cursor: 'pointer',
    position: 'relative' as const,
    border: isSelected ? '2px dashed hsl(var(--primary))' : '2px dashed transparent',
    borderRadius: '4px',
    minHeight: '1rem',
    padding: element.styles.padding || '8px',
  };

  return (
    <div
      onClick={onClick}
      style={styles}
      data-testid={testId}
      className="group"
    >
      <p style={{ margin: 0, ...element.styles }}>
        {element.content.text || 'Click to edit text'}
      </p>
      
      {isSelected && (
        <div className="absolute -top-6 left-0 bg-primary text-primary-foreground px-2 py-1 text-xs rounded z-10">
          Text Element
        </div>
      )}
    </div>
  );
}
