const { Router } = require("express");
const { getAdmins, getAdmin, addAdmin, editAdmin, deleteAdmin, loginAdmin } = require("../controllers/admin.controller");

const router = Router();


router.get("/", getAdmins);
router.get("/:id", getAdmin);
router.post("/", addAdmin);
router.post("/login",loginAdmin)
router.put("/:id", editAdmin);
router.delete("/:id", deleteAdmin);


module.exports = router;
