import { JwtModule as NestJwtModule } from '@nestjs/jwt';

// TODO: move to .env
export const jwtSecret = 'db1e3a04e028eeec1b0c4af5f53fccb8';

const JwtModule = NestJwtModule.register({
  secret: jwtSecret,
  signOptions: { expiresIn: '30d' }
});

export default JwtModule;
