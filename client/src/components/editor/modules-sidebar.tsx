import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDrag } from "react-dnd";
import { 
  Search,
  Type,
  Heading1,
  Image,
  MousePointer,
  Video,
  MoveVertical,
  Square,
  Columns,
  GripHorizontal,
  Images,
  Sliders,
  Quote,
  Tag,
  List,
  FolderOpen,
  Mail,
  Send,
  MapPin,
  Share,
  Layers
} from "lucide-react";
import { useEditorStore } from "@/store/editor";

interface ModuleCardProps {
  type: string;
  icon: React.ReactNode;
  label: string;
  category: 'basic' | 'advanced' | 'forms' | 'layout';
}

function ModuleCard({ type, icon, label, category }: ModuleCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'MODULE',
    item: { type, category },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const categoryColors = {
    basic: 'text-primary',
    advanced: 'text-accent',
    forms: 'text-destructive',
    layout: 'text-muted-foreground'
  };

  return (
    <div
      ref={drag}
      className={`module-card p-3 bg-card border border-border rounded-lg cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${
        isDragging ? 'opacity-50' : ''
      }`}
      data-testid={`module-${type}`}
    >
      <div className="flex flex-col items-center space-y-2">
        <div className={categoryColors[category]}>
          {icon}
        </div>
        <span className="text-xs font-medium text-foreground text-center">{label}</span>
      </div>
    </div>
  );
}

export default function ModulesSidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const { setTemplateLibraryOpen } = useEditorStore();

  const basicModules = [
    { type: 'text', icon: <Type className="w-5 h-5" />, label: 'Text' },
    { type: 'heading', icon: <Heading1 className="w-5 h-5" />, label: 'Heading' },
    { type: 'image', icon: <Image className="w-5 h-5" />, label: 'Image' },
    { type: 'button', icon: <MousePointer className="w-5 h-5" />, label: 'Button' },
    { type: 'video', icon: <Video className="w-5 h-5" />, label: 'Video' },
    { type: 'spacer', icon: <MoveVertical className="w-5 h-5" />, label: 'Spacer' },
  ];

  const advancedModules = [
    { type: 'gallery', icon: <Images className="w-5 h-5" />, label: 'Gallery' },
    { type: 'slider', icon: <Sliders className="w-5 h-5" />, label: 'Slider' },
    { type: 'testimonial', icon: <Quote className="w-5 h-5" />, label: 'Testimonial' },
    { type: 'pricing', icon: <Tag className="w-5 h-5" />, label: 'Pricing' },
    { type: 'accordion', icon: <List className="w-5 h-5" />, label: 'Accordion' },
    { type: 'tabs', icon: <FolderOpen className="w-5 h-5" />, label: 'Tabs' },
  ];

  const formsModules = [
    { type: 'contact-form', icon: <Mail className="w-5 h-5" />, label: 'Contact Form' },
    { type: 'newsletter', icon: <Send className="w-5 h-5" />, label: 'Newsletter' },
    { type: 'map', icon: <MapPin className="w-5 h-5" />, label: 'Map' },
    { type: 'social', icon: <Share className="w-5 h-5" />, label: 'Social Icons' },
  ];

  const layoutModules = [
    { type: 'section', icon: <Square className="w-5 h-5" />, label: 'Section' },
    { type: 'row', icon: <GripHorizontal className="w-5 h-5" />, label: 'Row' },
    { type: 'column', icon: <Columns className="w-5 h-5" />, label: 'Column' },
  ];

  const allModules = [
    ...basicModules.map(m => ({ ...m, category: 'basic' as const })),
    ...advancedModules.map(m => ({ ...m, category: 'advanced' as const })),
    ...formsModules.map(m => ({ ...m, category: 'forms' as const })),
    ...layoutModules.map(m => ({ ...m, category: 'layout' as const })),
  ];

  const filteredModules = allModules.filter(module =>
    module.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-80 bg-muted/30 border-r border-border flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-3">Elements</h2>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search elements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-modules"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        </div>
      </div>
      
      {/* Module Categories */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {searchQuery ? (
          <div className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
              Search Results
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {filteredModules.map((module) => (
                <ModuleCard
                  key={module.type}
                  type={module.type}
                  icon={module.icon}
                  label={module.label}
                  category={module.category}
                />
              ))}
            </div>
            {filteredModules.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No elements found matching "{searchQuery}"
              </p>
            )}
          </div>
        ) : (
          <>
            {/* Basic Elements */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                Basic Elements
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {basicModules.map((module) => (
                  <ModuleCard
                    key={module.type}
                    type={module.type}
                    icon={module.icon}
                    label={module.label}
                    category="basic"
                  />
                ))}
              </div>
            </div>
            
            {/* Advanced Elements */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                Advanced
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {advancedModules.map((module) => (
                  <ModuleCard
                    key={module.type}
                    type={module.type}
                    icon={module.icon}
                    label={module.label}
                    category="advanced"
                  />
                ))}
              </div>
            </div>
            
            {/* Forms & Interactive */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                Forms & Interactive
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {formsModules.map((module) => (
                  <ModuleCard
                    key={module.type}
                    type={module.type}
                    icon={module.icon}
                    label={module.label}
                    category="forms"
                  />
                ))}
              </div>
            </div>
            
            {/* Layout */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                Layout
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {layoutModules.map((module) => (
                  <ModuleCard
                    key={module.type}
                    type={module.type}
                    icon={module.icon}
                    label={module.label}
                    category="layout"
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Templates Button */}
      <div className="p-4 border-t border-border">
        <Button
          className="w-full"
          onClick={() => setTemplateLibraryOpen(true)}
          data-testid="button-template-library"
        >
          <Layers className="w-4 h-4 mr-2" />
          Template Library
        </Button>
      </div>
    </aside>
  );
}
