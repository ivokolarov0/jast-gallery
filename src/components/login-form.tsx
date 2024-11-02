import { useForm } from 'react-hook-form'
import { Store } from '@tauri-apps/plugin-store';

import { login } from '../requests';

type ValuesType = {
  email: string,
  password: string,
  remember_me: number
}

const LoginForm = () => {
  const store = new Store('store.bin');
  const { handleSubmit, register } = useForm({
    defaultValues: {
      remember_me: 1,
      email: "",
      password: ""
    }
  });

  const onSubmit = async (values: ValuesType) => {
    
    const [data, error] = await login(values);

    if(error) {
      alert('There was some kind of error')
    }

    if (data.code === 401) {
      alert(data.message || 'There was some kind of error');
    }

    if(data.token) {
      await store.set('account', data);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="login-form">
      <input type="hidden" {...register('remember_me')} />
      <div className="form-field">
        <label>Email</label>
        <input type="email" className="field" {...register('email', {required: true})} />
      </div>
      <div className="form-field">
        <label>Password</label>
      <input type="password" className="field" {...register('password', {required: true})} />
      </div>
      <div className="form-field">
        <label><input type="checkbox" {...register('remember_me')} /> Remember me</label>
      </div>
      <button type="submit" className="btn">Log in</button>
    </form>
  )
}

export default LoginForm