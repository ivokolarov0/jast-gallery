import { Store } from "@tauri-apps/plugin-store";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const Security = () => {
  const store = new Store('store.bin');
  const [loading, setLoading] = useState<boolean>(true);
  const { handleSubmit, register, setValue } = useForm({
    defaultValues: {
      password: ''
    }
  });

  useEffect(() => {
    (async () => {
      const pass: string = (await store.get('app-password')) ?? '';
      setValue('password', pass);
      setLoading(false);
    })();
  }, []);

  const onSubmit = async (values: {password: string}) => {
    setLoading(true)
    if(values.password != '') {
      await store.set('app-password', values.password);
    } else {
      await store.delete('app-password');
    }
    setLoading(false)

    toast(
      "Password saved!", 
      { 
        type: "success", 
        autoClose: 1000, 
        position: "bottom-right" 
      }
    )
  }

  if(loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-field">
          <label htmlFor="app-pass">Application password</label>
          <input
            id="app-pass"
            className="field"
            type="password"
            {...register('password')} 
          />
          <small className="form-field__info">This will add a simple password page when the application is opened to prevent people from accessing it.<br/>Leaving it empty will remove the page.</small>
          <br/>
          <small className="form-field__info">* the password will be saved as plain text locally, don't use existing passwords!</small>
        </div>
        <button className="btn" type="submit">Save</button>
      </form>
    </div>
  )
}

export default Security