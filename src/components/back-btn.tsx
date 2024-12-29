import { useRouter } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next';

const BackBtn = () => {
  const { t } = useTranslation();
  const { history } = useRouter();
  const goBack = () => history.go(-1);

  return (
    <div className="back-btn">
      <button className="btn" type="button" onClick={goBack}>{t('go-back')}</button>
    </div>
  )
}

export default BackBtn