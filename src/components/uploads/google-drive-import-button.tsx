'use client';

import { useRef, useState } from 'react';
import { FolderOpen, Loader2 } from 'lucide-react';
import type { UploadedFile } from '@/types';
import {
  ensureGooglePicker,
  getGoogleDriveAuthErrorMessage,
  type GoogleTokenError,
} from '@/components/uploads/google-drive-picker';

declare global {
  interface Window {
    gapi: {
      load: (library: string, callback: () => void) => void;
      client: {
        load: (url: string) => Promise<void>;
      };
    };
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string }) => void;
            error_callback?: (error: GoogleTokenError) => void;
          }) => { requestAccessToken: (options: { prompt: string }) => void };
        };
      };
      picker: {
        Action: { PICKED: string; ERROR: string };
        Document: { ID: string; NAME: string; MIME_TYPE: string };
        Feature: { MULTISELECT_ENABLED: string; NAV_HIDDEN: string };
        Response: { DOCUMENTS: string };
        ViewId: { DOCS: string };
        View: new (viewId: string) => { setMimeTypes: (types: string) => void };
        PickerBuilder: new () => {
          enableFeature: (feature: string) => Window['google']['picker']['PickerBuilderInstance'];
          setDeveloperKey: (key: string) => Window['google']['picker']['PickerBuilderInstance'];
          setAppId: (id: string) => Window['google']['picker']['PickerBuilderInstance'];
          setOAuthToken: (token: string) => Window['google']['picker']['PickerBuilderInstance'];
          addView: (view: unknown) => Window['google']['picker']['PickerBuilderInstance'];
          setCallback: (callback: (data: Record<string, unknown>) => void) => Window['google']['picker']['PickerBuilderInstance'];
          build: () => { setVisible: (visible: boolean) => void };
        };
        PickerBuilderInstance: {
          enableFeature: (feature: string) => Window['google']['picker']['PickerBuilderInstance'];
          setDeveloperKey: (key: string) => Window['google']['picker']['PickerBuilderInstance'];
          setAppId: (id: string) => Window['google']['picker']['PickerBuilderInstance'];
          setOAuthToken: (token: string) => Window['google']['picker']['PickerBuilderInstance'];
          addView: (view: unknown) => Window['google']['picker']['PickerBuilderInstance'];
          setCallback: (callback: (data: Record<string, unknown>) => void) => Window['google']['picker']['PickerBuilderInstance'];
          build: () => { setVisible: (visible: boolean) => void };
        };
      };
    };
  }
}

const SCOPES = 'https://www.googleapis.com/auth/drive.file';
const MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/heic',
  'image/heif',
].join(',');

interface GoogleDriveImportButtonProps {
  onImported: (files: UploadedFile[]) => void;
}

export function GoogleDriveImportButton({ onImported }: GoogleDriveImportButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const accessTokenRef = useRef<string | null>(null);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_ID;
  const developerKey = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY;
  const appId = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_APP_ID;

  async function openPicker() {
    if (!clientId || !developerKey || !appId) {
      setError('Google Drive isn’t configured yet.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await ensureGooglePicker();

      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: SCOPES,
        callback: async (response) => {
          if (response.error || !response.access_token) {
            setError(response.error === 'access_denied' ? 'Google Drive access was denied.' : 'Google Drive authorization failed.');
            setLoading(false);
            return;
          }

          accessTokenRef.current = response.access_token;

          const view = new window.google.picker.View(window.google.picker.ViewId.DOCS);
          view.setMimeTypes(MIME_TYPES);

          const picker = new window.google.picker.PickerBuilder()
            .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
            .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
            .setDeveloperKey(developerKey)
            .setAppId(appId)
            .setOAuthToken(response.access_token)
            .addView(view)
            .setCallback(async (data) => {
              if (data.action !== window.google.picker.Action.PICKED) {
                if (data.action === window.google.picker.Action.ERROR) {
                  setError('Google Drive picker failed.');
                }

                setLoading(false);
                return;
              }

              const documents = (data[window.google.picker.Response.DOCUMENTS] as Array<Record<string, string>>) ?? [];
              if (documents.length === 0) {
                setLoading(false);
                return;
              }

              try {
                const importRes = await fetch('/api/drive/import', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    accessToken: accessTokenRef.current,
                    files: documents.map((doc) => ({
                      id: doc[window.google.picker.Document.ID] ?? doc.id,
                      name: doc[window.google.picker.Document.NAME] ?? doc.name,
                      mimeType: doc[window.google.picker.Document.MIME_TYPE] ?? doc.mimeType,
                    })),
                  }),
                });

                const payload = await importRes.json().catch(() => ({}));
                if (!importRes.ok) {
                  throw new Error(payload.error || 'Google Drive import failed');
                }

                const imported = Array.isArray(payload.files) ? payload.files as UploadedFile[] : [];
                if (imported.length > 0) {
                  onImported(imported);
                }
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Google Drive import failed');
              } finally {
                setLoading(false);
              }
            })
            .build();

          picker.setVisible(true);
        },
        error_callback: (error) => {
          setError(getGoogleDriveAuthErrorMessage(error));
          setLoading(false);
        },
      });

      tokenClient.requestAccessToken({
        prompt: accessTokenRef.current ? '' : 'consent',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not open Google Drive');
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={openPicker}
        disabled={loading}
        className="flex items-center gap-2 rounded border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-card-hover disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FolderOpen className="h-4 w-4" />}
        Connect Google Drive
      </button>
      <p className="max-w-52 text-right text-xs text-muted">
        Sign in with your own Google account, then pick the images you want to import.
      </p>
      {error && (
        <div className="flex items-center gap-2">
          <p className="text-right text-xs text-danger">{error}</p>
          <button
            onClick={() => {
              setError(null);
              openPicker();
            }}
            className="text-xs font-medium text-accent hover:underline"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
