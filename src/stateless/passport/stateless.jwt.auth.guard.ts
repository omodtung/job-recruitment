import {
  BadRequestException,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err, user,info,context:ExecutionContext) {
    
    const request :Request = context.switchToHttp().getRequest();
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException('Token không hợp lệ');
    }
    // check permission
    const targetMethod = request.method;
    const targetEndPoint = request.route?.path;
    const permission = user?.permissions ??[];
    const isExist= permission.find ( permission => targetMethod===permission.method && targetEndPoint ===permission.apiPath)
    if (!isExist)
    {
      throw new ForbiddenException("Ban Khong Co Quyen truy cap endpoint")
    }
    return user ;
  }
}
