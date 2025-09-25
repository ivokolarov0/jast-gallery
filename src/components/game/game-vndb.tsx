import { useEffect, useState } from 'react';
import ContentLoader from 'react-content-loader';

import useGameVndb from '@hooks/use-game-vndb';

const Loader = () => (
  <ContentLoader
    viewBox="0 0 360 164"
    width={360}
    height={164}
    speed={1}
    backgroundColor={'var(--c-border)'}
    foregroundColor={'var(--c-blue)'}
  >
    <rect x="0" y="0" rx="5" ry="5" width="60" height="19" />
    <rect x="0" y="34" rx="5" ry="5" width="360" height="39" />
    <rect x="0" y="88" rx="5" ry="5" width="126" height="53" />
  </ContentLoader>
)

const GameVndb = ({ id, synced }: {id: string, synced: boolean}) => {
  const { vndbId, isLoading, save, saving } = useGameVndb(id, synced);
  const [vndbValue, setVndbValue] = useState('');
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    setVndbValue(vndbId || '');
  }, [vndbId]);

  useEffect(() => {
    if (!justSaved) return;
    const t = setTimeout(() => setJustSaved(false), 1500);
    return () => clearTimeout(t);
  }, [justSaved]);

  const handleSaveVndb = async () => {
    try {
      await save(vndbValue.trim() || null);
      setJustSaved(true);
    } catch (e) {
      console.error(e);
    }
  };

  if(isLoading) {
    return <Loader />
  }
  
  return (
    <div style={{ marginTop: 12 }}>
      <h5>VNDB</h5>
      <div className="form-field">
        
        <input
          type="text"
          value={vndbValue}
          className='field'
          onChange={(e) => setVndbValue(e.target.value)}
          placeholder="e.g. https://vndb.org/v00000"
          disabled={!synced || isLoading}
          style={{ marginBottom: 15 }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button type="button" className="btn" onClick={handleSaveVndb} disabled={!synced || saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
          {justSaved && <span className="hint" style={{ color: 'var(--green)', fontSize: 12 }}>Saved</span>}
        </div>
      </div>
    </div>
  )
}

export default GameVndb