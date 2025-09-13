# Overview

This is a full-stack landing page builder application built with React, Express, and PostgreSQL. The application allows users to create, edit, and publish custom landing pages using a drag-and-drop visual editor. Users can work with pre-built templates, customize elements with visual properties, and export their creations as standalone HTML files.

The system provides a comprehensive page builder experience with real-time editing, template library, asset management, and professional export capabilities for creating modern landing pages without coding knowledge.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **Styling**: Tailwind CSS with shadcn/ui components for consistent, modern UI design
- **State Management**: Zustand stores for editor state, template management, and UI state
- **Drag & Drop**: React DND for intuitive element placement and rearrangement
- **Routing**: Wouter for lightweight client-side routing
- **Data Fetching**: TanStack Query for server state management and caching

## Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Database ORM**: Drizzle ORM with PostgreSQL for type-safe database operations
- **File Uploads**: Multer for handling asset uploads with local file storage
- **Development**: Vite integration for hot module replacement in development mode
- **API Design**: RESTful endpoints for projects, templates, and assets management

## Database Design
The application uses three main entities:
- **Projects**: Store user-created landing pages with elements, styles, and settings as JSONB
- **Templates**: Pre-built page templates with elements and global styles for quick starts
- **Assets**: Uploaded images and files with metadata and URL references
- **Database Provider**: Neon serverless PostgreSQL for scalable cloud database hosting

## Page Builder System
- **Element-Based Architecture**: Modular components (text, images, buttons, sections) with customizable properties
- **Visual Editor**: Real-time preview with click-to-select editing and property panels
- **Style Management**: Global styles (colors, fonts, spacing) combined with element-specific styling
- **Template System**: Categorized templates with preview images and premium options
- **Export Functionality**: Generate standalone HTML/CSS files with responsive design and SEO optimization

## Development Environment
- **Build Tool**: Vite with React plugin for fast development and optimized production builds
- **TypeScript**: Full type safety across client, server, and shared schemas
- **Path Aliases**: Organized imports with @ for client code and @shared for common types
- **Development Features**: Error overlay, dev banner, and cartographer for enhanced debugging

# External Dependencies

## Database & Hosting
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle Kit**: Database migrations and schema management tools

## UI & Styling
- **Radix UI**: Accessible component primitives for consistent user interface
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **shadcn/ui**: Pre-built component library built on Radix UI and Tailwind

## Development & Build Tools
- **Vite**: Fast build tool with hot module replacement and optimized bundling
- **TypeScript**: Static type checking and enhanced development experience
- **ESBuild**: Fast JavaScript bundler for server-side code compilation

## File Handling & Assets
- **Multer**: File upload middleware for handling images and media assets
- **Local File Storage**: Server-side file storage for uploaded assets

## State & Data Management
- **TanStack Query**: Server state synchronization with caching and background updates
- **Zustand**: Lightweight state management for client-side application state
- **React Hook Form**: Form handling with validation and error management

## Drag & Drop Interface
- **React DND**: Drag and drop functionality for the visual page builder
- **HTML5 Backend**: Browser-native drag and drop implementation