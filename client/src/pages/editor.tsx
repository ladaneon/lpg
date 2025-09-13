import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import Toolbar from "@/components/editor/toolbar";
import ModulesSidebar from "@/components/editor/modules-sidebar";
import Canvas from "@/components/editor/canvas";
import PropertiesSidebar from "@/components/editor/properties-sidebar";
import TemplateLibrary from "@/components/editor/template-library";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useEditorStore } from "@/store/editor";
import { useTranslation } from "@/lib/i18n";
import { useEffect } from "react";
import type { Project } from "@shared/schema";

export default function Editor() {
  const { id } = useParams<{ id?: string }>();
  const { t } = useTranslation();
  const { 
    setCurrentProject, 
    setElements, 
    setGlobalStyles, 
    setSelectedElement,
    isTemplateLibraryOpen 
  } = useEditorStore();

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["/api/projects", id],
    enabled: !!id,
  });

  useEffect(() => {
    if (project) {
      setCurrentProject(project);
      setElements(Array.isArray(project.elements) ? project.elements : []);
      setGlobalStyles(project.globalStyles && typeof project.globalStyles === 'object' ? project.globalStyles as any : {
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
      setSelectedElement(null);
    }
  }, [project, setCurrentProject, setElements, setGlobalStyles, setSelectedElement]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-muted border-t-primary mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-transparent animate-pulse"></div>
          </div>
          <p className="text-lg text-muted-foreground">{t('loading.project')}</p>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
        <Toolbar />
        
        <div className="flex-1 flex overflow-hidden gap-1">
          <ModulesSidebar />
          <div className="flex-1 bg-card/30 border border-border/50 rounded-lg shadow-lg backdrop-blur-sm">
            <Canvas />
          </div>
          <PropertiesSidebar />
        </div>

        {isTemplateLibraryOpen && <TemplateLibrary />}
      </div>
    </DndProvider>
  );
}
