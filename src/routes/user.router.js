import { Router } from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import { registerUser } from '../controllers/user.controllers.js';
import { loginUser } from '../controllers/user.controllers.js';
import { logoutUser } from '../controllers/user.controllers.js';
import { extractAccessToken } from '../middlewares/logout.middleware.js'

const router = Router();

router.route('/register').post(upload.fields([{
    name: "avatar",
    maxCount: 1
}, {
    name: "coverImage",
    maxCount: 1
}])
    ,registerUser,
)

router.route('/login').post(loginUser);
router.route('/logout').post(extractAccessToken , logoutUser)

export default router;