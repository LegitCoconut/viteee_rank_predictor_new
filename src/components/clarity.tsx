'use client';

import { useEffect } from 'react';
import Clarity from '@microsoft/clarity';

const CLARITY_PROJECT_ID = 'wdjrdyxjjv';

export function ClarityInit() {
  useEffect(() => {
    // Production only, so local dev doesn't pollute the recordings.
    if (process.env.NODE_ENV === 'production') Clarity.init(CLARITY_PROJECT_ID);
  }, []);
  return null;
}
