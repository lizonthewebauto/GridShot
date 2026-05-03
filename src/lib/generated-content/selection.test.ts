import assert from 'node:assert/strict';
import test from 'node:test';

import {
  applyCarouselSelection,
  applySingleImageSelection,
  clipText,
  resolveGeneratedSlideMetadata,
  type UploadCandidate,
} from './selection';

const uploads: UploadCandidate[] = [
  { storagePath: 'photos/1.jpg', photoUrl: 'https://example.com/1.jpg', fileName: '1.jpg' },
  { storagePath: 'photos/2.jpg', photoUrl: 'https://example.com/2.jpg', fileName: '2.jpg' },
  { storagePath: 'photos/3.jpg', photoUrl: 'https://example.com/3.jpg', fileName: '3.jpg' },
];

test('clipText trims whitespace and adds ellipsis when content exceeds the limit', () => {
  assert.equal(clipText('  A   short   line  ', 40), 'A short line');
  assert.equal(clipText('1234567890', 8), '12345...');
});

test('applyCarouselSelection maps image numbers into display order and swipe flags', () => {
  const result = applyCarouselSelection({
    uploads,
    output: {
      kind: 'carousel',
      redrawRecommended: false,
      reason: 'works',
      fitScore: 0.91,
      reorder: [3, 1, 2],
      slides: [
        { imageNumber: 3, title: 'Final frame', body: 'Ends with a sharper point.' },
        { imageNumber: 1, title: 'Hook', body: 'Starts with the broadest idea.' },
        { imageNumber: 2, title: 'Proof', body: 'Then it tightens into evidence.' },
      ],
      caption: 'Caption copy',
    },
  });

  assert.equal(result.slides.length, 3);
  assert.deepEqual(
    result.slides.map((slide) => slide.photo_storage_path),
    ['photos/3.jpg', 'photos/1.jpg', 'photos/2.jpg'],
  );
  assert.deepEqual(
    result.slides.map((slide) => slide.slide_order),
    [0, 1, 2],
  );
  assert.deepEqual(
    result.slides.map((slide) => slide.metadata.showSwipeArrow),
    [true, true, false],
  );
  assert.equal(result.slides[0].metadata.generatedPreviewVersion, 1);
  assert.equal(
    (result.slides[0].metadata.elements as Record<string, { visible?: boolean }>).headline?.visible,
    true,
  );
});

test('applySingleImageSelection uses the chosen image and keeps caption-level metadata', () => {
  const result = applySingleImageSelection({
    uploads,
    output: {
      kind: 'single',
      redrawRecommended: false,
      reason: 'strong single',
      fitScore: 0.77,
      imageNumber: 2,
      title: 'Lead with the feeling',
      body: 'The image supports the point without repeating it.',
      caption: 'Single caption',
    },
  });

  assert.equal(result.slides.length, 1);
  assert.equal(result.slides[0].photo_storage_path, 'photos/2.jpg');
  assert.equal(result.caption, 'Single caption');
  assert.equal(result.fitScore, 0.77);
});

test('resolveGeneratedSlideMetadata creates layout-aware defaults for older generated drafts', () => {
  const resolved = resolveGeneratedSlideMetadata({
    layoutFamily: 'right-left',
    metadata: {
      sourceImageNumber: 2,
      sourceFileName: '2.jpg',
    },
    defaultShowSwipe: true,
  });

  assert.equal(resolved.showSwipeArrow, true);
  assert.equal(resolved.image.alignment, 'right');
  assert.equal(resolved.elements.headline.alignment, 'left');
  assert.equal(resolved.elements.footer.textSource, 'review');
  assert.equal(resolved.elements.header.visible, true);
});

test('resolveGeneratedSlideMetadata preserves overrides and clamps unsafe sizing', () => {
  const resolved = resolveGeneratedSlideMetadata({
    layoutFamily: 'center-center',
    defaultShowSwipe: true,
    metadata: {
      showSwipeArrow: false,
      elements: {
        headline: {
          visible: true,
          fontSize: 220,
          alignment: 'center',
        },
        body: {
          visible: true,
          fontSize: 8,
          lineHeight: 3.5,
        },
        footer: {
          visible: true,
          textSource: 'custom',
          text: 'Custom footer',
        },
        swipeIndicator: {
          visible: true,
          arrowStyle: 'dots',
          opacity: 5,
        },
      },
      image: {
        widthPercent: 140,
      },
    },
  });

  assert.equal(resolved.showSwipeArrow, false);
  assert.equal(resolved.elements.headline.fontSize, 110);
  assert.equal(resolved.elements.body.fontSize, 14);
  assert.equal(resolved.elements.body.lineHeight, 1.8);
  assert.equal(resolved.elements.footer.text, 'Custom footer');
  assert.equal(resolved.elements.swipeIndicator.arrowStyle, 'dots');
  assert.equal(resolved.elements.swipeIndicator.opacity, 1);
  assert.equal(resolved.image.widthPercent, 96);
});
