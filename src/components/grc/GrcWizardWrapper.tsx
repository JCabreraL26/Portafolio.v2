import React from 'react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { GrcWizard } from './GrcWizard';

const convex = new ConvexReactClient(import.meta.env.PUBLIC_CONVEX_URL);

export function GrcWizardWrapper() {
  return (
    <ConvexProvider client={convex}>
      <GrcWizard />
    </ConvexProvider>
  );
}
