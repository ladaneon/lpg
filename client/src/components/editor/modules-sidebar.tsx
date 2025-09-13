import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDrag } from "react-dnd";
import { 
  Search, Type, Heading1, Image, MousePointer, Video, MoveVertical,
  Square, Columns, GripHorizontal, Images, Sliders, Quote, Tag, List,
  FolderOpen, Mail, Send, MapPin, Share, Layers, Minus,
  Box, Grid3X3, RotateCcw, Star, Package, Boxes, MessageSquare,
  BarChart3, Calculator, Maximize2, Info, ChevronDown, ToggleLeft,
  Power, Clock, Edit, AlignLeft, Check, Circle, Upload, Navigation,
  Menu, ArrowRight, MoreHorizontal, PanelLeft, Volume2, Code,
  ExternalLink, Code2, Share2, MessageCircle, Table, User, FileText,
  Briefcase, ShoppingCart, BookOpen, Calendar, Folder, Cloud, Timer,
  Bell, AlertTriangle, Award, Brackets, Activity
} from "lucide-react";
import { useEditorStore } from "@/store/editor";

interface ModuleCardProps {
  type: string;
  icon: React.ReactNode;
  label: string;
  category: 'basic' | 'layout' | 'content' | 'interactive' | 'forms' | 'navigation' | 'media' | 'social' | 'business' | 'utility';
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
    basic: 'text-[hsl(var(--cat-basic))]',
    layout: 'text-[hsl(var(--cat-layout))]',
    content: 'text-[hsl(var(--cat-content))]',
    interactive: 'text-[hsl(var(--cat-interactive))]',
    forms: 'text-[hsl(var(--cat-forms))]',
    navigation: 'text-[hsl(var(--cat-content))]',
    media: 'text-[hsl(var(--cat-interactive))]',
    social: 'text-[hsl(var(--cat-business))]',
    business: 'text-[hsl(var(--cat-business))]',
    utility: 'text-[hsl(var(--cat-utility))]'
  };

  return (
    <div
      ref={drag}
      className={`module-card p-3 bg-card border border-border rounded-lg cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 hover:bg-[hsl(var(--primary))/0.03] hover:border-[hsl(var(--primary))/0.2] hover:ring-1 hover:ring-[hsl(var(--primary))/0.1] ${
        isDragging ? 'opacity-50' : ''
      }`}
      data-testid={`module-${type}`}
    >
      <div className="flex flex-col items-center space-y-2">
        <div className={`${categoryColors[category]} transition-all hover:scale-110`}>
          {icon}
        </div>
        <span className="text-xs font-medium text-foreground text-center transition-all hover:text-[hsl(var(--primary))]">{label}</span>
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
    { type: 'divider', icon: <Minus className="w-5 h-5" />, label: 'Divider' },
  ];

  const layoutModules = [
    { type: 'section', icon: <Square className="w-5 h-5" />, label: 'Section' },
    { type: 'row', icon: <GripHorizontal className="w-5 h-5" />, label: 'Row' },
    { type: 'column', icon: <Columns className="w-5 h-5" />, label: 'Column' },
    { type: 'container', icon: <Box className="w-5 h-5" />, label: 'Container' },
    { type: 'grid', icon: <Grid3X3 className="w-5 h-5" />, label: 'Grid' },
  ];

  const contentModules = [
    { type: 'gallery', icon: <Images className="w-5 h-5" />, label: 'Gallery' },
    { type: 'slider', icon: <Sliders className="w-5 h-5" />, label: 'Slider' },
    { type: 'carousel', icon: <RotateCcw className="w-5 h-5" />, label: 'Carousel' },
    { type: 'hero', icon: <Star className="w-5 h-5" />, label: 'Hero Section' },
    { type: 'feature-box', icon: <Package className="w-5 h-5" />, label: 'Feature Box' },
    { type: 'icon-box', icon: <Boxes className="w-5 h-5" />, label: 'Icon Box' },
    { type: 'testimonial', icon: <Quote className="w-5 h-5" />, label: 'Testimonial' },
    { type: 'review', icon: <MessageSquare className="w-5 h-5" />, label: 'Review' },
    { type: 'stats', icon: <BarChart3 className="w-5 h-5" />, label: 'Statistics' },
    { type: 'counter', icon: <Calculator className="w-5 h-5" />, label: 'Counter' },
    { type: 'progress-bar', icon: <Activity className="w-5 h-5" />, label: 'Progress Bar' },
  ];

  const interactiveModules = [
    { type: 'accordion', icon: <List className="w-5 h-5" />, label: 'Accordion' },
    { type: 'tabs', icon: <FolderOpen className="w-5 h-5" />, label: 'Tabs' },
    { type: 'modal', icon: <Maximize2 className="w-5 h-5" />, label: 'Modal' },
    { type: 'tooltip', icon: <Info className="w-5 h-5" />, label: 'Tooltip' },
    { type: 'dropdown', icon: <ChevronDown className="w-5 h-5" />, label: 'Dropdown' },
    { type: 'search-box', icon: <Search className="w-5 h-5" />, label: 'Search Box' },
    { type: 'rating', icon: <Star className="w-5 h-5" />, label: 'Rating' },
    { type: 'toggle', icon: <ToggleLeft className="w-5 h-5" />, label: 'Toggle' },
    { type: 'timeline', icon: <Clock className="w-5 h-5" />, label: 'Timeline' },
  ];

  const formsModules = [
    { type: 'contact-form', icon: <Mail className="w-5 h-5" />, label: 'Contact Form' },
    { type: 'newsletter', icon: <Send className="w-5 h-5" />, label: 'Newsletter' },
    { type: 'input', icon: <Edit className="w-5 h-5" />, label: 'Input Field' },
    { type: 'textarea', icon: <AlignLeft className="w-5 h-5" />, label: 'Text Area' },
    { type: 'select', icon: <ChevronDown className="w-5 h-5" />, label: 'Select' },
    { type: 'checkbox', icon: <Check className="w-5 h-5" />, label: 'Checkbox' },
    { type: 'radio', icon: <Circle className="w-5 h-5" />, label: 'Radio Button' },
    { type: 'file-upload', icon: <Upload className="w-5 h-5" />, label: 'File Upload' },
  ];

  const businessModules = [
    { type: 'pricing', icon: <Tag className="w-5 h-5" />, label: 'Pricing Card' },
    { type: 'pricing-table', icon: <Table className="w-5 h-5" />, label: 'Pricing Table' },
    { type: 'team-member', icon: <User className="w-5 h-5" />, label: 'Team Member' },
    { type: 'service-card', icon: <Briefcase className="w-5 h-5" />, label: 'Service Card' },
    { type: 'product-card', icon: <ShoppingCart className="w-5 h-5" />, label: 'Product Card' },
    { type: 'blog-card', icon: <BookOpen className="w-5 h-5" />, label: 'Blog Card' },
  ];

  const utilityModules = [
    { type: 'map', icon: <MapPin className="w-5 h-5" />, label: 'Map' },
    { type: 'social', icon: <Share className="w-5 h-5" />, label: 'Social Icons' },
    { type: 'countdown', icon: <Timer className="w-5 h-5" />, label: 'Countdown' },
    { type: 'notification', icon: <Bell className="w-5 h-5" />, label: 'Notification' },
    { type: 'alert', icon: <AlertTriangle className="w-5 h-5" />, label: 'Alert' },
    { type: 'badge', icon: <Award className="w-5 h-5" />, label: 'Badge' },
  ];

  const allModules = [
    ...basicModules.map(m => ({ ...m, category: 'basic' as const })),
    ...layoutModules.map(m => ({ ...m, category: 'layout' as const })),
    ...contentModules.map(m => ({ ...m, category: 'content' as const })),
    ...interactiveModules.map(m => ({ ...m, category: 'interactive' as const })),
    ...formsModules.map(m => ({ ...m, category: 'forms' as const })),
    ...businessModules.map(m => ({ ...m, category: 'business' as const })),
    ...utilityModules.map(m => ({ ...m, category: 'utility' as const })),
  ];

  const filteredModules = allModules.filter(module =>
    module.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-80 bg-[hsl(var(--sidebar))] border-r border-[hsl(var(--sidebar-border))] flex flex-col shadow-sm">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-[hsl(var(--sidebar-border))] bg-[hsl(var(--primary))/0.02]">
        <h2 className="text-lg font-semibold text-[hsl(var(--sidebar-foreground))] mb-3">Elements</h2>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search elements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 ring-1 ring-[hsl(var(--primary))/0.1] focus:ring-2 focus:ring-[hsl(var(--primary))/0.3] border-[hsl(var(--sidebar-border))]"
            data-testid="input-search-modules"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--cat-utility))] w-4 h-4" />
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
            
            {/* Layout Elements */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                Layout
              </h3>
              <div className="grid grid-cols-2 gap-2">
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
            
            {/* Content Elements */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                Content
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {contentModules.map((module) => (
                  <ModuleCard
                    key={module.type}
                    type={module.type}
                    icon={module.icon}
                    label={module.label}
                    category="content"
                  />
                ))}
              </div>
            </div>
            
            {/* Interactive Elements */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                Interactive
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {interactiveModules.map((module) => (
                  <ModuleCard
                    key={module.type}
                    type={module.type}
                    icon={module.icon}
                    label={module.label}
                    category="interactive"
                  />
                ))}
              </div>
            </div>
            
            {/* Forms Elements */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                Forms
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
            
            {/* Business Elements */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                Business
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {businessModules.map((module) => (
                  <ModuleCard
                    key={module.type}
                    type={module.type}
                    icon={module.icon}
                    label={module.label}
                    category="business"
                  />
                ))}
              </div>
            </div>
            
            {/* Utility Elements */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                Utility
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {utilityModules.map((module) => (
                  <ModuleCard
                    key={module.type}
                    type={module.type}
                    icon={module.icon}
                    label={module.label}
                    category="utility"
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
