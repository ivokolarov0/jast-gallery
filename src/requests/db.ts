import { invoke } from '@tauri-apps/api/core';

export type GameListItem = {
  jast_id: string;
  name: string;
  cover_image?: string | null;
};

export async function isGameSynced(jastId: string): Promise<boolean> {
  return invoke<boolean>('is_game_synced', { payload: JSON.stringify({ jast_id: jastId }) });
}

export async function bulkIsGameSynced(jastIds: string[]): Promise<Array<{ jast_id: string; synced: boolean }>> {
  return invoke('bulk_is_game_synced', { payload: JSON.stringify({ jast_ids: jastIds }) });
}

export async function saveGameIfMissing(payload: any): Promise<boolean> {
  return invoke<boolean>('save_game_if_missing', { payload: JSON.stringify(payload) });
}

export async function searchGamesByTags(tagKeys: string[]): Promise<GameListItem[]> {
  return invoke<GameListItem[]>('search_games_by_tags', { tag_keys: tagKeys });
}
