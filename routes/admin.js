const { Router } = require('express')
const router = Router()
const mongoose = require('mongoose')
const fileMiddleware = require("../middleware/file")
const adminController = require('../controller/adminController')


router.get('/', adminController.mainAdmin)

/* +++++++++++++++++++++++++++++++++++++++ Profile ++++++++++++++++++++++++++++++++++++++++++++++ */
router.get('/lookProfile', adminController.lookAdmin)

router.get('/editProfile/:id', adminController.editAdminGet)

router.post('/editProfile/:id', fileMiddleware.single("avatar"), adminController.editAdminPost)

/* +++++++++++++++++++++++++++++++++++++++ Categorys ++++++++++++++++++++++++++++++++++++++++++++++ */

router.get('/categorys', adminController.CategorysGet)

router.get('/categorys/add', adminController.createCategorysGet)

router.get('/categorys/:id', adminController.idCategorysGet)

router.get("/categorys/edit/:id", adminController.editCategorysGet)

router.post('/categorys/add', fileMiddleware.single("img"), adminController.createCategorysPost)

router.post("/categorys/edit/:id", fileMiddleware.single("img"), adminController.editCategorysPost)

router.get("/categorys/delete/:id", adminController.deleteCategorysGet)

/* +++++++++++++++++++++++++++++++++++++++ Cafes ++++++++++++++++++++++++++++++++++++++++++++++ */

router.get('/cafes', adminController.CafesGet)

router.get('/cafes/add', adminController.createCafesGet)

router.get('/cafes/:id', adminController.idCafesGet)

router.get("/cafes/edit/:id", adminController.editCafesGet)

router.post('/cafes/add', fileMiddleware.single("img"), adminController.createCafesPost)

router.post("/cafes/edit/:id", fileMiddleware.single("img"), adminController.editCafesPost)

router.get("/cafes/delete/:id", adminController.deleteCafesGet)

/* +++++++++++++++++++++++++++++++++++++++ Foods ++++++++++++++++++++++++++++++++++++++++++++++ */

router.get("/foods", adminController.FoodsGet)

router.get("/foods/search", adminController.searchFoodsGet)

router.post("/foods/search", adminController.searchFoodsPost)

router.get("/foods/searchBin", adminController.searchBinFoodsGet)

router.get("/foods/topMarks", adminController.topFoodsGet)

//router.get("/marks/between/:start/:end", adminController.betweenMarksGet ) 

router.get('/foods/add', adminController.createFoodsGet)

router.get("/foods/:id", adminController.idFoodGet)

router.get("/foods/edit/:id", adminController.editFoodsGet)

router.post('/foods/add', fileMiddleware.single("img"), adminController.createFoodsPost)

router.post("/foods/edit/:id", fileMiddleware.single("img"), adminController.editFoodsPost)

router.get("/foods/delete/:id", adminController.deleteFoodsGet)

module.exports = router