const express = require("express");
const router = express.Router();
const checkAuth = require("../check_auth");
const utils = require("../../../../helpers/utils");
const teachersDb = require("../../../../controllers/teachers");
const { handleRenderer, handleDatabase, } = require("../../../../helpers/handlers/create_response");

router
  .get("/teachers", checkAuth, (req, res, next) => {
    const pages = {
      runPage: "pages/teacher-list",
      runProgram: "course.teacher.list",
    };
    handleRenderer(req.user.role, pages, res);
  })
  .get("/teacher/:id?", checkAuth, async (req, res, next) => {
    const id = req.params.id;
    const data = id ? await teachersDb.findData("id", id) : {};
    const pages = {
      data: data.data || {},
      runPage: "pages/teacher-entry",
      runProgram: "course.teacher.entry",
    };
    handleRenderer(req.user.role, pages, res);
  })
  .post("/teacher", (req, res, next) => {
    const insertDb = teachersDb.addData(req.body);
    handleDatabase(insertDb, utils.isEmptyObject, res);
  })
  .put("/teacher/:id?", (req, res, next) => {
    const { ["id"]: rmId, ...data } = req.body;
    const updateDb = teachersDb.updateData(rmId, data);
    handleDatabase(updateDb, utils.isEmptyObject, res);
  });

module.exports = router;
