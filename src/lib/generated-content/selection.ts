import type {
  ElementAlignment,
  FooterConfig,
  GeneratedDraftImageConfig,
  GeneratedDraftSlideMetadata,
  GeneratedLayoutFamily,
  SlideElements,
  SwipeIndicatorConfig,
} from '@/types';

export interface UploadCandidate {
  storagePath: string;
  photoUrl: string;
  fileName: string;
}

export interface GeneratedDraftSlide {
  headline: string;
  body_text: string;
  photo_url: string;
  photo_storage_path: string;
  slide_order: number;
  metadata: GeneratedDraftSlideMetadata;
}

export interface CarouselOutputSlide {
  imageNumber: number;
  title: string;
  body: string;
}

export interface CarouselGenerationOutput {
  kind: 'carousel';
  redrawRecommended: boolean;
  reason: string;
  fitScore: number;
  reorder: number[];
  slides: CarouselOutputSlide[];
  caption: string;
}

export interface SingleImageGenerationOutput {
  kind: 'single';
  redrawRecommended: boolean;
  reason: string;
  fitScore: number;
  imageNumber: number;
  title: string;
  body: string;
  caption: string;
}

export interface AppliedGenerationSelection {
  caption: string;
  fitScore: number;
  redrawRecommended: boolean;
  reason: string;
  slides: GeneratedDraftSlide[];
}

const DEFAULT_TITLE_MAX = 58;
const DEFAULT_BODY_MAX = 170;
const GENERATED_PREVIEW_VERSION = 1;
const DEFAULT_GENERATED_ELEMENTS: SlideElements = {
  header: { visible: true, fontSize: 24, alignment: 'center', position: 'top', letterSpacing: 0.35, fontWeight: 400, fontStyle: 'normal' },
  headline: { visible: true, fontSize: 88, alignment: 'left', position: 'top', lineHeight: 1.1, fontWeight: 900, letterSpacing: 0.02, fontStyle: 'normal' },
  body: { visible: true, fontSize: 32, alignment: 'left', position: 'top', lineHeight: 1.5, fontWeight: 400, fontStyle: 'italic' },
  footer: { visible: true, fontSize: 22, alignment: 'left', position: 'bottom', fontStyle: 'italic', textSource: 'review' },
  swipeIndicator: { visible: true, text: 'Swipe', fontSize: 22, alignment: 'right', position: 'bottom', arrowStyle: 'text', opacity: 0.5, letterSpacing: 0.15 },
};

const LAYOUT_IMAGE_DEFAULTS: Record<GeneratedLayoutFamily, Required<GeneratedDraftImageConfig>> = {
  'center-center': { alignment: 'center', widthPercent: 86 },
  'center-left': { alignment: 'center', widthPercent: 86 },
  'left-left': { alignment: 'left', widthPercent: 92 },
  'right-left': { alignment: 'right', widthPercent: 92 },
};

