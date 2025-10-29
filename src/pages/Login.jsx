import React from 'react'
import { Link } from 'react-router-dom'
import {useForm} from 'react-hook-form'
import { signin } from '../firebase/auth'
function Login() {
    const {register,handleSubmit,formState:{errors}} = useForm()
    const onSubmit = async (data) => {
        try{
       await signin(data.email,data.password)
       console.log('successful');
       
        }catch(error){
            alert(error.message)
        }
    }
  return (
    <>
        <div className="container">
            <h1>Login</h1>
            <form  onSubmit={handleSubmit(onSubmit)} autoComplete='on'>
                <label htmlFor='email' >Email</label>
                <input autoComplete='email' id='email' type="email" {...register('email',{required:'email is required'})} />
                {errors.email && <p>{errors.email.message}</p>}
                <label htmlFor='password'>Password</label>
                <input id='password' type="password" {...register('password',{required:'password is required', minLength:{
                    value:6,
                    message:'Password must contain atleast 6 digits'
                }})} />
                {errors.password && <p>{errors.password.message}</p>}
                <button type='submit'>Submit</button>
            </form>
        </div>
    </>
)
}

export default Login