var express =require("express");
var routes = express.Router();

routes.use("/api/user", require("../controllers/user"));
routes.use("/api/user/auth", require("../controllers/userauth"));
routes.use("/api/adminlogin", require("../controllers/adminlogin"));
routes.use("/api/product", require("../controllers/product"));
routes.use("/api/collections", require("../controllers/collections"));
routes.use("/api/product_collections", require("../controllers/product_collections"));



module.exports = routes;