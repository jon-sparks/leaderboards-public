import React, { createContext, useState } from 'react'
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js'
import Pool from './UserPool'

const AccountContext = createContext()

const Account = props => {

    const [status, setStatus] = useState(false)
    const [user, setUser] = useState('')

    const getSession = async () => {
        await new Promise((resolve, reject) => {
            const user = Pool.getCurrentUser()
            if(user) {
                user.getSession((err, session) => {
                    if(err) {
                        setUser('')
                        setStatus(false)
                        reject()
                    } else {
                        setUser(session.idToken.payload.email)
                        setStatus(true)
                        resolve(session)
                    }
                })
            } else {
                console.log(user)
                reject()
            }
        })
    }

    const authenticate = async (Username, Password) => {
        await new Promise((resolve, reject) => {
            const user = new CognitoUser({ Username, Pool })
            const authDetails = new AuthenticationDetails({ Username, Password })
            user.authenticateUser(authDetails, {
                onSuccess: data => {
                    console.log('onSuccess:', data)
                    console.log(`logged in as ${data.idToken.payload.email}`)
                    setStatus(true)
                    setUser(data.idToken.payload.email)
                    resolve(data)
                },
                onFailure: err => {
                    console.error('onFailure:', err)
                    reject(err)
                },
                newPasswordRequired: data => {
                    console.log('newPasswordRequired:', data)
                    resolve(data)
                }
            })
        })
    }

    const logout = (e) => {
        e.preventDefault()
        const user = Pool.getCurrentUser()
        if(user){
            user.signOut()
            setStatus(false)
        }
    }

    return (
        <AccountContext.Provider value={{ authenticate, getSession, logout, status, setStatus, user, setUser }}>
            {props.children}
        </AccountContext.Provider>
    )
}

export { Account, AccountContext }

