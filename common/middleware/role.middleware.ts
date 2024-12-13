import { NextFunction, Response } from 'express';

export function roleMiddleware(roles: string[]) {
  return (req: any, res: Response, next: NextFunction) => {
      if (!roles.includes(req.user.role.name )) {
          return res.status(403).json({ message: 'Không có quyền!' });
      }
      next();
  };
}