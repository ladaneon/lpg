import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema, insertTemplateSchema, insertAssetSchema } from "@shared/schema";
import multer from "multer";
import path from "path";

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Projects routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to get projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to get project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const projectData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(req.params.id, projectData);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProject(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Templates routes
  app.get("/api/templates", async (req, res) => {
    try {
      const category = req.query.category as string;
      const templates = await storage.getTemplates(category);
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to get templates" });
    }
  });

  app.get("/api/templates/:id", async (req, res) => {
    try {
      const template = await storage.getTemplate(req.params.id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: "Failed to get template" });
    }
  });

  app.post("/api/templates", async (req, res) => {
    try {
      const templateData = insertTemplateSchema.parse(req.body);
      const template = await storage.createTemplate(templateData);
      res.status(201).json(template);
    } catch (error) {
      res.status(400).json({ message: "Invalid template data" });
    }
  });

  // Assets routes
  app.get("/api/assets", async (req, res) => {
    try {
      const assets = await storage.getAssets();
      res.json(assets);
    } catch (error) {
      res.status(500).json({ message: "Failed to get assets" });
    }
  });

  app.post("/api/assets", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const assetData = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size.toString(),
        url: `/uploads/${req.file.filename}`
      };

      const asset = await storage.createAsset(assetData);
      res.status(201).json(asset);
    } catch (error) {
      res.status(400).json({ message: "Failed to upload file" });
    }
  });

  app.delete("/api/assets/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteAsset(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Asset not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete asset" });
    }
  });

  // Export project as HTML
  app.post("/api/projects/:id/export", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Generate HTML from project data
      const html = generateHTML(project);
      
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${project.name}.html"`);
      res.send(html);
    } catch (error) {
      res.status(500).json({ message: "Failed to export project" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function generateHTML(project: any): string {
  // Basic HTML generation - this would be expanded to render all elements
  const { elements, globalStyles } = project;
  
  let elementsHTML = '';
  if (Array.isArray(elements)) {
    elements.forEach((element: any) => {
      elementsHTML += generateElementHTML(element);
    });
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.name}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: ${globalStyles?.fonts?.primary || 'Inter'}, sans-serif; }
        ${generateGlobalCSS(globalStyles)}
    </style>
</head>
<body>
    ${elementsHTML}
</body>
</html>`;
}

function generateElementHTML(element: any): string {
  const { type, content, styles, children } = element;
  
  const styleString = Object.entries(styles || {})
    .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
    .join('; ');

  switch (type) {
    case 'heading':
      const tag = content?.tag || 'h1';
      return `<${tag} style="${styleString}">${content?.text || ''}</${tag}>`;
    
    case 'text':
      return `<p style="${styleString}">${content?.text || ''}</p>`;
    
    case 'button':
      return `<a href="${content?.link || '#'}" style="${styleString}">${content?.text || 'Button'}</a>`;
    
    case 'image':
      return `<img src="${content?.src || ''}" alt="${content?.alt || ''}" style="${styleString}">`;
    
    case 'section':
      let childrenHTML = '';
      if (children && Array.isArray(children)) {
        // In a real implementation, you'd recursively render children
        childrenHTML = children.map((childId: string) => `<!-- Child: ${childId} -->`).join('');
      }
      return `<section style="${styleString}">${childrenHTML}</section>`;
    
    default:
      return `<div style="${styleString}">${content?.text || ''}</div>`;
  }
}

function generateGlobalCSS(globalStyles: any): string {
  if (!globalStyles) return '';
  
  const { colors, fonts } = globalStyles;
  
  return `
    :root {
      --primary: ${colors?.primary || '#2563eb'};
      --secondary: ${colors?.secondary || '#64748b'};
      --accent: ${colors?.accent || '#7c3aed'};
      --background: ${colors?.background || '#ffffff'};
      --foreground: ${colors?.foreground || '#0f172a'};
    }
  `;
}
