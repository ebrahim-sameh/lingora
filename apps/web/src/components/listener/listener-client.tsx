'use client';

import * as React from 'react';
import { LanguagePicker } from './language-picker';
import { PlayerView } from './player-view';
import {
  getLanguageByCode,
  type LingoraLanguage,
} from '@lingora/shared/languages';

interface ListenerClientProps {
  roomCode: string;
  sessionName: string;
  speakerName: string | null;
  languageCodes: string[];
}

export function ListenerClient({
  roomCode,
  sessionName,
  speakerName,
  languageCodes,
}: ListenerClientProps) {
  const [language, setLanguage] = React.useState<LingoraLanguage | null>(null);

  const availableLanguages = React.useMemo(
    () =>
      languageCodes
        .map((c) => getLanguageByCode(c))
        .filter((l): l is LingoraLanguage => Boolean(l)),
    [languageCodes],
  );

  if (!language) {
    return (
      <LanguagePicker
        roomCode={roomCode}
        sessionName={sessionName}
        speakerName={speakerName}
        languages={availableLanguages}
        onSelect={setLanguage}
      />
    );
  }

  return (
    <PlayerView
      roomCode={roomCode}
      sessionName={sessionName}
      speakerName={speakerName}
      language={language}
      availableLanguages={availableLanguages}
      onChangeLanguage={setLanguage}
    />
  );
}
