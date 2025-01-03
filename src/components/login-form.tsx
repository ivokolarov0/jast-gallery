import { useState } from 'react';
import { useForm } from 'react-hook-form'
import { Store } from '@tauri-apps/plugin-store';

import login from '@requests/login';
import Loading from '@components/loading';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

type ValuesType = {
  email: string,
  password: string,
  remember_me: number
}

const LoginForm = () => {
  const { t } = useTranslation();
  const { navigate } = useRouter();
  const store = new Store('store.bin');
  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit, register } = useForm({
    defaultValues: {
      remember_me: 1,
      email: "",
      password: ""
    }
  });
  const queryClient = useQueryClient();

  const onSubmit = async (values: ValuesType) => {
    setIsLoading(true);
    const [data, error] = await login(values);

    if(error) {
      alert('There was some kind of error')
    }

    if (data?.code === 401) {
      alert(data?.message || 'There was some kind of error');
    }

    if(data?.token) {
      await store.set('account', data);
      await store.save();
    }

    queryClient.invalidateQueries({
      queryKey: ['me']
    });

    navigate({
      to: '/account'
    });

    setIsLoading(false);
  }

  if(isLoading) {
    return <Loading />
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="login-form">
      <div className="form-field">
        <label>{t('login.email')}</label>
        <input type="email" className="field" {...register('email', {required: true})} />
      </div>
      <div className="form-field">
        <label>{t('login.password')}</label>
      <input type="password" className="field" {...register('password', {required: true})} />
      </div>
      <div className="form-field">
        <label><input type="checkbox" {...register('remember_me')} /> {t('login.remember-me')}</label>
      </div>
      <button type="submit" className="btn">{t('login.login')}</button>
    </form>
  )
}

export default LoginForm