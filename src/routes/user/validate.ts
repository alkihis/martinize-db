import { Router } from 'express';
import { errorCatcher, generateSnowflake, signToken, methodNotAllowed, sanitize } from '../../helpers';
import Errors, { ErrorType } from '../../Errors';
import { Database } from '../../Entities/CouchHelper';
import { Token } from '../../Entities/entities';

const ValidateUserRouter = Router();

ValidateUserRouter.get('/', (req, res) => {
  (async () => {
    const user = await Database.user.fromToken(req.user!.jti);

    if (!user) {
      return Errors.throw(ErrorType.Forbidden);
    }

    res.json(sanitize({ ...user, password: null }));
  })().catch(errorCatcher(res));
});

ValidateUserRouter.all('/', methodNotAllowed('GET'));

export default ValidateUserRouter;
