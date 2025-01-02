
const GameInfoItemType = ({ attr }: any) => {
  const value = attr.value;

  if(Array.isArray(value)) {
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
      const tags = Object.values(value).map((val: unknown) => attr.configuration.choices[val as string].en_US).join(', ');
      return <div>{tags}</div>;
    default:
      return <div dangerouslySetInnerHTML={{__html: value}} />;
  }
}

export default GameInfoItemType