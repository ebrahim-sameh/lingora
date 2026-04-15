export interface LingoraLanguage {
  code: string;
  gladiaCode: string;
  englishName: string;
  nativeName: string;
  flag: string;
  region: LanguageRegion;
}

export type LanguageRegion =
  | 'Europe'
  | 'Americas'
  | 'Middle East & North Africa'
  | 'Sub-Saharan Africa'
  | 'South Asia'
  | 'East Asia'
  | 'Southeast Asia'
  | 'Central Asia'
  | 'Oceania';

export const LANGUAGES: readonly LingoraLanguage[] = [
  // Europe
  { code: 'en', gladiaCode: 'en', englishName: 'English', nativeName: 'English', flag: '🇺🇸', region: 'Europe' },
  { code: 'en-GB', gladiaCode: 'en', englishName: 'English (UK)', nativeName: 'English (UK)', flag: '🇬🇧', region: 'Europe' },
  { code: 'es', gladiaCode: 'es', englishName: 'Spanish', nativeName: 'Español', flag: '🇪🇸', region: 'Europe' },
  { code: 'fr', gladiaCode: 'fr', englishName: 'French', nativeName: 'Français', flag: '🇫🇷', region: 'Europe' },
  { code: 'de', gladiaCode: 'de', englishName: 'German', nativeName: 'Deutsch', flag: '🇩🇪', region: 'Europe' },
  { code: 'it', gladiaCode: 'it', englishName: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', region: 'Europe' },
  { code: 'pt', gladiaCode: 'pt', englishName: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', region: 'Europe' },
  { code: 'nl', gladiaCode: 'nl', englishName: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', region: 'Europe' },
  { code: 'pl', gladiaCode: 'pl', englishName: 'Polish', nativeName: 'Polski', flag: '🇵🇱', region: 'Europe' },
  { code: 'ru', gladiaCode: 'ru', englishName: 'Russian', nativeName: 'Русский', flag: '🇷🇺', region: 'Europe' },
  { code: 'uk', gladiaCode: 'uk', englishName: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', region: 'Europe' },
  { code: 'cs', gladiaCode: 'cs', englishName: 'Czech', nativeName: 'Čeština', flag: '🇨🇿', region: 'Europe' },
  { code: 'sk', gladiaCode: 'sk', englishName: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰', region: 'Europe' },
  { code: 'hu', gladiaCode: 'hu', englishName: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺', region: 'Europe' },
  { code: 'ro', gladiaCode: 'ro', englishName: 'Romanian', nativeName: 'Română', flag: '🇷🇴', region: 'Europe' },
  { code: 'bg', gladiaCode: 'bg', englishName: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬', region: 'Europe' },
  { code: 'hr', gladiaCode: 'hr', englishName: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷', region: 'Europe' },
  { code: 'sr', gladiaCode: 'sr', englishName: 'Serbian', nativeName: 'Српски', flag: '🇷🇸', region: 'Europe' },
  { code: 'sl', gladiaCode: 'sl', englishName: 'Slovenian', nativeName: 'Slovenščina', flag: '🇸🇮', region: 'Europe' },
  { code: 'el', gladiaCode: 'el', englishName: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', region: 'Europe' },
  { code: 'sv', gladiaCode: 'sv', englishName: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', region: 'Europe' },
  { code: 'no', gladiaCode: 'no', englishName: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴', region: 'Europe' },
  { code: 'da', gladiaCode: 'da', englishName: 'Danish', nativeName: 'Dansk', flag: '🇩🇰', region: 'Europe' },
  { code: 'fi', gladiaCode: 'fi', englishName: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮', region: 'Europe' },
  { code: 'is', gladiaCode: 'is', englishName: 'Icelandic', nativeName: 'Íslenska', flag: '🇮🇸', region: 'Europe' },
  { code: 'lt', gladiaCode: 'lt', englishName: 'Lithuanian', nativeName: 'Lietuvių', flag: '🇱🇹', region: 'Europe' },
  { code: 'lv', gladiaCode: 'lv', englishName: 'Latvian', nativeName: 'Latviešu', flag: '🇱🇻', region: 'Europe' },
  { code: 'et', gladiaCode: 'et', englishName: 'Estonian', nativeName: 'Eesti', flag: '🇪🇪', region: 'Europe' },
  { code: 'ga', gladiaCode: 'ga', englishName: 'Irish', nativeName: 'Gaeilge', flag: '🇮🇪', region: 'Europe' },
  { code: 'cy', gladiaCode: 'cy', englishName: 'Welsh', nativeName: 'Cymraeg', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', region: 'Europe' },
  { code: 'mt', gladiaCode: 'mt', englishName: 'Maltese', nativeName: 'Malti', flag: '🇲🇹', region: 'Europe' },
  { code: 'sq', gladiaCode: 'sq', englishName: 'Albanian', nativeName: 'Shqip', flag: '🇦🇱', region: 'Europe' },
  { code: 'mk', gladiaCode: 'mk', englishName: 'Macedonian', nativeName: 'Македонски', flag: '🇲🇰', region: 'Europe' },
  { code: 'bs', gladiaCode: 'bs', englishName: 'Bosnian', nativeName: 'Bosanski', flag: '🇧🇦', region: 'Europe' },
  { code: 'ca', gladiaCode: 'ca', englishName: 'Catalan', nativeName: 'Català', flag: '🇪🇸', region: 'Europe' },
  { code: 'eu', gladiaCode: 'eu', englishName: 'Basque', nativeName: 'Euskara', flag: '🇪🇸', region: 'Europe' },
  { code: 'gl', gladiaCode: 'gl', englishName: 'Galician', nativeName: 'Galego', flag: '🇪🇸', region: 'Europe' },
  { code: 'lb', gladiaCode: 'lb', englishName: 'Luxembourgish', nativeName: 'Lëtzebuergesch', flag: '🇱🇺', region: 'Europe' },
  { code: 'fo', gladiaCode: 'fo', englishName: 'Faroese', nativeName: 'Føroyskt', flag: '🇫🇴', region: 'Europe' },
  { code: 'be', gladiaCode: 'be', englishName: 'Belarusian', nativeName: 'Беларуская', flag: '🇧🇾', region: 'Europe' },

  // Americas
  { code: 'es-MX', gladiaCode: 'es', englishName: 'Spanish (Mexico)', nativeName: 'Español (México)', flag: '🇲🇽', region: 'Americas' },
  { code: 'pt-BR', gladiaCode: 'pt', englishName: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)', flag: '🇧🇷', region: 'Americas' },
  { code: 'fr-CA', gladiaCode: 'fr', englishName: 'French (Canada)', nativeName: 'Français (Canada)', flag: '🇨🇦', region: 'Americas' },
  { code: 'ht', gladiaCode: 'ht', englishName: 'Haitian Creole', nativeName: 'Kreyòl Ayisyen', flag: '🇭🇹', region: 'Americas' },
  { code: 'qu', gladiaCode: 'qu', englishName: 'Quechua', nativeName: 'Runa Simi', flag: '🇵🇪', region: 'Americas' },

  // Middle East & North Africa
  { code: 'ar', gladiaCode: 'ar', englishName: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', region: 'Middle East & North Africa' },
  { code: 'ar-EG', gladiaCode: 'ar', englishName: 'Arabic (Egypt)', nativeName: 'العربية (مصر)', flag: '🇪🇬', region: 'Middle East & North Africa' },
  { code: 'ar-AE', gladiaCode: 'ar', englishName: 'Arabic (Gulf)', nativeName: 'العربية (الخليج)', flag: '🇦🇪', region: 'Middle East & North Africa' },
  { code: 'he', gladiaCode: 'he', englishName: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', region: 'Middle East & North Africa' },
  { code: 'fa', gladiaCode: 'fa', englishName: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', region: 'Middle East & North Africa' },
  { code: 'ku', gladiaCode: 'ku', englishName: 'Kurdish', nativeName: 'Kurdî', flag: '🇮🇶', region: 'Middle East & North Africa' },
  { code: 'ps', gladiaCode: 'ps', englishName: 'Pashto', nativeName: 'پښتو', flag: '🇦🇫', region: 'Middle East & North Africa' },
  { code: 'az', gladiaCode: 'az', englishName: 'Azerbaijani', nativeName: 'Azərbaycan', flag: '🇦🇿', region: 'Middle East & North Africa' },
  { code: 'hy', gladiaCode: 'hy', englishName: 'Armenian', nativeName: 'Հայերեն', flag: '🇦🇲', region: 'Middle East & North Africa' },
  { code: 'ka', gladiaCode: 'ka', englishName: 'Georgian', nativeName: 'ქართული', flag: '🇬🇪', region: 'Middle East & North Africa' },
  { code: 'tr', gladiaCode: 'tr', englishName: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', region: 'Middle East & North Africa' },

  // Sub-Saharan Africa
  { code: 'sw', gladiaCode: 'sw', englishName: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪', region: 'Sub-Saharan Africa' },
  { code: 'am', gladiaCode: 'am', englishName: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹', region: 'Sub-Saharan Africa' },
  { code: 'yo', gladiaCode: 'yo', englishName: 'Yoruba', nativeName: 'Yorùbá', flag: '🇳🇬', region: 'Sub-Saharan Africa' },
  { code: 'ig', gladiaCode: 'ig', englishName: 'Igbo', nativeName: 'Igbo', flag: '🇳🇬', region: 'Sub-Saharan Africa' },
  { code: 'ha', gladiaCode: 'ha', englishName: 'Hausa', nativeName: 'Hausa', flag: '🇳🇬', region: 'Sub-Saharan Africa' },
  { code: 'zu', gladiaCode: 'zu', englishName: 'Zulu', nativeName: 'isiZulu', flag: '🇿🇦', region: 'Sub-Saharan Africa' },
  { code: 'xh', gladiaCode: 'xh', englishName: 'Xhosa', nativeName: 'isiXhosa', flag: '🇿🇦', region: 'Sub-Saharan Africa' },
  { code: 'af', gladiaCode: 'af', englishName: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦', region: 'Sub-Saharan Africa' },
  { code: 'so', gladiaCode: 'so', englishName: 'Somali', nativeName: 'Soomaali', flag: '🇸🇴', region: 'Sub-Saharan Africa' },
  { code: 'rw', gladiaCode: 'rw', englishName: 'Kinyarwanda', nativeName: 'Ikinyarwanda', flag: '🇷🇼', region: 'Sub-Saharan Africa' },
  { code: 'sn', gladiaCode: 'sn', englishName: 'Shona', nativeName: 'chiShona', flag: '🇿🇼', region: 'Sub-Saharan Africa' },
  { code: 'mg', gladiaCode: 'mg', englishName: 'Malagasy', nativeName: 'Malagasy', flag: '🇲🇬', region: 'Sub-Saharan Africa' },

  // South Asia
  { code: 'hi', gladiaCode: 'hi', englishName: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', region: 'South Asia' },
  { code: 'bn', gladiaCode: 'bn', englishName: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', region: 'South Asia' },
  { code: 'ur', gladiaCode: 'ur', englishName: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', region: 'South Asia' },
  { code: 'pa', gladiaCode: 'pa', englishName: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', region: 'South Asia' },
  { code: 'gu', gladiaCode: 'gu', englishName: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', region: 'South Asia' },
  { code: 'mr', gladiaCode: 'mr', englishName: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', region: 'South Asia' },
  { code: 'ta', gladiaCode: 'ta', englishName: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', region: 'South Asia' },
  { code: 'te', gladiaCode: 'te', englishName: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', region: 'South Asia' },
  { code: 'kn', gladiaCode: 'kn', englishName: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', region: 'South Asia' },
  { code: 'ml', gladiaCode: 'ml', englishName: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', region: 'South Asia' },
  { code: 'or', gladiaCode: 'or', englishName: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳', region: 'South Asia' },
  { code: 'as', gladiaCode: 'as', englishName: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳', region: 'South Asia' },
  { code: 'si', gladiaCode: 'si', englishName: 'Sinhala', nativeName: 'සිංහල', flag: '🇱🇰', region: 'South Asia' },
  { code: 'ne', gladiaCode: 'ne', englishName: 'Nepali', nativeName: 'नेपाली', flag: '🇳🇵', region: 'South Asia' },
  { code: 'dz', gladiaCode: 'dz', englishName: 'Dzongkha', nativeName: 'རྫོང་ཁ', flag: '🇧🇹', region: 'South Asia' },

  // East Asia
  { code: 'zh', gladiaCode: 'zh', englishName: 'Chinese (Mandarin)', nativeName: '中文', flag: '🇨🇳', region: 'East Asia' },
  { code: 'zh-TW', gladiaCode: 'zh', englishName: 'Chinese (Taiwan)', nativeName: '繁體中文', flag: '🇹🇼', region: 'East Asia' },
  { code: 'yue', gladiaCode: 'yue', englishName: 'Cantonese', nativeName: '粵語', flag: '🇭🇰', region: 'East Asia' },
  { code: 'ja', gladiaCode: 'ja', englishName: 'Japanese', nativeName: '日本語', flag: '🇯🇵', region: 'East Asia' },
  { code: 'ko', gladiaCode: 'ko', englishName: 'Korean', nativeName: '한국어', flag: '🇰🇷', region: 'East Asia' },
  { code: 'mn', gladiaCode: 'mn', englishName: 'Mongolian', nativeName: 'Монгол', flag: '🇲🇳', region: 'East Asia' },

  // Southeast Asia
  { code: 'vi', gladiaCode: 'vi', englishName: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', region: 'Southeast Asia' },
  { code: 'th', gladiaCode: 'th', englishName: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', region: 'Southeast Asia' },
  { code: 'id', gladiaCode: 'id', englishName: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', region: 'Southeast Asia' },
  { code: 'ms', gladiaCode: 'ms', englishName: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾', region: 'Southeast Asia' },
  { code: 'tl', gladiaCode: 'tl', englishName: 'Filipino', nativeName: 'Filipino', flag: '🇵🇭', region: 'Southeast Asia' },
  { code: 'my', gladiaCode: 'my', englishName: 'Burmese', nativeName: 'မြန်မာ', flag: '🇲🇲', region: 'Southeast Asia' },
  { code: 'km', gladiaCode: 'km', englishName: 'Khmer', nativeName: 'ខ្មែរ', flag: '🇰🇭', region: 'Southeast Asia' },
  { code: 'lo', gladiaCode: 'lo', englishName: 'Lao', nativeName: 'ລາວ', flag: '🇱🇦', region: 'Southeast Asia' },
  { code: 'jv', gladiaCode: 'jv', englishName: 'Javanese', nativeName: 'Basa Jawa', flag: '🇮🇩', region: 'Southeast Asia' },
  { code: 'su', gladiaCode: 'su', englishName: 'Sundanese', nativeName: 'Basa Sunda', flag: '🇮🇩', region: 'Southeast Asia' },

  // Central Asia
  { code: 'kk', gladiaCode: 'kk', englishName: 'Kazakh', nativeName: 'Қазақ', flag: '🇰🇿', region: 'Central Asia' },
  { code: 'ky', gladiaCode: 'ky', englishName: 'Kyrgyz', nativeName: 'Кыргыз', flag: '🇰🇬', region: 'Central Asia' },
  { code: 'uz', gladiaCode: 'uz', englishName: 'Uzbek', nativeName: 'Oʻzbek', flag: '🇺🇿', region: 'Central Asia' },
  { code: 'tk', gladiaCode: 'tk', englishName: 'Turkmen', nativeName: 'Türkmen', flag: '🇹🇲', region: 'Central Asia' },
  { code: 'tg', gladiaCode: 'tg', englishName: 'Tajik', nativeName: 'Тоҷикӣ', flag: '🇹🇯', region: 'Central Asia' },

  // Oceania
  { code: 'mi', gladiaCode: 'mi', englishName: 'Māori', nativeName: 'Te Reo Māori', flag: '🇳🇿', region: 'Oceania' },
  { code: 'haw', gladiaCode: 'haw', englishName: 'Hawaiian', nativeName: 'ʻŌlelo Hawaiʻi', flag: '🇺🇸', region: 'Oceania' },
  { code: 'sm', gladiaCode: 'sm', englishName: 'Samoan', nativeName: 'Gagana Sāmoa', flag: '🇼🇸', region: 'Oceania' },
  { code: 'to', gladiaCode: 'to', englishName: 'Tongan', nativeName: 'Lea Fakatonga', flag: '🇹🇴', region: 'Oceania' },
  { code: 'fj', gladiaCode: 'fj', englishName: 'Fijian', nativeName: 'Na Vosa Vakaviti', flag: '🇫🇯', region: 'Oceania' },
];

export const LANGUAGE_REGIONS: LanguageRegion[] = [
  'Americas',
  'Europe',
  'Middle East & North Africa',
  'Sub-Saharan Africa',
  'South Asia',
  'East Asia',
  'Southeast Asia',
  'Central Asia',
  'Oceania',
];

export function getLanguageByCode(code: string): LingoraLanguage | undefined {
  return LANGUAGES.find((l) => l.code === code);
}

export function getLanguagesByRegion(region: LanguageRegion): LingoraLanguage[] {
  return LANGUAGES.filter((l) => l.region === region);
}

export function groupLanguagesByRegion(): Record<LanguageRegion, LingoraLanguage[]> {
  const grouped = {} as Record<LanguageRegion, LingoraLanguage[]>;
  for (const region of LANGUAGE_REGIONS) {
    grouped[region] = [];
  }
  for (const lang of LANGUAGES) {
    grouped[lang.region].push(lang);
  }
  return grouped;
}
