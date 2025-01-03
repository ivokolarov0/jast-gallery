import { useEffect, useState } from "react";
import { Store } from "@tauri-apps/plugin-store";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import Loading from "@components/loading";

const Security = () => {
  const { t } = useTranslation();
  const store = new Store('store.bin');
  const [loading, setLoading] = useState<boolean>(true);
  const { handleSubmit, register, setValue } = useForm({
    defaultValues: {
      password: ''
    }
  });

  useEffect(() => {
    (async () => {
      const pass: string = (await store.get('app_pass')) ?? '';
      setValue('password', pass);
      setLoading(false);
    })();
  }, []);

  const onSubmit = async (values: {password: string}) => {
    setLoading(true)
    if(values.password != '') {
      await store.set('has_password', true);
      await store.set('app_pass', values.password);
    } else {
      await store.set('has_password', false);
      await store.delete('app_pass');
    }
    await store.save();
    setLoading(false)

    toast(
      t('password.saved'), 
      { 
        type: "success", 
        autoClose: 1000, 
        position: "bottom-right" 
      }
    )
  }

  if(loading) {
    return <Loading />
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-field">
          <label htmlFor="app-pass">{t('password.application-password')}</label>
          <input
            id="app-pass"
            className="field"
            type="password"
            {...register('password')} 
          />
          <small className="form-field__info">
            {t('password.text1')}
            <br/>{t('password.text2')}
          </small>
          <br/>
          <small className="form-field__info">* {t('password.disclaimer')}</small>
        </div>
        <button className="btn" type="submit">{t('password.save')}</button>
      </form>
    </div>
  )
}

export default Security