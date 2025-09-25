import { invoke } from '@tauri-apps/api/core';

export type GameListItem = {
  jast_id: string;
  name: string;
  cover_image?: string | null;
};

export type DbTag = { key: string; title: string };

export type PagedDbResult = { items: GameListItem[]; total: number; pages: number };

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

export async function searchDbGames(query: string, tagKeys: string[]): Promise<GameListItem[]> {
  return invoke<GameListItem[]>('search_db_games', { payload: JSON.stringify({ query, tag_keys: tagKeys }) });
}

export async function searchDbGamesPaged(query: string, tagKeys: string[], page: number, pageSize = 20): Promise<PagedDbResult> {
  return invoke<PagedDbResult>('search_db_games_paged', { payload: JSON.stringify({ query, tag_keys: tagKeys, page, page_size: pageSize }) });
}

export async function getDbTags(): Promise<DbTag[]> {
  return invoke<DbTag[]>('list_db_tags');
}

export async function getGameVndbId(jastId: string): Promise<string | null> {
  return invoke<string | null>('get_game_vndb_id', { payload: JSON.stringify({ jast_id: jastId }) });
}

export async function setGameVndbId(jastId: string, vndbId: string | null): Promise<boolean> {
  return invoke<boolean>('set_game_vndb_id', { payload: JSON.stringify({ jast_id: jastId, vndb_id: vndbId }) });
}
