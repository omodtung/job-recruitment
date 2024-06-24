import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import ms from 'ms';
import passport from 'passport';
import { JwtAuthGuard } from '@/stateless/passport/stateless.jwt.auth.guard';
import { TransformInterceptor } from './core/transform.interceptor';
import { VersioningType } from '@nestjs/common';
// import { JwtAuthGuard } from './stateless/passport/stateless.jwt.auth.guard';
// import { JwtAuthGuard } from './stateless/passport/stateless.jwt.auth.guard';
// import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT');

  const reflector = app.get(Reflector);

  // app.useGlobalGuards(new JwtAuthGuard(reflector));

  //using interceptor
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  //config view engine

  // quan ly cac version
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1', '2'],
  });

  app.useStaticAssets(join(__dirname, '..', 'src/public'));
  app.setBaseViewsDir(join(__dirname, '..', 'src/views'));
  app.setViewEngine('ejs');

  //config cookies
  app.use(cookieParser());

  //config session
  app.use(
    session({
      secret: configService.get<string>('EXPRESS_SESSION_SECRET'),
      resave: true,
      saveUninitialized: false,
      cookie: {
        maxAge: ms(configService.get<string>('EXPRESS_SESSION_COOKIE')),
      },
      store: MongoStore.create({
        mongoUrl: configService.get<string>('MONGODB_URI'),
      }),
    }),
  );

  //config passport
  app.use(passport.initialize());
  app.use(passport.session());

  //setup to avoid cors
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  await app.listen(port);
}

bootstrap();
