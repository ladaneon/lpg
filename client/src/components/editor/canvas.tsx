import { useDrop } from "react-dnd";
import { useEditorStore } from "@/store/editor";
import { createElement } from "@/lib/dnd";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Undo, Redo, Plus } from "lucide-react";
import TextModule from "@/components/modules/text-module";
import HeadingModule from "@/components/modules/heading-module";
import ImageModule from "@/components/modules/image-module";
import ButtonModule from "@/components/modules/button-module";
import VideoModule from "@/components/modules/video-module";
import SpacerModule from "@/components/modules/spacer-module";
import SectionModule from "@/components/modules/section-module";
import GalleryModule from "@/components/modules/gallery-module";
import ContactFormModule from "@/components/modules/contact-form-module";
import type { Element } from "@shared/schema";

function DropZone({ onDrop, className = "" }: { onDrop: (item: any) => void; className?: string }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'MODULE',
    drop: onDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`drop-zone p-8 text-center border-2 border-dashed border-muted-foreground/30 m-4 rounded-lg transition-colors ${
        isOver ? 'border-primary bg-primary/5' : ''
      } ${className}`}
      data-testid="drop-zone"
    >
      <div className="text-muted-foreground">
        <Plus className="w-6 h-6 mx-auto mb-2" />
        <p className="text-sm">Drop elements here to add content</p>
      </div>
    </div>
  );
}

function ElementRenderer({ element }: { element: Element }) {
  const { setSelectedElement } = useEditorStore();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElement(element.id);
  };

  const commonProps = {
    element,
    onClick: handleClick,
    'data-testid': `element-${element.type}-${element.id}`,
  };

  switch (element.type) {
    case 'text':
      return <TextModule {...commonProps} />;
    case 'heading':
      return <HeadingModule {...commonProps} />;
    case 'image':
      return <ImageModule {...commonProps} />;
    case 'button':
      return <ButtonModule {...commonProps} />;
    case 'video':
      return <VideoModule {...commonProps} />;
    case 'spacer':
      return <SpacerModule {...commonProps} />;
    case 'section':
      return <SectionModule {...commonProps} />;
    case 'gallery':
      return <GalleryModule {...commonProps} />;
    case 'contact-form':
      return <ContactFormModule {...commonProps} />;
    default:
      return (
        <div 
          onClick={handleClick}
          className="p-4 border border-border rounded bg-muted/50 cursor-pointer"
          data-testid={`element-${element.type}-${element.id}`}
        >
          <p className="text-sm text-muted-foreground">
            Unsupported element type: {element.type}
          </p>
        </div>
      );
  }
}

export default function Canvas() {
  const { 
    elements, 
    deviceView, 
    zoomLevel, 
    setZoomLevel, 
    addElement, 
    canUndo, 
    canRedo, 
    undo, 
    redo,
    currentProject
  } = useEditorStore();

  const handleDrop = (item: { type: string }) => {
    const newElement = createElement(item.type);
    addElement(newElement);
  };

  const deviceWidths = {
    desktop: '1200px',
    tablet: '768px', 
    mobile: '375px'
  };

  const rootElements = elements.filter(el => !el.parentId);

  return (
    <main className="flex-1 bg-secondary/30 flex flex-col overflow-hidden">
      {/* Canvas Toolbar */}
      <div className="bg-card border-b border-border p-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-sm text-muted-foreground">Page:</span>
          <span className="text-sm font-medium text-foreground" data-testid="text-current-page">
            {currentProject?.name || 'Untitled'}
          </span>
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="sm"
              disabled={!canUndo}
              onClick={undo}
              data-testid="button-canvas-undo"
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              disabled={!canRedo}
              onClick={redo}
              data-testid="button-canvas-redo"
            >
              <Redo className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Zoom:</span>
          <Select value={zoomLevel.toString()} onValueChange={(value) => setZoomLevel(parseInt(value))}>
            <SelectTrigger className="w-20" data-testid="select-zoom">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="50">50%</SelectItem>
              <SelectItem value="75">75%</SelectItem>
              <SelectItem value="100">100%</SelectItem>
              <SelectItem value="125">125%</SelectItem>
              <SelectItem value="150">150%</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Canvas Container */}
      <div 
        className="flex-1 overflow-auto p-8 device-preview" 
        data-device={deviceView}
        data-testid="canvas-container"
      >
        <div 
          className="mx-auto bg-card shadow-lg rounded-lg overflow-hidden min-h-96"
          style={{ 
            width: deviceWidths[deviceView],
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center'
          }}
          data-testid="canvas-page"
        >
          {/* Page Content Area */}
          <div className="min-h-full" onClick={() => useEditorStore.getState().setSelectedElement(null)}>
            {rootElements.length === 0 ? (
              <DropZone onDrop={handleDrop} className="my-8" />
            ) : (
              <>
                {rootElements.map((element) => (
                  <ElementRenderer key={element.id} element={element} />
                ))}
                <DropZone onDrop={handleDrop} />
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
