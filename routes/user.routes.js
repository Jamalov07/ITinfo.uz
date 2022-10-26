const { Router } = require("express");
const { getUsers, getUser, addUser, editUser, deleteUser, loginUser } = require("../controllers/user.controller");

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", addUser);
router.post("/login",loginUser);
router.put("/:id", editUser);
router.delete("/:id", deleteUser);

module.exports = router;
