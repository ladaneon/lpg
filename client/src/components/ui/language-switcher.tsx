import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocale, type Locale } from "@/lib/i18n";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  const languages = [
    { code: 'ru' as Locale, name: 'Русский', flag: '🇷🇺' },
    { code: 'en' as Locale, name: 'English', flag: '🇺🇸' },
  ];

  const currentLanguage = languages.find(lang => lang.code === locale);

  return (
    <Select value={locale} onValueChange={setLocale}>
      <SelectTrigger className="w-auto min-w-[120px]" data-testid="language-switcher">
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4" />
          <span>{currentLanguage?.flag} {currentLanguage?.name}</span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {languages.map((language) => (
          <SelectItem 
            key={language.code} 
            value={language.code}
            data-testid={`language-option-${language.code}`}
          >
            <div className="flex items-center space-x-2">
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}