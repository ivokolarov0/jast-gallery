import { Link } from "@tanstack/react-router";
import type { GameDB } from '@requests/db';

const GameInfoItemType = ({ attr, db }: { attr: any; db: GameDB | undefined | null }) => {
  const value = attr.value;

  if(Array.isArray(value) && attr.code !== 'tag') {
    const values = value.map((val: string) => attr.configuration.choices[val].en_US).join(', ');
    return <div>{values}</div>;
  }

  switch(attr.code) {
    case 'publisher':
      const items = value.map((val: string) => attr.configuration.choices[val].en_US).join(', ');
      return <div>{items}</div>;
    case 'website_url':
    case 'steam_url':
    case 'merchandise_url':
      return <a href={value} target="_blank">{value}</a>;
    case 'tag':
      if(db) {
        return db.tags.map((tag: any) => <Link key={tag.key} to={`/account?source=db&dbTags=${tag.key}`} className="tag">{tag.title}</Link>);
      }
      const tags = Object.values(value).map((val: unknown) => attr.configuration.choices[val as string].en_US).join(', ');
      return <div>{tags}</div>;
    default:
      return <div className="details__entry" dangerouslySetInnerHTML={{__html: value}} />;
  }
}

export default GameInfoItemType