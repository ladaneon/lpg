import { useEditorStore } from "@/store/editor";
import type { Element } from "@shared/schema";

interface VideoModuleProps {
  element: Element;
  onClick?: (e: React.MouseEvent) => void;
  'data-testid'?: string;
}

export default function VideoModule({ element, onClick, 'data-testid': testId }: VideoModuleProps) {
  const { selectedElement } = useEditorStore();
  const isSelected = selectedElement === element.id;

  const styles = {
    ...element.styles,
    cursor: 'pointer',
    position: 'relative' as const,
    border: isSelected ? '2px dashed hsl(var(--primary))' : '2px dashed transparent',
    borderRadius: '4px',
    padding: element.styles.padding || '8px',
    width: element.styles.width || '100%',
    maxWidth: '600px',
  };

  const videoSrc = element.content.src || '';
  const posterSrc = element.content.poster || 'https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300';

  return (
    <div
      onClick={onClick}
      style={styles}
      data-testid={testId}
      className="group"
    >
      {videoSrc ? (
        <video
          controls
          poster={posterSrc}
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '4px',
            ...element.styles,
          }}
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div
          style={{
            width: '100%',
            height: '200px',
            backgroundColor: '#f1f5f9',
            border: '2px dashed #cbd5e1',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            fontSize: '14px',
          }}
        >
          <div className="text-center">
            <div className="mb-2">📹</div>
            <div>Click to add video URL</div>
          </div>
        </div>
      )}
      
      {isSelected && (
        <div className="absolute -top-6 left-0 bg-primary text-primary-foreground px-2 py-1 text-xs rounded z-10">
          Video Element
        </div>
      )}
    </div>
  );
}
