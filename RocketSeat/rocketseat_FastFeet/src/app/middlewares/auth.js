import jwt from 'jsonwebtoken';

import { promisify } from 'util';

import authConfig from '../../config/auth';
import l from '../../config/logger';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: 'Token not provided' });

  const [, token] = authHeader.split(' ');

  try {
    // decodifica o jwt
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // pega o payload id e insere no req.userId
    req.userId = decoded.id;

    return next();
  } catch (error) {
    l.error(error);
    return res.status(401).json({ error: 'Token invalid' });
  }
};
