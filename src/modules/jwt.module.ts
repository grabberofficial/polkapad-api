import { JwtModule as NestJwtModule } from '@nestjs/jwt';

const { JWT_SECRET } = process.env;

const JwtModule = NestJwtModule.register({
  secret: JWT_SECRET,
  signOptions: { expiresIn: '30d' }
});

export default JwtModule;
