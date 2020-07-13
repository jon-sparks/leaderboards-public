import React, { useContext } from 'react'
import Events from './navigation/Events'
import { Route, Redirect } from 'react-router-dom'
import { AccountContext } from './login/Accounts';

function ProtectedRoute({ component: Component, ...rest }) {

    const { status } = useContext(AccountContext)

    return (
        <Route {...rest} render={props => status ? <Events {...props} {...rest} /> : <Redirect to={{ pathname: '/', state: {from: props.location} }}/> }/>
    )
}
export default ProtectedRoute;