import { Router } from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(cookieParser());


export default router;

