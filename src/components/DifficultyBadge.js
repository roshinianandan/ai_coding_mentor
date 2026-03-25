import React from 'react';
import { t } from '../utils/i18n';

export default function DifficultyBadge({ difficulty, lang = 'en' }) {
  const cls = { Easy: 'badge-easy', Medium: 'badge-medium', Hard: 'badge-hard' }[difficulty] || 'badge-medium';
  return <span className={cls}>{t(difficulty, lang)}</span>;
}
