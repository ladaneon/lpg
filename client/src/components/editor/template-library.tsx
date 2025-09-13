import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEditorStore } from "@/store/editor";
import { useToast } from "@/hooks/use-toast";
import { Search, X } from "lucide-react";
import type { Template } from "@shared/schema";

export default function TemplateLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { 
    isTemplateLibraryOpen, 
    setTemplateLibraryOpen, 
    setElements, 
    setGlobalStyles,
    currentProject
  } = useEditorStore();
  const { toast } = useToast();

  const { data: templates, isLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
    enabled: isTemplateLibraryOpen,
  });

  const useTemplateMutation = useMutation({
    mutationFn: async (template: Template) => {
      // Apply template to current project
      setElements(Array.isArray(template.elements) ? template.elements : []);
      setGlobalStyles(template.globalStyles && typeof template.globalStyles === 'object' ? template.globalStyles as any : {
        colors: {
          primary: "#2563eb",
          secondary: "#64748b",
          accent: "#7c3aed", 
          background: "#ffffff",
          foreground: "#0f172a"
        },
        fonts: {
          primary: "Inter",
          secondary: "Georgia",
          mono: "Menlo"
        },
        spacing: {
          scale: 1,
          unit: "rem"
        }
      });
    },
    onSuccess: () => {
      setTemplateLibraryOpen(false);
      toast({
        title: "Template applied",
        description: "The template has been successfully applied to your project.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to apply template. Please try again.",
        variant: "destructive",
      });
    },
  });

  const categories = [
    { id: "all", label: "All Templates" },
    { id: "Landing Page", label: "Landing Page" },
    { id: "Business", label: "Business" },
    { id: "Portfolio", label: "Portfolio" },
    { id: "E-commerce", label: "E-commerce" },
    { id: "Blog", label: "Blog" },
  ];

  const filteredTemplates = templates?.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  if (!isTemplateLibraryOpen) return null;

  return (
    <Dialog open={isTemplateLibraryOpen} onOpenChange={setTemplateLibraryOpen}>
      <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-hidden p-0">
        {/* Modal Header */}
        <DialogHeader className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-semibold">Template Library</DialogTitle>
              <DialogDescription className="mt-1">
                Choose from professionally designed templates to get started quickly
              </DialogDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setTemplateLibraryOpen(false)}
              data-testid="button-close-template-library"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search-templates"
            />
          </div>
        </DialogHeader>

        {/* Template Categories */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-6 w-full border-b border-border rounded-none h-auto">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-primary"
                data-testid={`tab-category-${category.id}`}
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent 
              key={category.id} 
              value={category.id} 
              className="flex-1 p-6 overflow-y-auto"
              style={{ maxHeight: "60vh" }}
            >
              {isLoading ? (
                <div className="grid grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-[4/3] bg-muted rounded-lg mb-3"></div>
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : filteredTemplates.length > 0 ? (
                <div className="grid grid-cols-3 gap-6">
                  {filteredTemplates.map((template) => (
                    <div key={template.id} className="group cursor-pointer">
                      <div className="relative overflow-hidden rounded-lg border border-border bg-muted aspect-[4/3] mb-3">
                        {template.previewImage ? (
                          <img 
                            src={template.previewImage} 
                            alt={template.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            No preview available
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-4 left-4 right-4">
                            <Button
                              className="w-full"
                              onClick={() => useTemplateMutation.mutate(template)}
                              disabled={useTemplateMutation.isPending}
                              data-testid={`button-use-template-${template.id}`}
                            >
                              {useTemplateMutation.isPending ? "Applying..." : "Use Template"}
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground" data-testid={`text-template-name-${template.id}`}>
                          {template.name}
                        </h3>
                        {template.description && (
                          <p className="text-sm text-muted-foreground" data-testid={`text-template-description-${template.id}`}>
                            {template.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {searchQuery 
                      ? `No templates found matching "${searchQuery}"` 
                      : `No templates available in ${category.label}`
                    }
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
