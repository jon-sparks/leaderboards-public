import { CognitoUserPool } from 'amazon-cognito-identity-js'

const poolData = {
    UserPoolId: 'eu-west-2_O8tf0O9ar',
    ClientId: '1b2f16njr14346e73g29sijune'
}

export default new CognitoUserPool(poolData)
