import { useEditorStore } from "@/store/editor";
import type { Element } from "@shared/schema";

interface SectionModuleProps {
  element: Element;
  onClick?: (e: React.MouseEvent) => void;
  'data-testid'?: string;
}

export default function SectionModule({ element, onClick, 'data-testid': testId }: SectionModuleProps) {
  const { selectedElement, elements } = useEditorStore();
  const isSelected = selectedElement === element.id;

  const styles = {
    ...element.styles,
    cursor: 'pointer',
    position: 'relative' as const,
    border: isSelected ? '2px dashed hsl(var(--primary))' : '2px dashed transparent',
    borderRadius: '4px',
    minHeight: element.styles.minHeight || '100px',
    padding: element.styles.padding || '24px',
    backgroundColor: element.styles.backgroundColor || 'transparent',
  };

  // Get child elements
  const childElements = elements.filter(el => element.children?.includes(el.id));

  return (
    <section
      onClick={onClick}
      style={styles}
      data-testid={testId}
      className="group"
    >
      {childElements.length > 0 ? (
        childElements.map((child) => (
          <div key={child.id} className="mb-4 last:mb-0">
            {/* In a full implementation, you'd recursively render child elements */}
            <div className="p-2 border border-dashed border-muted-foreground rounded">
              Child Element: {child.type}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-muted-foreground py-8">
          <div className="text-sm">Empty section - drop elements here</div>
        </div>
      )}
      
      {isSelected && (
        <div className="absolute -top-6 left-0 bg-primary text-primary-foreground px-2 py-1 text-xs rounded z-10">
          Section Element
        </div>
      )}
    </section>
  );
}
