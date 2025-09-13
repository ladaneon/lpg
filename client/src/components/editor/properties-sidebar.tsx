import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEditorStore } from "@/store/editor";
import { Copy, Trash2, Copy as CopyIcon, Clipboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PropertiesSidebar() {
  const { 
    selectedElement, 
    elements, 
    updateElement, 
    deleteElement, 
    duplicateElement,
    globalStyles,
    updateGlobalStyles
  } = useEditorStore();
  
  const { toast } = useToast();
  const [copiedStyles, setCopiedStyles] = useState<any>(null);

  const element = selectedElement ? elements.find(el => el.id === selectedElement) : null;

  const handleContentChange = (field: string, value: any) => {
    if (!element) return;
    updateElement(element.id, {
      content: { ...element.content, [field]: value }
    });
  };

  const handleStyleChange = (field: string, value: any) => {
    if (!element) return;
    updateElement(element.id, {
      styles: { ...element.styles, [field]: value }
    });
  };

  const handleGlobalStyleChange = (category: string, field: string, value: any) => {
    updateGlobalStyles({
      ...globalStyles,
      [category]: {
        ...(globalStyles[category as keyof typeof globalStyles] as any),
        [field]: value
      }
    });
  };

  const handleCopyStyles = () => {
    if (!element) return;
    setCopiedStyles(element.styles);
    toast({
      title: "Styles copied",
      description: "Element styles have been copied to clipboard.",
    });
  };

  const handlePasteStyles = () => {
    if (!element || !copiedStyles) return;
    updateElement(element.id, { styles: copiedStyles });
    toast({
      title: "Styles pasted",
      description: "Styles have been applied to the selected element.",
    });
  };

  const handleDuplicate = () => {
    if (!element) return;
    duplicateElement(element.id);
    toast({
      title: "Element duplicated",
      description: "A copy of the element has been created.",
    });
  };

  const handleDelete = () => {
    if (!element) return;
    deleteElement(element.id);
    toast({
      title: "Element deleted",
      description: "The element has been removed from the page.",
    });
  };

  return (
    <aside className="w-80 bg-card border-l border-border flex flex-col">
      {/* Properties Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">Properties</h2>
          {element && (
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleDuplicate}
                data-testid="button-duplicate-element"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleDelete}
                className="text-destructive hover:text-destructive/80"
                data-testid="button-delete-element"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground" data-testid="text-selected-element">
          {element ? `${element.type.charAt(0).toUpperCase() + element.type.slice(1)} selected` : "No element selected"}
        </p>
      </div>
      
      {/* Properties Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <Tabs defaultValue="element" className="w-full">
          <TabsList className="grid grid-cols-3 w-full mx-4 mt-4">
            <TabsTrigger value="element">Element</TabsTrigger>
            <TabsTrigger value="global">Global</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="element" className="p-4 space-y-6">
            {element ? (
              <>
                {/* Content Properties */}
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3">Content</h3>
                  <div className="space-y-3">
                    {element.type === 'heading' && (
                      <>
                        <div>
                          <Label htmlFor="heading-text">Heading Text</Label>
                          <Input
                            id="heading-text"
                            value={element.content.text || ''}
                            onChange={(e) => handleContentChange('text', e.target.value)}
                            data-testid="input-heading-text"
                          />
                        </div>
                        <div>
                          <Label htmlFor="heading-tag">Heading Tag</Label>
                          <Select 
                            value={element.content.tag || 'h1'} 
                            onValueChange={(value) => handleContentChange('tag', value)}
                          >
                            <SelectTrigger data-testid="select-heading-tag">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="h1">H1</SelectItem>
                              <SelectItem value="h2">H2</SelectItem>
                              <SelectItem value="h3">H3</SelectItem>
                              <SelectItem value="h4">H4</SelectItem>
                              <SelectItem value="h5">H5</SelectItem>
                              <SelectItem value="h6">H6</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}

                    {element.type === 'text' && (
                      <div>
                        <Label htmlFor="text-content">Text Content</Label>
                        <Input
                          id="text-content"
                          value={element.content.text || ''}
                          onChange={(e) => handleContentChange('text', e.target.value)}
                          data-testid="input-text-content"
                        />
                      </div>
                    )}

                    {element.type === 'button' && (
                      <>
                        <div>
                          <Label htmlFor="button-text">Button Text</Label>
                          <Input
                            id="button-text"
                            value={element.content.text || ''}
                            onChange={(e) => handleContentChange('text', e.target.value)}
                            data-testid="input-button-text"
                          />
                        </div>
                        <div>
                          <Label htmlFor="button-link">Link URL</Label>
                          <Input
                            id="button-link"
                            value={element.content.link || ''}
                            onChange={(e) => handleContentChange('link', e.target.value)}
                            placeholder="https://example.com"
                            data-testid="input-button-link"
                          />
                        </div>
                      </>
                    )}

                    {element.type === 'image' && (
                      <>
                        <div>
                          <Label htmlFor="image-src">Image URL</Label>
                          <Input
                            id="image-src"
                            value={element.content.src || ''}
                            onChange={(e) => handleContentChange('src', e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            data-testid="input-image-src"
                          />
                        </div>
                        <div>
                          <Label htmlFor="image-alt">Alt Text</Label>
                          <Input
                            id="image-alt"
                            value={element.content.alt || ''}
                            onChange={(e) => handleContentChange('alt', e.target.value)}
                            data-testid="input-image-alt"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Design Properties */}
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3">Design</h3>
                  <div className="space-y-3">
                    {/* Typography */}
                    {(element.type === 'text' || element.type === 'heading' || element.type === 'button') && (
                      <>
                        <div>
                          <Label htmlFor="font-family">Font Family</Label>
                          <Select 
                            value={element.styles.fontFamily || 'Inter'} 
                            onValueChange={(value) => handleStyleChange('fontFamily', value)}
                          >
                            <SelectTrigger data-testid="select-font-family">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Inter">Inter</SelectItem>
                              <SelectItem value="Roboto">Roboto</SelectItem>
                              <SelectItem value="Open Sans">Open Sans</SelectItem>
                              <SelectItem value="Montserrat">Montserrat</SelectItem>
                              <SelectItem value="Georgia">Georgia</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="font-size">Font Size (px)</Label>
                            <Input
                              id="font-size"
                              type="number"
                              value={parseInt(element.styles.fontSize) || 16}
                              onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`)}
                              data-testid="input-font-size"
                            />
                          </div>
                          <div>
                            <Label htmlFor="font-weight">Font Weight</Label>
                            <Select 
                              value={element.styles.fontWeight || '400'} 
                              onValueChange={(value) => handleStyleChange('fontWeight', value)}
                            >
                              <SelectTrigger data-testid="select-font-weight">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="300">Light</SelectItem>
                                <SelectItem value="400">Regular</SelectItem>
                                <SelectItem value="500">Medium</SelectItem>
                                <SelectItem value="600">Semibold</SelectItem>
                                <SelectItem value="700">Bold</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="text-color">Text Color</Label>
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-8 h-8 border border-border rounded cursor-pointer"
                              style={{ backgroundColor: element.styles.color || '#000000' }}
                            ></div>
                            <Input
                              id="text-color"
                              value={element.styles.color || '#000000'}
                              onChange={(e) => handleStyleChange('color', e.target.value)}
                              data-testid="input-text-color"
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Text Alignment</Label>
                          <div className="grid grid-cols-4 gap-1 mt-1">
                            {['left', 'center', 'right', 'justify'].map((align) => (
                              <Button
                                key={align}
                                variant={element.styles.textAlign === align ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleStyleChange('textAlign', align)}
                                data-testid={`button-align-${align}`}
                              >
                                {align.charAt(0).toUpperCase()}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Background for all elements */}
                    <div>
                      <Label htmlFor="background-color">Background Color</Label>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-8 h-8 border border-border rounded cursor-pointer"
                          style={{ backgroundColor: element.styles.backgroundColor || 'transparent' }}
                        ></div>
                        <Input
                          id="background-color"
                          value={element.styles.backgroundColor || ''}
                          onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                          placeholder="transparent"
                          data-testid="input-background-color"
                        />
                      </div>
                    </div>

                    {/* Spacing */}
                    <div>
                      <Label>Padding (px)</Label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <Input
                          placeholder="Top"
                          type="number"
                          value={parseInt(element.styles.paddingTop) || ''}
                          onChange={(e) => handleStyleChange('paddingTop', `${e.target.value}px`)}
                          data-testid="input-padding-top"
                        />
                        <Input
                          placeholder="Right" 
                          type="number"
                          value={parseInt(element.styles.paddingRight) || ''}
                          onChange={(e) => handleStyleChange('paddingRight', `${e.target.value}px`)}
                          data-testid="input-padding-right"
                        />
                        <Input
                          placeholder="Bottom"
                          type="number"
                          value={parseInt(element.styles.paddingBottom) || ''}
                          onChange={(e) => handleStyleChange('paddingBottom', `${e.target.value}px`)}
                          data-testid="input-padding-bottom"
                        />
                        <Input
                          placeholder="Left"
                          type="number"
                          value={parseInt(element.styles.paddingLeft) || ''}
                          onChange={(e) => handleStyleChange('paddingLeft', `${e.target.value}px`)}
                          data-testid="input-padding-left"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Margin (px)</Label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <Input
                          placeholder="Top"
                          type="number"
                          value={parseInt(element.styles.marginTop) || ''}
                          onChange={(e) => handleStyleChange('marginTop', `${e.target.value}px`)}
                          data-testid="input-margin-top"
                        />
                        <Input
                          placeholder="Right"
                          type="number"
                          value={parseInt(element.styles.marginRight) || ''}
                          onChange={(e) => handleStyleChange('marginRight', `${e.target.value}px`)}
                          data-testid="input-margin-right"
                        />
                        <Input
                          placeholder="Bottom"
                          type="number"
                          value={parseInt(element.styles.marginBottom) || ''}
                          onChange={(e) => handleStyleChange('marginBottom', `${e.target.value}px`)}
                          data-testid="input-margin-bottom"
                        />
                        <Input
                          placeholder="Left"
                          type="number"
                          value={parseInt(element.styles.marginLeft) || ''}
                          onChange={(e) => handleStyleChange('marginLeft', `${e.target.value}px`)}
                          data-testid="input-margin-left"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <p>Select an element to edit its properties</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="global" className="p-4 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Global Colors</h3>
              <div className="space-y-3">
                {Object.entries(globalStyles.colors || {}).map(([key, value]) => (
                  <div key={key}>
                    <Label htmlFor={`global-color-${key}`}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-8 h-8 border border-border rounded cursor-pointer"
                        style={{ backgroundColor: value }}
                      ></div>
                      <Input
                        id={`global-color-${key}`}
                        value={value}
                        onChange={(e) => handleGlobalStyleChange('colors', key, e.target.value)}
                        data-testid={`input-global-color-${key}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Global Fonts</h3>
              <div className="space-y-3">
                {Object.entries(globalStyles.fonts || {}).map(([key, value]) => (
                  <div key={key}>
                    <Label htmlFor={`global-font-${key}`}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                    <Select 
                      value={value} 
                      onValueChange={(newValue) => handleGlobalStyleChange('fonts', key, newValue)}
                    >
                      <SelectTrigger data-testid={`select-global-font-${key}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Montserrat">Montserrat</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                        <SelectItem value="Menlo">Menlo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="p-4 space-y-6">
            <div className="text-center text-muted-foreground py-8">
              <p>Advanced properties coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Quick Actions */}
      {element && (
        <div className="p-4 border-t border-border">
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCopyStyles}
              data-testid="button-copy-styles"
            >
              <CopyIcon className="w-4 h-4 mr-1" />
              Copy
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handlePasteStyles}
              disabled={!copiedStyles}
              data-testid="button-paste-styles"
            >
              <Clipboard className="w-4 h-4 mr-1" />
              Paste
            </Button>
          </div>
        </div>
      )}
    </aside>
  );
}
