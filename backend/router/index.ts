import { Router } from 'express';
import loginRouter from './login/login';
import authRouter from './auth';
import usersRouter from './login/users';

const router = Router();

router.use('/login', loginRouter); //router
router.use('/verify', authRouter); //router
router.use('/users', usersRouter); //router

export default router;

