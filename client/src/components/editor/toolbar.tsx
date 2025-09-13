import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEditorStore } from "@/store/editor";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";
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
  const { t } = useTranslation();

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
        title: t('message.projectSaved'),
        description: t('message.projectSaved'),
      });
    },
    onError: () => {
      toast({
        title: "Error", 
        description: t('error.saveProject'),
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
        title: t('message.exportSuccess'),
        description: t('message.exportSuccess'),
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: t('error.exportProject'),
        variant: "destructive",
      });
    },
  });

  return (
    <header className="bg-card border-b border-border h-16 flex items-center justify-between px-4 shadow-sm">
      <div className="flex items-center space-x-4">
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-all hover:scale-105">
          <div className="w-8 h-8 bg-[hsl(var(--primary))] rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all">
            <Box className="w-4 h-4 text-[hsl(var(--primary-foreground))]" />
          </div>
          <h1 className="text-lg font-semibold text-[hsl(var(--foreground))]">{t('app.title')}</h1>
        </Link>
        
        <div className="flex items-center space-x-2 ml-8">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => setTemplateLibraryOpen(true)}
            className="ring-1 ring-[hsl(var(--primary))/0.1] hover:ring-2 hover:ring-[hsl(var(--primary))/0.2] hover:bg-[hsl(var(--primary))/0.05]"
            data-testid="button-new-page"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('editor.toolbar.newPage')}
          </Button>
          <Button 
            size="sm" 
            onClick={() => saveProjectMutation.mutate()}
            disabled={saveProjectMutation.isPending}
            className="shadow-sm hover:shadow-md"
            data-testid="button-save"
          >
            <Save className="w-4 h-4 mr-2" />
            {saveProjectMutation.isPending ? t('editor.toolbar.saving') : t('editor.toolbar.save')}
          </Button>
        </div>
      </div>
      
      {/* Device Preview Controls */}
      <div className="flex items-center space-x-2 bg-[hsl(var(--muted))] rounded-lg p-1 ring-1 ring-[hsl(var(--primary))/0.1]">
        <Button
          variant={deviceView === "desktop" ? "default" : "ghost"}
          size="sm"
          onClick={() => setDeviceView("desktop")}
          className={deviceView === "desktop" ? "shadow-sm" : "hover:bg-[hsl(var(--primary))/0.06]"}
          data-testid="button-desktop-view"
        >
          <Monitor className="w-4 h-4 mr-1" />
          {t('editor.toolbar.desktop')}
        </Button>
        <Button
          variant={deviceView === "tablet" ? "default" : "ghost"}
          size="sm" 
          onClick={() => setDeviceView("tablet")}
          className={deviceView === "tablet" ? "shadow-sm" : "hover:bg-[hsl(var(--primary))/0.06]"}
          data-testid="button-tablet-view"
        >
          <Tablet className="w-4 h-4 mr-1" />
          {t('editor.toolbar.tablet')}
        </Button>
        <Button
          variant={deviceView === "mobile" ? "default" : "ghost"}
          size="sm"
          onClick={() => setDeviceView("mobile")}
          className={deviceView === "mobile" ? "shadow-sm" : "hover:bg-[hsl(var(--primary))/0.06]"}
          data-testid="button-mobile-view"
        >
          <Smartphone className="w-4 h-4 mr-1" />
          {t('editor.toolbar.mobile')}
        </Button>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Version Control */}
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-[hsl(var(--cat-content))] text-white px-2 py-1 rounded-full font-medium shadow-sm">
            v1.0
          </span>
          <Button 
            variant="ghost" 
            size="sm"
            disabled={!canUndo}
            onClick={undo}
            className="hover:bg-[hsl(var(--primary))/0.1] disabled:opacity-50"
            data-testid="button-undo"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            disabled={!canRedo}
            onClick={redo}
            className="hover:bg-[hsl(var(--primary))/0.1] disabled:opacity-50"
            data-testid="button-redo"
          >
            <Redo className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="hover:bg-[hsl(var(--primary))/0.1]"
            data-testid="button-history"
          >
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
            className="ring-1 ring-[hsl(var(--primary))/0.2] hover:ring-2 hover:ring-[hsl(var(--primary))/0.3] hover:bg-[hsl(var(--primary))/0.05] shadow-sm"
            data-testid="button-export"
          >
            <Download className="w-4 h-4 mr-2" />
            {exportMutation.isPending ? t('editor.toolbar.exporting') : t('editor.toolbar.export')}
          </Button>
          <Button 
            className="bg-[hsl(var(--cat-forms))] hover:bg-[hsl(var(--cat-forms))/0.9] text-white shadow-md hover:shadow-lg transition-all" 
            size="sm"
            data-testid="button-publish"
          >
            <Rocket className="w-4 h-4 mr-2" />
            {t('editor.toolbar.publish')}
          </Button>
        </div>
      </div>
    </header>
  );
}
