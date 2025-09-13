import { useEditorStore } from "@/store/editor";
import type { Element } from "@shared/schema";

interface ButtonModuleProps {
  element: Element;
  onClick?: (e: React.MouseEvent) => void;
  'data-testid'?: string;
}

export default function ButtonModule({ element, onClick, 'data-testid': testId }: ButtonModuleProps) {
  const { selectedElement } = useEditorStore();
  const isSelected = selectedElement === element.id;

  const wrapperStyles = {
    cursor: 'pointer',
    position: 'relative' as const,
    border: isSelected ? '2px dashed hsl(var(--primary))' : '2px dashed transparent',
    borderRadius: '4px',
    padding: '4px',
    display: 'inline-block',
  };

  const buttonStyles = {
    backgroundColor: element.styles.backgroundColor || '#2563eb',
    color: element.styles.color || '#ffffff',
    padding: element.styles.padding || '12px 24px',
    borderRadius: element.styles.borderRadius || '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: element.styles.fontSize || '16px',
    fontWeight: element.styles.fontWeight || '500',
    textDecoration: 'none',
    display: 'inline-block',
    ...element.styles,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation in editor
    if (onClick) onClick(e);
  };

  return (
    <div
      onClick={handleClick}
      style={wrapperStyles}
      data-testid={testId}
      className="group"
    >
      <a
        href={element.content.link || '#'}
        style={buttonStyles}
        onClick={(e) => e.preventDefault()}
      >
        {element.content.text || 'Click to edit button'}
      </a>
      
      {isSelected && (
        <div className="absolute -top-6 left-0 bg-primary text-primary-foreground px-2 py-1 text-xs rounded z-10">
          Button Element
        </div>
      )}
    </div>
  );
}
