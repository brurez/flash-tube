import Axios from 'axios';
import 'source-map-support/register';
import { decode, verify } from 'jsonwebtoken';
import { createLogger } from '../utils/logger';
import { Jwt } from '../auth/Jwt';
import { JwtPayload } from '../auth/JwtPayload';
import {Request, Response} from 'express';
import router from './videoController';

const logger = createLogger('auth');

const jwksUrl = 'https://brurez.auth0.com/pem';

const verifyAuth(token)

    logger.info('Authorizing a user', req.body.authorizationToken);
    try {
        const jwtToken = await verifyToken(req.body.authorizationToken);
        logger.info('User was authorized', jwtToken);

        return {
            principalId: jwtToken.sub,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Allow',
                        Resource: '*'
                    }
                ]
            }
        };
    } catch (e) {
        logger.error('User not authorized', { error: e });

        return {
            principalId: 'user',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Deny',
                        Resource: '*'
                    }
                ]
            }
        };
    }
};

function getToken(authHeader: string): string {
    if (!authHeader) throw new Error('No authentication header');

    if (!authHeader.toLowerCase().startsWith('bearer '))
        throw new Error('Invalid authentication header');

    const split = authHeader.split(' ');
    return split[1];
}


async function verifyToken(authHeader: string): Promise<JwtPayload> {
    const token = getToken(authHeader);
    const jwt: Jwt = decode(token, { complete: true }) as Jwt;

    if (!jwt) {
        throw new Error('invalid token');
    }

    try {
        const response = await Axios.get(jwksUrl);
        console.log(response);
        var verifedToken = verify(token, response.data, { algorithms: ['RS256'] });

        console.log('verfied token', verifedToken);
        return verifedToken as JwtPayload;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}
