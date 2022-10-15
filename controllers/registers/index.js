let {
  listData,
  findDataById,
  findDataBy,
  addData,
  updateData,
  deleteData,
} = require("./mongodb/index");

let exportDb = {
  listData,
  findDataById,
  findDataBy,
  addData,
  updateData,
  deleteData,
};

module.exports = exportDb;
