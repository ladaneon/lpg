import { useEditorStore } from "@/store/editor";
import type { Element } from "@shared/schema";

interface HeadingModuleProps {
  element: Element;
  onClick?: (e: React.MouseEvent) => void;
  'data-testid'?: string;
}

export default function HeadingModule({ element, onClick, 'data-testid': testId }: HeadingModuleProps) {
  const { selectedElement } = useEditorStore();
  const isSelected = selectedElement === element.id;

  const tag = element.content.tag || 'h1';
  const HeadingTag = tag as keyof JSX.IntrinsicElements;

  const styles = {
    ...element.styles,
    cursor: 'pointer',
    position: 'relative' as const,
    border: isSelected ? '2px dashed hsl(var(--primary))' : '2px dashed transparent',
    borderRadius: '4px',
    minHeight: '1rem',
    padding: element.styles.padding || '8px',
    margin: element.styles.margin || '0',
  };

  return (
    <div
      onClick={onClick}
      style={styles}
      data-testid={testId}
      className="group"
    >
      <HeadingTag style={{ margin: 0, ...element.styles }}>
        {element.content.text || 'Click to edit heading'}
      </HeadingTag>
      
      {isSelected && (
        <div className="absolute -top-6 left-0 bg-primary text-primary-foreground px-2 py-1 text-xs rounded z-10">
          {tag.toUpperCase()} Element
        </div>
      )}
    </div>
  );
}
