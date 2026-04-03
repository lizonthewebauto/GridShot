'use client';

import { forwardRef } from 'react';
import type { TemplateData } from '@/types';
import { getTemplate } from '@/lib/templates/registry';

interface CenterPreviewProps {
  templateSlug: string;
  data: TemplateData;
}

export const CenterPreview = forwardRef<HTMLDivElement, CenterPreviewProps>(
  function CenterPreview({ templateSlug, data }, ref) {
    const Template = getTemplate(templateSlug);

    return (
      <div className="flex-1 bg-[#e8e3db] flex items-center justify-center p-8 overflow-auto">
        <div
          ref={ref}
          className="shadow-2xl"
          style={{
            transform: 'scale(0.5)',
            transformOrigin: 'center center',
          }}
        >
          <Template data={data} />
        </div>
      </div>
    );
  }
);
