'use client'

import { Globe } from 'lucide-react'

interface LanguageSwitcherProps {
  language: 'ar' | 'en'
  onLanguageChange: (lang: 'ar' | 'en') => void
}

export default function LanguageSwitcher({ language, onLanguageChange }: LanguageSwitcherProps) {
  return (
    <div className="flex items-center space-x-2">
      <Globe className="h-5 w-5 text-gray-600" />
      <button
        onClick={() => onLanguageChange('ar')}
        className={`px-3 py-1 rounded text-sm transition-colors ${
          language === 'ar'
            ? 'bg-primary-600 text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        العربية
      </button>
      <button
        onClick={() => onLanguageChange('en')}
        className={`px-3 py-1 rounded text-sm transition-colors ${
          language === 'en'
            ? 'bg-primary-600 text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        English
      </button>
    </div>
  )
}

