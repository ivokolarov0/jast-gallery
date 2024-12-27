import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from '@tanstack/react-router';
import { GlobalContextType, useGlobal } from '@contexts/global';

const Pass = () => {
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
        "Wrong password", 
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
      <h4>Application password</h4>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-field">
          <input id="app-pass" className="field" type="password" placeholder="Enter password" {...register('password')} />
        </div>
        <button className="btn" type="submit">Submit</button>
      </form>
      <ToastContainer />
    </div>
  )
}

export default Pass