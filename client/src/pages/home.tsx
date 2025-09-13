import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Plus, FileText, Calendar, ExternalLink, Trash2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import type { Project } from "@shared/schema";

export default function Home() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: ""
  });
  const { toast } = useToast();
  const { t } = useTranslation();

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const createProjectMutation = useMutation({
    mutationFn: async (projectData: typeof newProject) => {
      const response = await apiRequest("POST", "/api/projects", {
        ...projectData,
        elements: [],
        globalStyles: {
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
        },
        settings: {
          responsive: {
            breakpoints: {
              mobile: 768,
              tablet: 1024,
              desktop: 1200
            }
          },
          seo: {
            title: "",
            description: "",
            keywords: ""
          }
        }
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setIsCreateModalOpen(false);
      setNewProject({ name: "", description: "" });
      toast({
        title: t('message.projectCreated'),
        description: t('message.projectCreated'),
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: t('error.createProject'),
        variant: "destructive",
      });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: string) => {
      await apiRequest("DELETE", `/api/projects/${projectId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: t('message.projectDeleted'),
        description: t('message.projectDeleted'),
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: t('error.deleteProject'),
        variant: "destructive",
      });
    },
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;
    createProjectMutation.mutate(newProject);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <header className="border-b border-border/40 bg-card/80 backdrop-blur-md supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">{t('app.title')}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg hover:shadow-xl transition-all duration-200" data-testid="button-create-project">
                    <Plus className="w-4 h-4 mr-2" />
                    {t('home.createProject')}
                  </Button>
                </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('project.create.title')}</DialogTitle>
                  <DialogDescription>
                    {t('project.create.description')}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateProject} className="space-y-4">
                  <div>
                    <Label htmlFor="name">{t('project.create.nameLabel')}</Label>
                    <Input
                      id="name"
                      data-testid="input-project-name"
                      value={newProject.name}
                      onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                      placeholder={t('project.create.namePlaceholder')}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">{t('project.create.descriptionLabel')}</Label>
                    <Textarea
                      id="description"
                      data-testid="input-project-description"
                      value={newProject.description}
                      onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                      placeholder={t('project.create.descriptionPlaceholder')}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                      {t('project.create.cancel')}
                    </Button>
                    <Button 
                      type="submit" 
                      data-testid="button-create-submit"
                      disabled={createProjectMutation.isPending}
                    >
                      {createProjectMutation.isPending ? t('project.create.creating') : t('project.create.submit')}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent mb-4">{t('home.title')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('home.subtitle')}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse border-border/30 bg-card/30">
                <CardHeader className="pb-3">
                  <div className="h-5 bg-gradient-to-r from-muted to-muted/50 rounded-lg w-3/4 mb-3"></div>
                  <div className="h-3 bg-gradient-to-r from-muted to-muted/50 rounded w-1/2"></div>
                </CardHeader>
                <CardContent className="pt-3">
                  <div className="h-4 bg-gradient-to-r from-muted to-muted/50 rounded mb-6 w-20"></div>
                  <div className="h-10 bg-gradient-to-r from-muted to-muted/50 rounded-lg"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span data-testid={`text-project-name-${project.id}`} className="group-hover:text-primary transition-colors">{project.name}</span>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/editor/${project.id}`}>
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary" data-testid={`button-edit-${project.id}`}>
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover:bg-destructive/10 hover:text-destructive"
                        data-testid={`button-delete-${project.id}`}
                        onClick={() => deleteProjectMutation.mutate(project.id)}
                        disabled={deleteProjectMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                  {project.description && (
                    <CardDescription data-testid={`text-project-description-${project.id}`}>
                      {project.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="pt-3">
                  <div className="flex items-center text-sm text-muted-foreground mb-6">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span data-testid={`text-project-date-${project.id}`}>
                      {project.updatedAt || project.createdAt 
                        ? new Date(project.updatedAt || project.createdAt!).toLocaleDateString()
                        : t('project.noDate')
                      }
                    </span>
                  </div>
                  <Link href={`/editor/${project.id}`}>
                    <Button className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-md hover:shadow-lg transition-all duration-200" data-testid={`button-open-${project.id}`}>
                      {t('project.open')}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-muted to-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FileText className="w-16 h-16 text-muted-foreground/70" />
            </div>
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-3">{t('home.noProjects.title')}</h3>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto text-lg leading-relaxed">
              {t('home.noProjects.description')}
            </p>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-3" data-testid="button-create-first-project">
                  <Plus className="w-5 h-5 mr-2" />
                  {t('home.createFirstProject')}
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        )}
      </main>
    </div>
  );
}
