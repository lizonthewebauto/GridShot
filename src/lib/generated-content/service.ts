import type { Brand, GeneratedContentKind, GeneratedLayoutFamily } from '@/types';

import {
  applyCarouselSelection,
  applySingleImageSelection,
  type AppliedGenerationSelection,
  type CarouselGenerationOutput,
  type SingleImageGenerationOutput,
  type UploadCandidate,
} from './selection';

const DEFAULT_LAYOUTS: GeneratedLayoutFamily[] = [
  'center-center',
  'center-left',
  'left-left',
  'right-left',
];

const DEFAULT_REDRAW_LIMIT = 3;
const DEFAULT_MODEL = process.env.KIEAI_DRAFT_MODEL || 'gpt-5.5';
const KIEAI_BASE = 'https://api.kie.ai';

interface GenerationRequestBase {
  brand: Brand;
  uploads: UploadCandidate[];
  requestedPhotoCount: number;
  postIndex: number;
}

export interface GenerateOneDraftRequest extends GenerationRequestBase {
  kind: GeneratedContentKind;
}

export interface GeneratedDraftRecord {
  kind: GeneratedContentKind;
  layoutFamily: GeneratedLayoutFamily;
  caption: string;
  fitScore: number;
  redrawRecommended: boolean;
  reason: string;
  slides: AppliedGenerationSelection['slides'];
  requestPayload: Record<string, unknown>;
  selectedUploads: UploadCandidate[];
  modelOutput: Record<string, unknown>;
  attempts: Array<{
    fitScore: number;
    redrawRecommended: boolean;
    reason: string;
    selectedUploads: UploadCandidate[];
  }>;
}

export interface GenerateDraftBatchRequest {
  brand: Brand;
  uploads: UploadCandidate[];
  kind: GeneratedContentKind;
  contentCount: number;
  requestedPhotoCount: number;
}

interface ChatCompletionsResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

function collapseWhitespace(value: string | null | undefined): string {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

function sampleUnique<T>(items: T[], count: number): T[] {
  if (items.length < count) {
    throw new Error(`Need at least ${count} photos, but only found ${items.length}.`);
  }

  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy.slice(0, count);
}

function buildVoiceNotes(brand: Brand): string[] {
  const notes = [
    brand.voice_description,
    brand.brand_personality,
    brand.tagline,
    brand.website_tagline,
    brand.niche,
    brand.service_area,
    brand.differentiator,
    ...(brand.style_keywords || []),
    ...(brand.tone_presets || []),
  ]
    .map((value) => collapseWhitespace(value))
    .filter(Boolean);

  if (notes.length > 0) return notes;

  return [
    'The copy should feel human, polished, and visually grounded.',
    'Do not force a story that the photos cannot support.',
    'The image supports the point. The line should carry the meaning.',
  ];
}

function buildCarouselPrompt(brand: Brand, requestedPhotoCount: number) {
  return [
    `Create one ${requestedPhotoCount}-slide social carousel draft for ${brand.name}.`,
    'Use the images as the source of truth.',
    'Do not invent facts that the image cannot support.',
    'The copy should not just describe what the viewer already sees.',
    'The line can hold the deeper point, meaning, persuasion, or feeling, as long as it fits the image.',
    'Loose coherence is enough. Do not force a big narrative.',
    '',
    'Brand voice notes:',
    ...buildVoiceNotes(brand).map((note) => `- ${note}`),
    '',
    'Return JSON only.',
  ].join('\n');
}

function buildSinglePrompt(brand: Brand, candidateCount: number) {
  return [
    `Create one single-image social post draft for ${brand.name}.`,
    `You will receive ${candidateCount} image options.`,
    'Choose the strongest image for the point.',
    'Do not describe the image literally unless a small grounding detail is necessary.',
    'The image should support the line, not be repeated by the line.',
    '',
    'Brand voice notes:',
    ...buildVoiceNotes(brand).map((note) => `- ${note}`),
    '',
    'Return JSON only.',
  ].join('\n');
}

function buildCarouselSchema(requestedPhotoCount: number) {
  return {
    type: 'object',
    additionalProperties: false,
    required: ['kind', 'fitScore', 'redrawRecommended', 'reason', 'slides', 'caption'],
    properties: {
      kind: { type: 'string', const: 'carousel' },
      fitScore: { type: 'number' },
      redrawRecommended: { type: 'boolean' },
      reason: { type: 'string' },
      caption: { type: 'string' },
      slides: {
        type: 'array',
        minItems: requestedPhotoCount,
        maxItems: requestedPhotoCount,
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['imageNumber', 'title', 'body'],
          properties: {
            imageNumber: {
              type: 'integer',
              minimum: 1,
              maximum: requestedPhotoCount,
            },
            title: { type: 'string' },
            body: { type: 'string' },
          },
        },
      },
    },
  };
}

function buildSingleSchema(candidateCount: number) {
  return {
    type: 'object',
    additionalProperties: false,
    required: ['kind', 'fitScore', 'redrawRecommended', 'reason', 'imageNumber', 'title', 'body', 'caption'],
    properties: {
      kind: { type: 'string', const: 'single' },
      fitScore: { type: 'number' },
      redrawRecommended: { type: 'boolean' },
      reason: { type: 'string' },
      imageNumber: {
        type: 'integer',
        minimum: 1,
        maximum: candidateCount,
      },
      title: { type: 'string' },
      body: { type: 'string' },
      caption: { type: 'string' },
    },
  };
}

