import React, { Fragment, useState } from 'react'
import UserPool from './UserPool'

function Signup() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    
    const onSubmit = e => {
      e.preventDefault()
      UserPool.signUp(email, password, [], null, (err, data) => {
        if(err) console.error(err)
        console.log(data)
      })
    }

    return (
        <Fragment>
          <form onSubmit={onSubmit}>
            <input value={email} onChange={e => setEmail(e.target.value)}></input>
            <input value={password} onChange={e => setPassword(e.target.value)}></input>
            <button type='submit'>Sign up</button>
          </form>
        </Fragment>
    )
}
export default Signup;
