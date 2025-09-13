import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Locale = 'en' | 'ru';

interface TranslationState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

// Translation dictionaries
const translations = {
  en: {
    // Header & Navigation
    'app.title': 'PageBuilder Pro',
    'nav.home': 'Home',
    'nav.projects': 'Projects',
    
    // Home Page
    'home.title': 'Your Projects',
    'home.subtitle': 'Create stunning landing pages with our drag-and-drop editor',
    'home.noProjects.title': 'No projects yet',
    'home.noProjects.description': 'Get started by creating your first landing page project. Use our drag-and-drop editor to build amazing pages in minutes.',
    'home.createProject': 'New Project',
    'home.createFirstProject': 'Create Your First Project',
    
    // Project Creation
    'project.create.title': 'Create New Project',
    'project.create.description': 'Start building your landing page with a new project.',
    'project.create.nameLabel': 'Project Name',
    'project.create.namePlaceholder': 'My Landing Page',
    'project.create.descriptionLabel': 'Description (Optional)',
    'project.create.descriptionPlaceholder': 'Brief description of your project...',
    'project.create.cancel': 'Cancel',
    'project.create.submit': 'Create Project',
    'project.create.creating': 'Creating...',
    'project.open': 'Open Project',
    'project.noDate': 'No date available',
    
    // Editor Interface
    'editor.toolbar.newPage': 'New Page',
    'editor.toolbar.save': 'Save',
    'editor.toolbar.saving': 'Saving...',
    'editor.toolbar.export': 'Export HTML',
    'editor.toolbar.exporting': 'Exporting...',
    'editor.toolbar.publish': 'Publish',
    'editor.toolbar.desktop': 'Desktop',
    'editor.toolbar.tablet': 'Tablet',
    'editor.toolbar.mobile': 'Mobile',
    'editor.toolbar.undo': 'Undo',
    'editor.toolbar.redo': 'Redo',
    'editor.toolbar.history': 'History',
    'editor.toolbar.zoom': 'Zoom',
    
    // Elements Sidebar
    'elements.title': 'Elements',
    'elements.search': 'Search elements...',
    'elements.basic': 'Basic Elements',
    'elements.advanced': 'Advanced',
    'elements.forms': 'Forms & Interactive',
    'elements.layout': 'Layout',
    'elements.templateLibrary': 'Template Library',
    
    // Element Types
    'element.text': 'Text',
    'element.heading': 'Heading',
    'element.image': 'Image',
    'element.button': 'Button',
    'element.video': 'Video',
    'element.spacer': 'Spacer',
    'element.gallery': 'Gallery',
    'element.slider': 'Slider',
    'element.testimonial': 'Testimonial',
    'element.pricing': 'Pricing',
    'element.accordion': 'Accordion',
    'element.tabs': 'Tabs',
    'element.contactForm': 'Contact Form',
    'element.newsletter': 'Newsletter',
    'element.map': 'Map',
    'element.social': 'Social Icons',
    'element.section': 'Section',
    'element.row': 'Row',
    'element.column': 'Column',
    
    // Properties Sidebar
    'properties.title': 'Properties',
    'properties.noSelection': 'No element selected',
    'properties.content': 'Content',
    'properties.design': 'Design',
    'properties.advanced': 'Advanced',
    'properties.global': 'Global',
    
    // Content Properties
    'content.text': 'Text Content',
    'content.headingText': 'Heading Text',
    'content.headingTag': 'Heading Tag',
    'content.buttonText': 'Button Text',
    'content.buttonLink': 'Link URL',
    'content.imageUrl': 'Image URL',
    'content.imageAlt': 'Alt Text',
    
    // Design Properties
    'design.fontFamily': 'Font Family',
    'design.fontSize': 'Font Size (px)',
    'design.fontWeight': 'Font Weight',
    'design.textColor': 'Text Color',
    'design.backgroundColor': 'Background Color',
    'design.textAlign': 'Text Alignment',
    'design.padding': 'Padding (px)',
    'design.margin': 'Margin (px)',
    
    // Font Weights
    'font.light': 'Light',
    'font.regular': 'Regular',
    'font.medium': 'Medium',
    'font.semibold': 'Semibold',
    'font.bold': 'Bold',
    
    // Global Styles
    'global.colors': 'Global Colors',
    'global.fonts': 'Global Fonts',
    'global.primary': 'Primary',
    'global.secondary': 'Secondary',
    'global.accent': 'Accent',
    'global.background': 'Background',
    'global.foreground': 'Foreground',
    'global.mono': 'Mono',
    
    // Template Library
    'templates.title': 'Template Library',
    'templates.description': 'Choose from professionally designed templates to get started quickly',
    'templates.search': 'Search templates...',
    'templates.all': 'All Templates',
    'templates.landingPage': 'Landing Page',
    'templates.business': 'Business',
    'templates.portfolio': 'Portfolio',
    'templates.ecommerce': 'E-commerce',
    'templates.blog': 'Blog',
    'templates.use': 'Use Template',
    'templates.applying': 'Applying...',
    'templates.noResults': 'No templates found matching "{query}"',
    'templates.noCategory': 'No templates available in {category}',
    
    // Canvas
    'canvas.dropElements': 'Drop elements here to add content',
    'canvas.page': 'Page:',
    'canvas.untitled': 'Untitled',
    
    // Actions
    'action.copy': 'Copy',
    'action.paste': 'Paste',
    'action.duplicate': 'Duplicate',
    'action.delete': 'Delete',
    'action.close': 'Close',
    
    // Messages
    'message.projectCreated': 'Your new landing page project has been created successfully.',
    'message.projectSaved': 'Your changes have been saved successfully.',
    'message.exportSuccess': 'Your landing page has been exported as HTML.',
    'message.templateApplied': 'The template has been successfully applied to your project.',
    'message.elementDuplicated': 'A copy of the element has been created.',
    'message.elementDeleted': 'The element has been removed from the page.',
    'message.stylesCopied': 'Element styles have been copied to clipboard.',
    'message.stylesPasted': 'Styles have been applied to the selected element.',
    'message.projectDeleted': 'Project has been deleted successfully.',
    
    // Error Messages
    'error.createProject': 'Failed to create project. Please try again.',
    'error.saveProject': 'Failed to save your project. Please try again.',
    'error.exportProject': 'Failed to export your project. Please try again.',
    'error.applyTemplate': 'Failed to apply template. Please try again.',
    'error.loadProject': 'Loading project...',
    'error.deleteProject': 'Failed to delete project. Please try again.',
    
    // Placeholders
    'placeholder.clickToEdit': 'Click to edit',
    'placeholder.enterEmail': 'Enter your email',
    'placeholder.yourName': 'Your Name',
    'placeholder.yourEmail': 'Your Email',
    'placeholder.yourMessage': 'Your Message',
    'placeholder.addVideo': 'Click to add video URL',
    
    // Loading States
    'loading.projects': 'Loading projects...',
    'loading.templates': 'Loading templates...',
    'loading.project': 'Loading project...',
  },
  ru: {
    // Header & Navigation
    'app.title': 'Генератор Лендингов',
    'nav.home': 'Главная',
    'nav.projects': 'Проекты',
    
    // Home Page
    'home.title': 'Ваши Проекты',
    'home.subtitle': 'Создавайте потрясающие лендинги с помощью нашего визуального редактора',
    'home.noProjects.title': 'Пока нет проектов',
    'home.noProjects.description': 'Начните с создания своего первого проекта лендинга. Используйте наш визуальный редактор для создания потрясающих страниц за считанные минуты.',
    'home.createProject': 'Новый Проект',
    'home.createFirstProject': 'Создать Первый Проект',
    
    // Project Creation
    'project.create.title': 'Создать Новый Проект',
    'project.create.description': 'Начните создание лендинга с нового проекта.',
    'project.create.nameLabel': 'Название Проекта',
    'project.create.namePlaceholder': 'Мой Лендинг',
    'project.create.descriptionLabel': 'Описание (Необязательно)',
    'project.create.descriptionPlaceholder': 'Краткое описание вашего проекта...',
    'project.create.cancel': 'Отмена',
    'project.create.submit': 'Создать Проект',
    'project.create.creating': 'Создание...',
    'project.open': 'Открыть Проект',
    'project.noDate': 'Дата недоступна',
    
    // Editor Interface
    'editor.toolbar.newPage': 'Новая Страница',
    'editor.toolbar.save': 'Сохранить',
    'editor.toolbar.saving': 'Сохранение...',
    'editor.toolbar.export': 'Экспорт HTML',
    'editor.toolbar.exporting': 'Экспорт...',
    'editor.toolbar.publish': 'Опубликовать',
    'editor.toolbar.desktop': 'Десктоп',
    'editor.toolbar.tablet': 'Планшет',
    'editor.toolbar.mobile': 'Мобильный',
    'editor.toolbar.undo': 'Отменить',
    'editor.toolbar.redo': 'Повторить',
    'editor.toolbar.history': 'История',
    'editor.toolbar.zoom': 'Масштаб',
    
    // Elements Sidebar
    'elements.title': 'Элементы',
    'elements.search': 'Поиск элементов...',
    'elements.basic': 'Основные Элементы',
    'elements.advanced': 'Продвинутые',
    'elements.forms': 'Формы и Интерактив',
    'elements.layout': 'Макет',
    'elements.templateLibrary': 'Библиотека Шаблонов',
    
    // Element Types
    'element.text': 'Текст',
    'element.heading': 'Заголовок',
    'element.image': 'Изображение',
    'element.button': 'Кнопка',
    'element.video': 'Видео',
    'element.spacer': 'Разделитель',
    'element.gallery': 'Галерея',
    'element.slider': 'Слайдер',
    'element.testimonial': 'Отзыв',
    'element.pricing': 'Цены',
    'element.accordion': 'Аккордеон',
    'element.tabs': 'Вкладки',
    'element.contactForm': 'Форма Связи',
    'element.newsletter': 'Подписка',
    'element.map': 'Карта',
    'element.social': 'Соц. Сети',
    'element.section': 'Секция',
    'element.row': 'Строка',
    'element.column': 'Колонка',
    
    // Properties Sidebar
    'properties.title': 'Свойства',
    'properties.noSelection': 'Элемент не выбран',
    'properties.content': 'Контент',
    'properties.design': 'Дизайн',
    'properties.advanced': 'Дополнительно',
    'properties.global': 'Глобальные',
    
    // Content Properties
    'content.text': 'Содержимое Текста',
    'content.headingText': 'Текст Заголовка',
    'content.headingTag': 'Тег Заголовка',
    'content.buttonText': 'Текст Кнопки',
    'content.buttonLink': 'URL Ссылки',
    'content.imageUrl': 'URL Изображения',
    'content.imageAlt': 'Alt Текст',
    
    // Design Properties
    'design.fontFamily': 'Семейство Шрифтов',
    'design.fontSize': 'Размер Шрифта (px)',
    'design.fontWeight': 'Насыщенность Шрифта',
    'design.textColor': 'Цвет Текста',
    'design.backgroundColor': 'Цвет Фона',
    'design.textAlign': 'Выравнивание Текста',
    'design.padding': 'Отступы (px)',
    'design.margin': 'Поля (px)',
    
    // Font Weights
    'font.light': 'Тонкий',
    'font.regular': 'Обычный',
    'font.medium': 'Средний',
    'font.semibold': 'Полужирный',
    'font.bold': 'Жирный',
    
    // Global Styles
    'global.colors': 'Глобальные Цвета',
    'global.fonts': 'Глобальные Шрифты',
    'global.primary': 'Основной',
    'global.secondary': 'Второстепенный',
    'global.accent': 'Акцент',
    'global.background': 'Фон',
    'global.foreground': 'Передний план',
    'global.mono': 'Моноширинный',
    
    // Template Library
    'templates.title': 'Библиотека Шаблонов',
    'templates.description': 'Выберите из профессионально созданных шаблонов для быстрого старта',
    'templates.search': 'Поиск шаблонов...',
    'templates.all': 'Все Шаблоны',
    'templates.landingPage': 'Лендинг',
    'templates.business': 'Бизнес',
    'templates.portfolio': 'Портфолио',
    'templates.ecommerce': 'Электронная торговля',
    'templates.blog': 'Блог',
    'templates.use': 'Использовать Шаблон',
    'templates.applying': 'Применение...',
    'templates.noResults': 'Не найдено шаблонов по запросу "{query}"',
    'templates.noCategory': 'Нет доступных шаблонов в категории {category}',
    
    // Canvas
    'canvas.dropElements': 'Перетащите элементы сюда для добавления контента',
    'canvas.page': 'Страница:',
    'canvas.untitled': 'Без названия',
    
    // Actions
    'action.copy': 'Копировать',
    'action.paste': 'Вставить',
    'action.duplicate': 'Дублировать',
    'action.delete': 'Удалить',
    'action.close': 'Закрыть',
    
    // Messages
    'message.projectCreated': 'Ваш новый проект лендинга был успешно создан.',
    'message.projectSaved': 'Ваши изменения были успешно сохранены.',
    'message.exportSuccess': 'Ваш лендинг был экспортирован как HTML.',
    'message.templateApplied': 'Шаблон был успешно применен к вашему проекту.',
    'message.elementDuplicated': 'Копия элемента была создана.',
    'message.elementDeleted': 'Элемент был удален со страницы.',
    'message.stylesCopied': 'Стили элемента были скопированы в буфер обмена.',
    'message.stylesPasted': 'Стили были применены к выбранному элементу.',
    'message.projectDeleted': 'Проект был успешно удален.',
    
    // Error Messages
    'error.createProject': 'Не удалось создать проект. Попробуйте еще раз.',
    'error.saveProject': 'Не удалось сохранить проект. Попробуйте еще раз.',
    'error.exportProject': 'Не удалось экспортировать проект. Попробуйте еще раз.',
    'error.applyTemplate': 'Не удалось применить шаблон. Попробуйте еще раз.',
    'error.loadProject': 'Загрузка проекта...',
    'error.deleteProject': 'Не удалось удалить проект. Попробуйте еще раз.',
    
    // Placeholders
    'placeholder.clickToEdit': 'Нажмите для редактирования',
    'placeholder.enterEmail': 'Введите ваш email',
    'placeholder.yourName': 'Ваше Имя',
    'placeholder.yourEmail': 'Ваш Email',
    'placeholder.yourMessage': 'Ваше Сообщение',
    'placeholder.addVideo': 'Нажмите, чтобы добавить URL видео',
    
    // Loading States
    'loading.projects': 'Загрузка проектов...',
    'loading.templates': 'Загрузка шаблонов...',
    'loading.project': 'Загрузка проекта...',
  }
};

export const useTranslation = create<TranslationState>()(
  persist(
    (set, get) => ({
      locale: 'ru' as Locale, // По умолчанию русский язык
      setLocale: (locale: Locale) => set({ locale }),
      t: (key: string, params?: Record<string, string | number>) => {
        const { locale } = get();
        const dict = translations[locale];
        let translation = dict[key as keyof typeof dict] || key;
        
        // Replace parameters in translation
        if (params && typeof translation === 'string') {
          Object.entries(params).forEach(([paramKey, value]) => {
            translation = translation.replace(`{${paramKey}}`, String(value));
          });
        }
        
        return translation;
      },
    }),
    {
      name: 'pagebuilder-locale',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);

// Export hook for easy usage
export const useLocale = () => {
  const { locale, setLocale } = useTranslation();
  return { locale, setLocale };
};

// Export translation function for usage outside components
export const t = (key: string, params?: Record<string, string | number>) => {
  return useTranslation.getState().t(key, params);
};