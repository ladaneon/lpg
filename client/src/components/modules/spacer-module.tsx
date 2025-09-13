import { useEditorStore } from "@/store/editor";
import type { Element } from "@shared/schema";

interface SpacerModuleProps {
  element: Element;
  onClick?: (e: React.MouseEvent) => void;
  'data-testid'?: string;
}

export default function SpacerModule({ element, onClick, 'data-testid': testId }: SpacerModuleProps) {
  const { selectedElement } = useEditorStore();
  const isSelected = selectedElement === element.id;

  const height = element.styles.height || '40px';

  const styles = {
    height,
    cursor: 'pointer',
    position: 'relative' as const,
    border: isSelected ? '2px dashed hsl(var(--primary))' : '2px dashed transparent',
    borderRadius: '4px',
    backgroundColor: isSelected ? 'hsl(var(--primary) / 0.1)' : 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...element.styles,
  };

  return (
    <div
      onClick={onClick}
      style={styles}
      data-testid={testId}
      className="group"
    >
      {isSelected && (
        <>
          <div className="text-xs text-muted-foreground">
            Spacer ({height})
          </div>
          <div className="absolute -top-6 left-0 bg-primary text-primary-foreground px-2 py-1 text-xs rounded z-10">
            Spacer Element
          </div>
        </>
      )}
    </div>
  );
}
