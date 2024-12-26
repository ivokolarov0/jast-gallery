import { useRouter } from '@tanstack/react-router'

const BackBtn = () => {
  const { history } = useRouter();
  const goBack = () => history.go(-1);

  return (
    <div className="back-btn">
      <button className="btn" type="button" onClick={goBack}>Go back</button>
    </div>
  )
}

export default BackBtn