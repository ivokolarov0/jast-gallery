import { invoke } from '@tauri-apps/api/core';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';
import { Link, useNavigate } from '@tanstack/react-router';

import { useGlobal } from '@contexts/global';

const Pass = () => {
  const { t } = useTranslation();
  const { setSecurityPassed }: any = useGlobal();
  const navigate = useNavigate();
  const { handleSubmit, register } = useForm({
    defaultValues: {
      password: ""
    }
  });

  const onSubmit = async (values: {password: string}) => {
    if(await invoke('password_check', { password: values.password })) {
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
        <input id="app-username" className="field" type="text" autoComplete="username" placeholder={t('username.enter-username')} style={{ display: 'none' }} />
        <div className="form-field">
          <input id="app-pass" className="field" type="password" autoComplete="new-password" placeholder={t('password.enter-password')} {...register('password')} />
        </div>
        <button className="btn" type="submit">{t('password.submit')}</button>
      </form>
      <Link to="/login" search={{ forgot: true }} className="pass-forgot">{t('forgotten-password')}</Link>
      <ToastContainer />
    </div>
  )
}

export default Pass