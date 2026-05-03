import { DraftEditor } from '@/components/drafts/draft-editor';

export default async function DraftEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DraftEditor draftId={id} />;
}
