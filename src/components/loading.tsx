import { useTranslation } from "react-i18next"

const Loading = () => {
  const { t } = useTranslation()
  return (
    <div>{t('loading')}...</div>
  )
}

export default Loading