async function runVisionModel({
  prompt,
  uploads,
  schema,
}: {
  prompt: string;
  uploads: UploadCandidate[];
  schema: Record<string, unknown>;
}): Promise<Record<string, unknown>> {
  const apiKey = process.env.KIEAI_API_KEY;
  if (!apiKey) {
    throw new Error('KIEAI_API_KEY is required for AI draft generation.');
  }

  const userContent: Array<Record<string, unknown>> = [
    { type: 'text', text: prompt },
    ...uploads.flatMap((upload, index) => [
      { type: 'text', text: `Image ${index + 1}: ${upload.fileName}` },
      { type: 'image_url', image_url: { url: upload.photoUrl } },
    ]),
  ];

  const response = await fetch(`${KIEAI_BASE}/${DEFAULT_MODEL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      messages: [
        { role: 'user', content: userContent },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'generated_draft',
          strict: true,
          schema,
        },
      },
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Kie.ai generation failed: ${errorText}`);
  }

  const payload = (await response.json()) as ChatCompletionsResponse;
  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Kie.ai generation did not return any content.');
  }

  return JSON.parse(content) as Record<string, unknown>;
}

function assertValidModelOutput(
  kind: GeneratedContentKind,
  output: Record<string, unknown>,
  requestedPhotoCount: number,
) {
  if (kind === 'carousel') {
    const slides = Array.isArray(output.slides) ? output.slides : [];
    if (slides.length !== requestedPhotoCount) {
      throw new Error(`Model returned ${slides.length} slides, expected ${requestedPhotoCount}.`);
    }
    const imageNumbers = slides.map((slide) => Number((slide as Record<string, unknown>).imageNumber));
    const unique = new Set(imageNumbers);
    if (
      unique.size !== requestedPhotoCount ||
      imageNumbers.some((value) => !Number.isInteger(value) || value < 1 || value > requestedPhotoCount)
    ) {
      throw new Error('Model returned invalid carousel image selections.');
    }
    return;
  }

  const imageNumber = Number(output.imageNumber);
  if (!Number.isInteger(imageNumber) || imageNumber < 1 || imageNumber > requestedPhotoCount) {
    throw new Error('Model returned an invalid single-image selection.');
  }
}

function getLayoutFamily(postIndex: number): GeneratedLayoutFamily {
  return DEFAULT_LAYOUTS[postIndex % DEFAULT_LAYOUTS.length];
}

async function generateAttempt(request: GenerateOneDraftRequest): Promise<{
  applied: AppliedGenerationSelection;
  output: Record<string, unknown>;
  selectedUploads: UploadCandidate[];
}> {
  const layoutFamily = getLayoutFamily(request.postIndex);
  const selectedUploads = sampleUnique(request.uploads, request.requestedPhotoCount);
  const output =
    request.kind === 'carousel'
      ? await runVisionModel({
          prompt: buildCarouselPrompt(request.brand, request.requestedPhotoCount),
          uploads: selectedUploads,
          schema: buildCarouselSchema(request.requestedPhotoCount),
        })
      : await runVisionModel({
          prompt: buildSinglePrompt(request.brand, request.requestedPhotoCount),
          uploads: selectedUploads,
          schema: buildSingleSchema(request.requestedPhotoCount),
        });

  assertValidModelOutput(request.kind, output, request.requestedPhotoCount);

  const applied =
    request.kind === 'carousel'
      ? applyCarouselSelection({
          uploads: selectedUploads,
          output: output as unknown as CarouselGenerationOutput,
          layoutFamily,
        })
      : applySingleImageSelection({
          uploads: selectedUploads,
          output: output as unknown as SingleImageGenerationOutput,
          layoutFamily,
        });

  return {
    applied,
    output,
    selectedUploads,
  };
}

export async function generateOneDraft(request: GenerateOneDraftRequest): Promise<GeneratedDraftRecord> {
  const attempts: GeneratedDraftRecord['attempts'] = [];
  let bestAttempt: Awaited<ReturnType<typeof generateAttempt>> | null = null;

  for (let attemptIndex = 0; attemptIndex < DEFAULT_REDRAW_LIMIT; attemptIndex += 1) {
    const attempt = await generateAttempt(request);
    attempts.push({
      fitScore: attempt.applied.fitScore,
      redrawRecommended: attempt.applied.redrawRecommended,
      reason: attempt.applied.reason,
      selectedUploads: attempt.selectedUploads,
    });

    if (!attempt.applied.redrawRecommended) {
      bestAttempt = attempt;
      break;
    }

    if (!bestAttempt || attempt.applied.fitScore > bestAttempt.applied.fitScore) {
      bestAttempt = attempt;
    }
  }

  if (!bestAttempt) {
    throw new Error('Could not generate a valid draft attempt.');
  }

  return {
    kind: request.kind,
    layoutFamily: getLayoutFamily(request.postIndex),
    caption: bestAttempt.applied.caption,
    fitScore: bestAttempt.applied.fitScore,
    redrawRecommended: bestAttempt.applied.redrawRecommended,
    reason: bestAttempt.applied.reason,
    slides: bestAttempt.applied.slides,
    requestPayload: {
      requestedPhotoCount: request.requestedPhotoCount,
      kind: request.kind,
    },
    selectedUploads: bestAttempt.selectedUploads,
    modelOutput: bestAttempt.output,
    attempts,
  };
}

export async function generateDraftBatch(request: GenerateDraftBatchRequest): Promise<GeneratedDraftRecord[]> {
  const drafts: GeneratedDraftRecord[] = [];
  for (let index = 0; index < request.contentCount; index += 1) {
    drafts.push(
      await generateOneDraft({
        brand: request.brand,
        uploads: request.uploads,
        kind: request.kind,
        requestedPhotoCount: request.requestedPhotoCount,
        postIndex: index,
      }),
    );
  }
  return drafts;
}
