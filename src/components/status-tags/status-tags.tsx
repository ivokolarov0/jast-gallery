import useGetSearchedGames from '@hooks/use-get-searched-games';
import { Product } from '@requests/get-paginated-games';
import StatusTagsItem from './status-tags-item'
import Loading from '@components/loading';

type PropsType = {
  response: any
}

const StatusTags = ({ response }: PropsType) => {
  const { data } = useGetSearchedGames({ response, from: '/game/$id' });
  const findCurrentGame = data?.[0]?.products?.find((item: Product) => item.variant.productCode === response?.code);

  const items = [
    {
      value: "finished",
      title: "Finished"
    },
    {
      value: "love_it",
      title: "Love it"
    },
    {
      value: "next_to_play",
      title: "Next to play"
    },
    {
      value: "recommended",
      title: "Recommended"
    },
  ];

  if(!findCurrentGame) {
    return <Loading />
  }

  return (
    <div className="status-tags">
      <h5>Set status:</h5>
      {items.map((item) => <StatusTagsItem key={item.value} item={item} game={findCurrentGame} />)}
    </div>
  )
}

export default StatusTags