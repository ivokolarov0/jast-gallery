import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from '@tanstack/react-router';

import { useGlobal } from '@contexts/global';

const Pass = () => {
  const { t } = useTranslation();
  const { savedPass, setSecurityPassed }: any = useGlobal();
  const navigate = useNavigate();
  const { handleSubmit, register } = useForm({
    defaultValues: {
      password: ""
    }
  });

  const onSubmit = (values: {password: string}) => {
    if(values.password === savedPass) {
      setSecurityPassed(true);
      navigate({
        to: '/'
      });
    } else {
      toast(
        t("password.wrong"), 
        { 
          type: "error", 
          autoClose: 1500, 
          position: "bottom-right" 
        }
      )
    }
  }

  return (
    <div className="pass-wrapper">
      <h4>{t('password.application-password')}</h4>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-field">
          <input id="app-pass" className="field" type="password" placeholder={t('password.enter-password')} {...register('password')} />
        </div>
        <button className="btn" type="submit">{t('password.submit')}</button>
      </form>
      <ToastContainer />
    </div>
  )
}

export default Pass