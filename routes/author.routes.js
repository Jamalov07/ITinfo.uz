const { Router } = require("express");
const { getAuthors, getAuthor, addAuthor, editAuthor, deleteAuthor,loginAuthor } = require("../controllers/author.controller");

const router = Router();

router.get("/", getAuthors);
router.get("/:id", getAuthor);
router.post("/", addAuthor);
router.post("/login",loginAuthor);
router.put("/:id", editAuthor);
router.delete("/:id", deleteAuthor);

module.exports = router;
