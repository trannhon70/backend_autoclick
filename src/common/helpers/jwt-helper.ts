import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export async function extractUserFromRequest(req: any, jwtService: JwtService): Promise<{ userId: number, roleId: number }> {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new Error('Authorization token is missing');
  }

  const decoded = await jwtService.verify(token);
  if (!decoded?.id) {
    throw new Error('Invalid token');
  }

  return {
    userId: Number(decoded.id), 
    roleId: Number(decoded.role.id), 
  };
}


export function extractTokenFromHeader(req: any): string {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedException('Authorization header missing or invalid format');
  }

  const token = authHeader.split(' ')[1].trim();
  // JWT chuẩn có 3 phần ngăn bởi dấu "."
  if (token.split('.').length !== 3) {
    throw new UnauthorizedException('Malformed token');
  }

  return token;
}