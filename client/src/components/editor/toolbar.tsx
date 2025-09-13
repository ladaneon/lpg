import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEditorStore } from "@/store/editor";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { generateHTMLExport } from "@/lib/export";
import { 
  Box, 
  Plus, 
  Save, 
  Download, 
  Rocket, 
  Monitor, 
  Tablet, 
  Smartphone,
  History,
  Undo,
  Redo
} from "lucide-react";
import { Link } from "wouter";

export default function Toolbar() {
  const { 
    currentProject, 
    elements, 
    globalStyles, 
    deviceView, 
    setDeviceView, 
    zoomLevel, 
    setZoomLevel,
    setTemplateLibraryOpen,
    canUndo,
    canRedo,
    undo,
    redo
  } = useEditorStore();
  
  const { toast } = useToast();

  const saveProjectMutation = useMutation({
    mutationFn: async () => {
      if (!currentProject) throw new Error("No project loaded");
      
      const response = await apiRequest("PUT", `/api/projects/${currentProject.id}`, {
        elements,
        globalStyles,
        updatedAt: new Date()
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Project saved",
        description: "Your changes have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Save failed", 
        description: "Failed to save your project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const exportMutation = useMutation({
    mutationFn: async () => {
      if (!currentProject) throw new Error("No project loaded");
      
      const response = await apiRequest("POST", `/api/projects/${currentProject.id}/export`, {});
      const blob = await response.blob();
      
      // Download the file
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentProject.name}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      toast({
        title: "Export successful",
        description: "Your landing page has been exported as HTML.",
      });
    },
    onError: () => {
      toast({
        title: "Export failed",
        description: "Failed to export your project. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <header className="bg-card border-b border-border h-16 flex items-center justify-between px-4 shadow-sm">
      <div className="flex items-center space-x-4">
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Box className="w-4 h-4 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-semibold text-foreground">PageBuilder Pro</h1>
        </Link>
        
        <div className="flex items-center space-x-2 ml-8">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => setTemplateLibraryOpen(true)}
            data-testid="button-new-page"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Page
          </Button>
          <Button 
            size="sm" 
            onClick={() => saveProjectMutation.mutate()}
            disabled={saveProjectMutation.isPending}
            data-testid="button-save"
          >
            <Save className="w-4 h-4 mr-2" />
            {saveProjectMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
      
      {/* Device Preview Controls */}
      <div className="flex items-center space-x-2 bg-muted rounded-lg p-1">
        <Button
          variant={deviceView === "desktop" ? "default" : "ghost"}
          size="sm"
          onClick={() => setDeviceView("desktop")}
          data-testid="button-desktop-view"
        >
          <Monitor className="w-4 h-4 mr-1" />
          Desktop
        </Button>
        <Button
          variant={deviceView === "tablet" ? "default" : "ghost"}
          size="sm" 
          onClick={() => setDeviceView("tablet")}
          data-testid="button-tablet-view"
        >
          <Tablet className="w-4 h-4 mr-1" />
          Tablet
        </Button>
        <Button
          variant={deviceView === "mobile" ? "default" : "ghost"}
          size="sm"
          onClick={() => setDeviceView("mobile")}
          data-testid="button-mobile-view"
        >
          <Smartphone className="w-4 h-4 mr-1" />
          Mobile
        </Button>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Version Control */}
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
            v1.0
          </span>
          <Button 
            variant="ghost" 
            size="sm"
            disabled={!canUndo}
            onClick={undo}
            data-testid="button-undo"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            disabled={!canRedo}
            onClick={redo}
            data-testid="button-redo"
          >
            <Redo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" data-testid="button-history">
            <History className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Export & Publish */}
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => exportMutation.mutate()}
            disabled={exportMutation.isPending}
            data-testid="button-export"
          >
            <Download className="w-4 h-4 mr-2" />
            {exportMutation.isPending ? "Exporting..." : "Export HTML"}
          </Button>
          <Button 
            className="bg-accent hover:bg-accent/90 text-accent-foreground" 
            size="sm"
            data-testid="button-publish"
          >
            <Rocket className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>
    </header>
  );
}
