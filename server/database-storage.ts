import { db } from "./db";
import { projects, templates, assets } from "@shared/schema";
import type { Project, Template, Asset, InsertProject, InsertTemplate, InsertAsset } from "@shared/schema";
import type { IStorage } from "./storage";
import { eq } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  private templatesInitialized = false;

  constructor() {
    // Initialize templates asynchronously to prevent blocking app startup
    this.ensureTemplatesInitialized().catch(error => {
      console.error("Template initialization failed, continuing without pre-loaded templates:", error.message);
    });
  }

  private async ensureTemplatesInitialized() {
    if (this.templatesInitialized) return;
    
    await this.initializeTemplates();
    this.templatesInitialized = true;
  }

  private async initializeTemplates() {
    try {
      const existingTemplates = await db.select().from(templates).limit(1);
      
      if (existingTemplates.length === 0) {
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

        await db.insert(templates).values(sampleTemplates);
      }
    } catch (error) {
      console.error("Failed to initialize templates:", error);
    }
  }

  // Projects
  async getProject(id: string): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(eq(projects.id, id));
    return result[0];
  }

  async getProjects(): Promise<Project[]> {
    try {
      return await db.select().from(projects).orderBy(projects.createdAt);
    } catch (error) {
      console.error("Error getting projects:", error);
      // Fallback without ordering if orderBy fails
      return await db.select().from(projects);
    }
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const result = await db.insert(projects).values(insertProject).returning();
    
    if (result && result.length > 0) {
      return result[0];
    }
    
    // Fallback: get the last created project by name
    const fallbackResult = await db.select().from(projects)
      .where(eq(projects.name, insertProject.name))
      .orderBy(projects.createdAt)
      .limit(1);
    
    if (fallbackResult.length === 0) {
      throw new Error("Failed to create project");
    }
    
    return fallbackResult[0];
  }

  async updateProject(id: string, updateData: Partial<InsertProject>): Promise<Project | undefined> {
    const { sql } = await import("drizzle-orm");
    const result = await db.update(projects)
      .set({ ...updateData, updatedAt: sql`now()` })
      .where(eq(projects.id, id))
      .returning();
    return result[0];
  }

  async deleteProject(id: string): Promise<boolean> {
    try {
      // First, check if project exists
      const existingProject = await db.select().from(projects).where(eq(projects.id, id));
      
      if (existingProject.length === 0) {
        return false;
      }
      
      // Delete without returning() - just execute the delete
      await db.delete(projects).where(eq(projects.id, id));
      
      return true;
    } catch (error) {
      console.error("Error in deleteProject:", error);
      return false;
    }
  }

  // Templates
  async getTemplate(id: string): Promise<Template | undefined> {
    const result = await db.select().from(templates).where(eq(templates.id, id));
    return result[0];
  }

  async getTemplates(category?: string): Promise<Template[]> {
    await this.ensureTemplatesInitialized();
    
    if (category) {
      return await db.select().from(templates).where(eq(templates.category, category));
    }
    return await db.select().from(templates).orderBy(templates.createdAt);
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const result = await db.insert(templates).values(insertTemplate).returning();
    return result[0];
  }

  // Assets
  async getAsset(id: string): Promise<Asset | undefined> {
    const result = await db.select().from(assets).where(eq(assets.id, id));
    return result[0];
  }

  async getAssets(): Promise<Asset[]> {
    return await db.select().from(assets).orderBy(assets.createdAt);
  }

  async createAsset(insertAsset: InsertAsset): Promise<Asset> {
    const result = await db.insert(assets).values(insertAsset).returning();
    return result[0];
  }

  async deleteAsset(id: string): Promise<boolean> {
    const result = await db.delete(assets).where(eq(assets.id, id)).returning();
    return result.length > 0;
  }
}