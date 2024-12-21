import { useRouter } from '@tanstack/react-router'
import { useGlobalProvider } from '@contexts/global';

const BackBtn = ({ page }: {page: string}) => {
  const { setPage } = useGlobalProvider() as { setPage: (page: string) => void }
  const { history } = useRouter();
  const goBack = () => {
    setPage(page);
    history.go(-1);
  }

  return (
    <div className="back-btn">
      <button className="btn" type="button" onClick={goBack}>Go back</button>
    </div>
  )
}

export default BackBtn