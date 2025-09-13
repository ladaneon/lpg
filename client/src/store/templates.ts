import { create } from 'zustand';
import type { Template } from '@shared/schema';

interface TemplateState {
  templates: Template[];
  selectedCategory: string;
  searchQuery: string;
  isLoading: boolean;
  
  // Actions
  setTemplates: (templates: Template[]) => void;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setIsLoading: (loading: boolean) => void;
  getFilteredTemplates: () => Template[];
  getTemplateCategories: () => string[];
}

export const useTemplateStore = create<TemplateState>((set, get) => ({
  // Initial state
  templates: [],
  selectedCategory: 'all',
  searchQuery: '',
  isLoading: false,

  // Actions
  setTemplates: (templates) => set({ templates }),
  
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setIsLoading: (loading) => set({ isLoading: loading }),

  getFilteredTemplates: () => {
    const { templates, selectedCategory, searchQuery } = get();
    
    return templates.filter(template => {
      const matchesSearch = searchQuery === '' || 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (template.description && template.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  },

  getTemplateCategories: () => {
    const { templates } = get();
    const categories = Array.from(new Set(templates.map(t => t.category)));
    return ['all', ...categories.sort()];
  },
}));
