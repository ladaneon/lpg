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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">{t('app.title')}</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <LanguageSwitcher />
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-create-project">
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

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">{t('home.title')}</h2>
          <p className="text-muted-foreground">
            {t('home.subtitle')}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-muted rounded mb-4"></div>
                  <div className="h-8 bg-muted rounded w-24"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span data-testid={`text-project-name-${project.id}`}>{project.name}</span>
                    <div className="flex items-center space-x-1">
                      <Link href={`/editor/${project.id}`}>
                        <Button variant="ghost" size="sm" data-testid={`button-edit-${project.id}`}>
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        data-testid={`button-delete-${project.id}`}
                        onClick={() => deleteProjectMutation.mutate(project.id)}
                        disabled={deleteProjectMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </CardTitle>
                  {project.description && (
                    <CardDescription data-testid={`text-project-description-${project.id}`}>
                      {project.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span data-testid={`text-project-date-${project.id}`}>
                      {project.updatedAt || project.createdAt 
                        ? new Date(project.updatedAt || project.createdAt!).toLocaleDateString()
                        : t('project.noDate')
                      }
                    </span>
                  </div>
                  <Link href={`/editor/${project.id}`}>
                    <Button className="w-full" data-testid={`button-open-${project.id}`}>
                      {t('project.open')}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">{t('home.noProjects.title')}</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {t('home.noProjects.description')}
            </p>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button size="lg" data-testid="button-create-first-project">
                  <Plus className="w-4 h-4 mr-2" />
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
