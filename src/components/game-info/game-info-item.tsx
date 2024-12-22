import { ProductAttributeValue } from "@requests/get-game";

type PropType = {
  attr: ProductAttributeValue
}

const GameInfoItem = ({ attr }: PropType) => {
  const value = attr.value;
  const title = attr.code.replace(/_/g, ' ');

  if(attr.code === 'video_html') {
    return null;
  }

  return (
    <div className="details-wrapper">
      <h5>{title}</h5>
      <div className="details">
        {Array.isArray(value) 
          ? value.map((val: string, index) => (
            <div key={index}>{attr.configuration.choices[val].en_US}</div>
          )) 
          : <div className="details__entry" dangerouslySetInnerHTML={{__html: value}} />}
      </div>
    </div>
  )
}

export default GameInfoItem