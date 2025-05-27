import { Request, Response, NextFunction } from 'express';
import { getUserData, IUserToken } from '../utils/jwt';

export interface IReqUser extends Request {
    user?: IUserToken
}

export default (req: Request, res: Response, next: NextFunction) => {
    //Apakah token ada di header authorization
    const authorization = req.headers?.authorization;

    // Jika tidak ada, kembalikan error
    if (!authorization) {
        return res.status(403).json({
            message: 'Unauthorized',
            data: null
        });
    }

    // Ambil token dari header authorization
    const [prefix, token] = authorization.split(' ');
    // Cek apakah prefixnya adalah Bearer
    if (!(prefix === 'Bearer' && token)) {
        return res.status(403).json({
            message: 'Unauthorized',
            data: null
        });
    }

    const user = getUserData(token);

    // Cek apakah usernya ada
    if (!user) {
        return res.status(403).json({
            message: 'Unauthorized',
            data: null
        });
    }

    (req as IReqUser).user = user;
    next();
}