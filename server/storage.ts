import { type Project, type InsertProject, type Template, type InsertTemplate, type Asset, type InsertAsset } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Projects
  getProject(id: string): Promise<Project | undefined>;
  getProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;

  // Templates
  getTemplate(id: string): Promise<Template | undefined>;
  getTemplates(category?: string): Promise<Template[]>;
  createTemplate(template: InsertTemplate): Promise<Template>;

  // Assets
  getAsset(id: string): Promise<Asset | undefined>;
  getAssets(): Promise<Asset[]>;
  createAsset(asset: InsertAsset): Promise<Asset>;
  deleteAsset(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private projects: Map<string, Project>;
  private templates: Map<string, Template>;
  private assets: Map<string, Asset>;

  constructor() {
    this.projects = new Map();
    this.templates = new Map();
    this.assets = new Map();

    // Initialize with sample templates
    this.initializeTemplates();
  }

  private initializeTemplates() {
    const sampleTemplates: InsertTemplate[] = [
      {
        name: "SaaS Landing Page",
        description: "Modern design for software companies",
        category: "Landing Page",
        previewImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        elements: [
          {
            id: "hero-1",
            type: "section",
            content: { backgroundColor: "linear-gradient(to right, #2563eb, #7c3aed)" },
            styles: { padding: "4rem 1rem" },
            settings: {},
            children: ["hero-heading", "hero-text", "hero-button"],
            order: 0
          },
          {
            id: "hero-heading",
            type: "heading",
            content: { text: "Build Amazing SaaS Products", tag: "h1" },
            styles: { 
              fontSize: "3rem", 
              fontWeight: "700", 
              color: "#ffffff", 
              textAlign: "center",
              marginBottom: "1.5rem"
            },
            settings: {},
            children: [],
            parentId: "hero-1",
            order: 0
          },
          {
            id: "hero-text",
            type: "text",
            content: { text: "Create stunning landing pages with our intuitive drag-and-drop builder. No coding required." },
            styles: { 
              fontSize: "1.25rem", 
              color: "#e2e8f0", 
              textAlign: "center",
              marginBottom: "2rem",
              maxWidth: "48rem",
              marginLeft: "auto",
              marginRight: "auto"
            },
            settings: {},
            children: [],
            parentId: "hero-1",
            order: 1
          },
          {
            id: "hero-button",
            type: "button",
            content: { text: "Start Free Trial", link: "#" },
            styles: { 
              backgroundColor: "#ffffff",
              color: "#2563eb",
              padding: "0.75rem 2rem",
              borderRadius: "0.5rem",
              fontWeight: "600",
              display: "inline-block",
              textDecoration: "none"
            },
            settings: {},
            children: [],
            parentId: "hero-1",
            order: 2
          }
        ],
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
        isPremium: false
      },
      {
        name: "Corporate Business",
        description: "Professional layout for enterprises",
        category: "Business",
        previewImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        elements: [
          {
            id: "corp-hero",
            type: "section",
            content: { backgroundColor: "#f8fafc" },
            styles: { padding: "4rem 1rem" },
            settings: {},
            children: ["corp-heading", "corp-text"],
            order: 0
          },
          {
            id: "corp-heading",
            type: "heading",
            content: { text: "Leading Business Solutions", tag: "h1" },
            styles: { 
              fontSize: "2.5rem", 
              fontWeight: "600", 
              color: "#0f172a", 
              textAlign: "center",
              marginBottom: "1rem"
            },
            settings: {},
            children: [],
            parentId: "corp-hero",
            order: 0
          },
          {
            id: "corp-text",
            type: "text",
            content: { text: "We help businesses achieve their goals with innovative solutions and expert guidance." },
            styles: { 
              fontSize: "1.125rem", 
              color: "#475569", 
              textAlign: "center",
              maxWidth: "42rem",
              marginLeft: "auto",
              marginRight: "auto"
            },
            settings: {},
            children: [],
            parentId: "corp-hero",
            order: 1
          }
        ],
        globalStyles: {
          colors: {
            primary: "#0f172a",
            secondary: "#475569",
            accent: "#2563eb",
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
        isPremium: false
      }
    ];

    sampleTemplates.forEach(template => {
      const id = randomUUID();
      this.templates.set(id, { 
        ...template, 
        id, 
        createdAt: new Date(), 
        description: template.description || null,
        elements: template.elements || [],
        globalStyles: template.globalStyles || {},
        previewImage: template.previewImage || null,
        isPremium: template.isPremium || false
      });
    });
  }

  // Projects
  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const now = new Date();
    const project: Project = { 
      ...insertProject, 
      id, 
      createdAt: now,
      updatedAt: now,
      description: insertProject.description || null,
      elements: insertProject.elements || [],
      globalStyles: insertProject.globalStyles || {},
      settings: insertProject.settings || {}
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updateData: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject: Project = { 
      ...project, 
      ...updateData, 
      updatedAt: new Date() 
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Templates
  async getTemplate(id: string): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async getTemplates(category?: string): Promise<Template[]> {
    const templates = Array.from(this.templates.values());
    if (category) {
      return templates.filter(t => t.category === category);
    }
    return templates;
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = randomUUID();
    const template: Template = { 
      ...insertTemplate, 
      id, 
      createdAt: new Date(),
      description: insertTemplate.description || null,
      elements: insertTemplate.elements || [],
      globalStyles: insertTemplate.globalStyles || {},
      previewImage: insertTemplate.previewImage || null,
      isPremium: insertTemplate.isPremium || false
    };
    this.templates.set(id, template);
    return template;
  }

  // Assets
  async getAsset(id: string): Promise<Asset | undefined> {
    return this.assets.get(id);
  }

  async getAssets(): Promise<Asset[]> {
    return Array.from(this.assets.values());
  }

  async createAsset(insertAsset: InsertAsset): Promise<Asset> {
    const id = randomUUID();
    const asset: Asset = { 
      ...insertAsset, 
      id, 
      createdAt: new Date() 
    };
    this.assets.set(id, asset);
    return asset;
  }

  async deleteAsset(id: string): Promise<boolean> {
    return this.assets.delete(id);
  }
}

export const storage = new MemStorage();