function collapseWhitespace(value: string | null | undefined): string {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function cloneDefaultElements(): SlideElements {
  return {
    header: { ...DEFAULT_GENERATED_ELEMENTS.header },
    headline: { ...DEFAULT_GENERATED_ELEMENTS.headline },
    body: { ...DEFAULT_GENERATED_ELEMENTS.body },
    footer: { ...DEFAULT_GENERATED_ELEMENTS.footer },
    swipeIndicator: { ...DEFAULT_GENERATED_ELEMENTS.swipeIndicator },
  };
}

function defaultTextAlignment(layoutFamily: GeneratedLayoutFamily): ElementAlignment {
  return layoutFamily === 'center-center' ? 'center' : 'left';
}

function resolveDefaultElements(layoutFamily: GeneratedLayoutFamily): SlideElements {
  const elements = cloneDefaultElements();
  const textAlignment = defaultTextAlignment(layoutFamily);
  elements.headline.alignment = textAlignment;
  elements.body.alignment = textAlignment;
  elements.footer.alignment = textAlignment;
  return elements;
}

function sanitizeElementConfig<
  T extends SlideElements[keyof SlideElements],
>(element: T, key: keyof SlideElements): T {
  const next = { ...element };

  if (typeof next.fontSize === 'number') {
    const max = key === 'headline' ? 110 : key === 'body' ? 64 : 42;
    const min = key === 'headline' ? 28 : key === 'body' ? 14 : 10;
    next.fontSize = clampNumber(next.fontSize, min, max);
  }

  if (typeof next.lineHeight === 'number') {
    next.lineHeight = clampNumber(next.lineHeight, 0.9, 1.8);
  }

  if (typeof next.letterSpacing === 'number') {
    next.letterSpacing = clampNumber(next.letterSpacing, -0.05, 0.5);
  }

  if ('opacity' in next && typeof next.opacity === 'number') {
    (next as SwipeIndicatorConfig).opacity = clampNumber(next.opacity, 0, 1);
  }

  return next;
}

function mergeElementOverrides(
  defaults: SlideElements,
  overrides: GeneratedDraftSlideMetadata['elements'],
): SlideElements {
  return {
    header: sanitizeElementConfig(
      { ...defaults.header, ...(overrides?.header || {}) },
      'header',
    ),
    headline: sanitizeElementConfig(
      { ...defaults.headline, ...(overrides?.headline || {}) },
      'headline',
    ),
    body: sanitizeElementConfig(
      { ...defaults.body, ...(overrides?.body || {}) },
      'body',
    ),
    footer: sanitizeElementConfig(
      { ...defaults.footer, ...(overrides?.footer || {}) } as FooterConfig,
      'footer',
    ) as FooterConfig,
    swipeIndicator: sanitizeElementConfig(
      { ...defaults.swipeIndicator, ...(overrides?.swipeIndicator || {}) } as SwipeIndicatorConfig,
      'swipeIndicator',
    ) as SwipeIndicatorConfig,
  };
}

export interface ResolvedGeneratedSlideMetadata extends GeneratedDraftSlideMetadata {
  generatedPreviewVersion: number;
  showSwipeArrow: boolean;
  elements: SlideElements;
  image: Required<GeneratedDraftImageConfig>;
}

export function resolveGeneratedSlideMetadata({
  layoutFamily,
  metadata,
  defaultShowSwipe,
}: {
  layoutFamily: GeneratedLayoutFamily;
  metadata?: GeneratedDraftSlideMetadata | null;
  defaultShowSwipe: boolean;
}): ResolvedGeneratedSlideMetadata {
  const nextMetadata = metadata || {};
  const defaultElements = resolveDefaultElements(layoutFamily);
  const imageDefaults = LAYOUT_IMAGE_DEFAULTS[layoutFamily];

  const image: Required<GeneratedDraftImageConfig> = {
    alignment:
      nextMetadata.image?.alignment ||
      imageDefaults.alignment,
    widthPercent: clampNumber(
      nextMetadata.image?.widthPercent ?? imageDefaults.widthPercent,
      56,
      96,
    ),
  };

  return {
    ...nextMetadata,
    generatedPreviewVersion: GENERATED_PREVIEW_VERSION,
    showSwipeArrow: nextMetadata.showSwipeArrow ?? defaultShowSwipe,
    elements: mergeElementOverrides(defaultElements, nextMetadata.elements),
    image,
  };
}

export function clipText(value: string | null | undefined, maxChars: number): string {
  const clipped = collapseWhitespace(value);
  if (clipped.length <= maxChars) return clipped;
  return `${clipped.slice(0, Math.max(0, maxChars - 3)).trim()}...`;
}

function getUpload(uploads: UploadCandidate[], imageNumber: number): UploadCandidate {
  const upload = uploads[imageNumber - 1];
  if (!upload) {
    throw new Error(`Missing upload for imageNumber ${imageNumber}`);
  }
  return upload;
}

export function applyCarouselSelection({
  uploads,
  output,
  layoutFamily = 'center-left',
}: {
  uploads: UploadCandidate[];
  output: CarouselGenerationOutput;
  layoutFamily?: GeneratedLayoutFamily;
}): AppliedGenerationSelection {
  const slides = output.slides.map((slide, index) => {
    const upload = getUpload(uploads, slide.imageNumber);
    return {
      headline: clipText(slide.title, DEFAULT_TITLE_MAX),
      body_text: clipText(slide.body, DEFAULT_BODY_MAX),
      photo_url: upload.photoUrl,
      photo_storage_path: upload.storagePath,
      slide_order: index,
      metadata: resolveGeneratedSlideMetadata({
        layoutFamily,
        defaultShowSwipe: index < output.slides.length - 1,
        metadata: {
          sourceImageNumber: slide.imageNumber,
          sourceFileName: upload.fileName,
        },
      }),
    } satisfies GeneratedDraftSlide;
  });

  return {
    caption: clipText(output.caption, 2200),
    fitScore: output.fitScore,
    redrawRecommended: output.redrawRecommended,
    reason: collapseWhitespace(output.reason),
    slides,
  };
}

export function applySingleImageSelection({
  uploads,
  output,
  layoutFamily = 'center-left',
}: {
  uploads: UploadCandidate[];
  output: SingleImageGenerationOutput;
  layoutFamily?: GeneratedLayoutFamily;
}): AppliedGenerationSelection {
  const upload = getUpload(uploads, output.imageNumber);

  return {
    caption: clipText(output.caption, 2200),
    fitScore: output.fitScore,
    redrawRecommended: output.redrawRecommended,
    reason: collapseWhitespace(output.reason),
    slides: [
      {
        headline: clipText(output.title, DEFAULT_TITLE_MAX),
        body_text: clipText(output.body, DEFAULT_BODY_MAX),
        photo_url: upload.photoUrl,
        photo_storage_path: upload.storagePath,
        slide_order: 0,
        metadata: resolveGeneratedSlideMetadata({
          layoutFamily,
          defaultShowSwipe: false,
          metadata: {
            sourceImageNumber: output.imageNumber,
            sourceFileName: upload.fileName,
          },
        }),
      },
    ],
  };
}
