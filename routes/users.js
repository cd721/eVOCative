import { Router } from 'express';
const router = Router();
import idValidation from '../validation/idValidation.js';
import userData from '../data/users/users.js';
router.route('/').get(async (req, res) => {
    try {
        const userList = await userData.get();
        console.log(userList)
        return res.render("users/index", { users: userList });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

router
    .route('/:id')
    .get(async (req, res) => {
        let user_id = req.params.id;
        let user;
        try {
            user_id = idValidation.validateId(user_id);
            user = await userData.getUserById(user_id);
        } catch (e) {
            return res.status(400).render("error");

        }

        try {

            if (userData.isAdmin(user_id)) {
                return res.render("adminProfile", { title: "Admin Profile", user: user });
            }
            return res.render("profile", { title: "User Profile", user: user });

        } catch (e) {
            return res.status(500).json({ error: e });
        }


    });

export default router;