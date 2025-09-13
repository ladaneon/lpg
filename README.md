# Landing Page Generator (LPG)

Конструктор лендинг-страниц с drag-and-drop редактором, поддержкой шаблонов и экспортом в HTML.

## 🚀 Быстрый старт

### Требования
- Node.js 18+ 
- PostgreSQL (опционально, можно использовать in-memory storage)

### Установка и запуск

```bash
# Клонирование репозитория
git clone https://github.com/ladaneon/lpg.git
cd lpg

# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev
```

Приложение будет доступно по адресу: http://localhost:5000

## 🏗️ Архитектура

### Структура проекта
```
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # UI компоненты
│   │   ├── pages/         # Страницы приложения
│   │   ├── lib/           # Утилиты и конфигурация
│   │   └── store/         # Zustand store
├── server/                # Express.js backend
├── shared/                # Общие типы и схемы
└── package.json
```

### Технологический стек
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, TypeScript
- **База данных**: PostgreSQL с Drizzle ORM
- **Локализация**: Zustand-based i18n (русский/английский)
- **UI Library**: shadcn/ui компоненты
- **Drag & Drop**: React DnD

## 🎨 Система дизайна

### Цветовая схема
Приложение использует профессиональную сине-зеленую тему с поддержкой темной темы.

**⚠️ Важно для CSS переменных:**
Все цветовые переменные должны быть в формате raw HSL компонентов:
```css
:root {
  --primary: 195 85% 45%;    /* ✅ Правильно */
  --primary: hsl(195, 85%, 45%);  /* ❌ Неправильно */
}
```

### Категорийные цвета модулей
- `--cat-basic`: Основные элементы
- `--cat-layout`: Компоновочные элементы  
- `--cat-content`: Контентные элементы
- `--cat-interactive`: Интерактивные элементы
- `--cat-forms`: Формы
- `--cat-business`: Бизнес компоненты
- `--cat-utility`: Утилитарные элементы

## 🌐 Локализация

### Добавление переводов
Переводы находятся в `client/src/lib/i18n.ts`:

```typescript
export const translations = {
  en: {
    'app.title': 'Page Builder',
    'home.title': 'My Projects'
  },
  ru: {
    'app.title': 'Конструктор страниц',
    'home.title': 'Мои проекты'
  }
};
```

### Использование в компонентах
```typescript
import { useTranslation } from '@/lib/i18n';

function Component() {
  const { t } = useTranslation();
  return <h1>{t('app.title')}</h1>;
}
```

## 🗄️ База данных

### Настройка PostgreSQL (опционально)

1. Создайте базу данных PostgreSQL
2. Установите переменные окружения:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/lpg"
PGHOST=localhost
PGPORT=5432
PGUSER=user
PGPASSWORD=password
PGDATABASE=lpg
```

### Миграции
```bash
# Применение изменений схемы к базе данных
npm run db:push

# Принудительное применение (при потере данных)
npm run db:push --force
```

### In-memory режим
По умолчанию приложение использует in-memory хранилище. Для переключения на PostgreSQL убедитесь, что переменная `DATABASE_URL` установлена.

## 🔧 Разработка

### Добавление новых модулей

1. Создайте компонент модуля в `client/src/components/modules/`
2. Добавьте его в `ModulesSidebar` (`client/src/components/editor/modules-sidebar.tsx`)
3. Добавьте переводы в `client/src/lib/i18n.ts`

### Структура модуля
```typescript
interface Element {
  id: string;
  type: string;
  position: { x: number; y: number };
  content: Record<string, any>;
  styles: Record<string, any>;
}
```

### Тестирование
Все интерактивные элементы должны иметь `data-testid` атрибуты:
```jsx
<Button data-testid="button-save">Сохранить</Button>
<Input data-testid="input-project-name" />
```

## 📦 Деплой

### Переменные окружения для продакшена
```bash
NODE_ENV=production
DATABASE_URL=postgresql://...
VITE_APP_TITLE="Page Builder"
```

### Команды сборки
```bash
# Сборка для продакшена
npm run build

# Предпросмотр сборки
npm run preview
```

## 🤝 Участие в разработке

### Git workflow
1. Создайте feature ветку: `git checkout -b feature/new-module`
2. Зафиксируйте изменения: `git commit -m "feat: add new module"`
3. Создайте Pull Request

### Код стиль
- Используйте TypeScript для всех новых файлов
- Следуйте существующим паттернам shadcn/ui
- Добавляйте data-testid для тестирования
- Используйте семантические переменные CSS

## 📋 Чеклист для новых разработчиков

- [ ] Установлен Node.js 18+
- [ ] Выполнен `npm install`
- [ ] Приложение запускается командой `npm run dev`
- [ ] Проверена работа переключения языков
- [ ] Протестировано создание проекта
- [ ] Проверена работа drag & drop в редакторе
- [ ] Изучена структура цветовых переменных CSS

## 🐛 Известные проблемы

- Некоторые модули в sidebar еще не полностью локализованы
- Export HTML функция может потребовать доработки для сложных layouts
- Темная тема требует тестирования на всех компонентах

## 📞 Поддержка

При возникновении вопросов:
1. Проверьте логи в консоли браузера
2. Убедитесь, что все переменные окружения установлены
3. Проверьте формат CSS переменных (raw HSL компоненты)

---

**Версия**: 1.0.0  
**Последнее обновление**: Декабрь 2024