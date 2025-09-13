import { useEditorStore } from "@/store/editor";
import type { Element } from "@shared/schema";

interface FallbackModuleProps {
  element: Element;
  onClick?: (e: React.MouseEvent) => void;
  'data-testid'?: string;
}

export default function FallbackModule({ element, onClick, 'data-testid': testId }: FallbackModuleProps) {
  const { selectedElement } = useEditorStore();
  const isSelected = selectedElement === element.id;

  const styles = {
    ...element.styles,
    cursor: 'pointer',
    position: 'relative' as const,
    border: isSelected ? '2px dashed hsl(var(--primary))' : '2px dashed transparent',
    borderRadius: '4px',
    minHeight: '60px',
    padding: '16px',
    backgroundColor: element.styles.backgroundColor || 'rgba(248, 250, 252, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column' as const,
    gap: '8px',
  };

  const getElementIcon = (type: string) => {
    const iconMap: Record<string, string> = {
      'divider': '➖',
      'separator': '〰️',
      'container': '📦',
      'grid': '⊞',
      'carousel': '🎠',
      'hero': '⭐',
      'feature-box': '📦',
      'icon-box': '🔲',
      'review': '💬',
      'stats': '📊',
      'counter': '🔢',
      'progress-bar': '📊',
      'modal': '🗔',
      'tooltip': 'ℹ️',
      'dropdown': '▼',
      'search-box': '🔍',
      'rating': '⭐',
      'toggle': '🔄',
      'timeline': '📅',
      'input': '📝',
      'textarea': '📄',
      'select': '📋',
      'checkbox': '☑️',
      'radio': '🔘',
      'file-upload': '📎',
      'pricing-table': '💰',
      'team-member': '👤',
      'service-card': '🏢',
      'product-card': '🛍️',
      'blog-card': '📖',
      'countdown': '⏰',
      'notification': '🔔',
      'alert': '⚠️',
      'badge': '🏷️',
    };
    return iconMap[type] || '🧩';
  };

  const getElementTitle = (type: string) => {
    return type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div
      onClick={onClick}
      style={styles}
      data-testid={testId}
      className="group"
    >
      <div className="text-2xl opacity-70">
        {getElementIcon(element.type)}
      </div>
      <div className="text-sm font-medium text-foreground text-center">
        {getElementTitle(element.type)}
      </div>
      <div className="text-xs text-muted-foreground text-center">
        Click to configure
      </div>
      
      {isSelected && (
        <div className="absolute -top-6 left-0 bg-primary text-primary-foreground px-2 py-1 text-xs rounded z-10">
          {getElementTitle(element.type)} Element
        </div>
      )}
    </div>
  );
}