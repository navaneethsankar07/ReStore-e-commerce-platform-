import React from 'react'
import { useForm } from 'react-hook-form'
function Signup() {
    const {register,handleSubmit,formState:{error}} = useForm()
    const onSubmit = (data) => {
        console.log(data)
    }
  return (
    <div>
        <h1>Signup</h1>
        
    </div>
  )
}

export default Signup