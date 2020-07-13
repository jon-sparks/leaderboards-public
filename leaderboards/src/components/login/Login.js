import React, { Fragment, useState, useContext, useEffect } from 'react'
import { AccountContext } from './Accounts'
import { LoginForm } from '../styled/styled'

function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { authenticate, getSession, logout, status, setStatus } = useContext(AccountContext)

    useEffect(() => {
        getSession()
        .then(data => {
            setStatus(true)
        })
        .catch(() => {
            console.log('not logged in!')
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  
    const login = e => {
      e.preventDefault()
      authenticate(email, password)
      .then(data => {
          console.log('logged in!', data)
          setStatus(true)
      })
      .catch(err => {
          console.error('Failed to login!', err)
      })
    }

    return (
        <Fragment>
          <LoginForm onSubmit={status ? logout : login}>
            {status ?
                `` :
                <div>
                  <input value={email} placeholder="email" onChange={e => setEmail(e.target.value)}></input>
                  <input value={password} placeholder="password" onChange={e => setPassword(e.target.value)}></input>
                </div>
            }

            <button type='submit'>{status ? 'Log out' : 'Log in'}</button>
          </LoginForm>
        </Fragment>
    )
}
export default Login;
