import {TokenService} from '@loopback/authentication';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import jwt from 'jsonwebtoken';
//


export class JwtService implements TokenService {
  constructor(
    private jwtSecret: string = process.env.TOKEN_SECRET + '',
    private jwtExpiresIn: string = process.env.TOKEN_EXPIRY + '',
  ) { }

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized('The token is not provided');
    }
    let userProfile: UserProfile;
    try {

      const decryptedToken: unknown = jwt.verify(token, this.jwtSecret);

      if (typeof decryptedToken !== 'object') {
        throw new HttpErrors.Unauthorized('Could not verify token')
      }

      const decrypted = decryptedToken as {id: string, role: string}

      userProfile = {
        [securityId]: decrypted.id,
        id: decrypted.id,
        role: decrypted.role,
      }

    } catch (err) {
      throw new HttpErrors.Unauthorized(`Error verifying token: ${err}`);
    }
    return userProfile;
  }

  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        'Error generating token: userProfile is null',
      );
    }

    // Generate a JSON Web Token
    console.log(this.jwtExpiresIn);
    let token: string;
    try {
      token = jwt.sign(
        userProfile, this.jwtSecret, {expiresIn: this.jwtExpiresIn});
    } catch (error) {
      throw new HttpErrors.Unauthorized(`Error encoding token: ${error}`);
    }

    return token;
  }
}
