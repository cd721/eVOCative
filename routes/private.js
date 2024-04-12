import { Router } from 'express';
const router = Router();

router.get('/', async (req, res) => {
    res.render("users/profile", { user: req.session.user }
    )
}
);



export default router;