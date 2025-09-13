import { create } from 'zustand';
import type { Element, GlobalStyles, Project } from '@shared/schema';

interface EditorState {
  // Current project
  currentProject: Project | null;
  
  // Page elements
  elements: Element[];
  selectedElement: string | null;
  
  // Global styles
  globalStyles: GlobalStyles;
  
  // Editor UI state
  deviceView: 'desktop' | 'tablet' | 'mobile';
  zoomLevel: number;
  isTemplateLibraryOpen: boolean;
  
  // History for undo/redo
  history: Element[][];
  historyIndex: number;
  
  // Actions
  setCurrentProject: (project: Project | null) => void;
  setElements: (elements: Element[]) => void;
  addElement: (element: Element) => void;
  updateElement: (id: string, updates: Partial<Element>) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  setSelectedElement: (id: string | null) => void;
  setGlobalStyles: (styles: GlobalStyles) => void;
  updateGlobalStyles: (styles: GlobalStyles) => void;
  setDeviceView: (view: 'desktop' | 'tablet' | 'mobile') => void;
  setZoomLevel: (level: number) => void;
  setTemplateLibraryOpen: (open: boolean) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  saveToHistory: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  // Initial state
  currentProject: null,
  elements: [],
  selectedElement: null,
  globalStyles: {
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#7c3aed',
      background: '#ffffff',
      foreground: '#0f172a',
    },
    fonts: {
      primary: 'Inter',
      secondary: 'Georgia',
      mono: 'Menlo',
    },
    spacing: {
      scale: 1,
      unit: 'rem',
    },
  },
  deviceView: 'desktop',
  zoomLevel: 100,
  isTemplateLibraryOpen: false,
  history: [],
  historyIndex: -1,
  canUndo: false,
  canRedo: false,

  // Actions
  setCurrentProject: (project) => set({ currentProject: project }),

  setElements: (elements) => {
    set({ elements });
    get().saveToHistory();
  },

  addElement: (element) => {
    const { elements } = get();
    const newElements = [...elements, element];
    set({ elements: newElements, selectedElement: element.id });
    get().saveToHistory();
  },

  updateElement: (id, updates) => {
    const { elements } = get();
    const newElements = elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    );
    set({ elements: newElements });
    get().saveToHistory();
  },

  deleteElement: (id) => {
    const { elements, selectedElement } = get();
    const newElements = elements.filter(el => el.id !== id);
    const newSelectedElement = selectedElement === id ? null : selectedElement;
    set({ 
      elements: newElements, 
      selectedElement: newSelectedElement 
    });
    get().saveToHistory();
  },

  duplicateElement: (id) => {
    const { elements } = get();
    const element = elements.find(el => el.id === id);
    if (!element) return;

    const newElement: Element = {
      ...element,
      id: `${element.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    const newElements = [...elements, newElement];
    set({ elements: newElements, selectedElement: newElement.id });
    get().saveToHistory();
  },

  setSelectedElement: (id) => set({ selectedElement: id }),

  setGlobalStyles: (styles) => set({ globalStyles: styles }),

  updateGlobalStyles: (styles) => set({ globalStyles: styles }),

  setDeviceView: (view) => set({ deviceView: view }),

  setZoomLevel: (level) => set({ zoomLevel: level }),

  setTemplateLibraryOpen: (open) => set({ isTemplateLibraryOpen: open }),

  saveToHistory: () => {
    const { elements, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...elements]);
    
    // Limit history size
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    set({ 
      history: newHistory, 
      historyIndex: newHistory.length - 1,
      canUndo: newHistory.length > 1,
      canRedo: false
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const elements = [...history[newIndex]];
      set({ 
        elements, 
        historyIndex: newIndex,
        canUndo: newIndex > 0,
        canRedo: true,
        selectedElement: null
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const elements = [...history[newIndex]];
      set({ 
        elements, 
        historyIndex: newIndex,
        canUndo: true,
        canRedo: newIndex < history.length - 1,
        selectedElement: null
      });
    }
  },
}));
