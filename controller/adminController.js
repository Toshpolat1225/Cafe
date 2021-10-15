const Category = require('../models/Category')
const Cafe = require('../models/Cafe')
const Food = require('../models/Foods')
const Search = require('../models/Search')
const Admin = require("../models/Admin")
const toDelete = require('../middleware/toDelete')
const mongoose = require('mongoose')
const bcrypt = require("bcryptjs");
const moment = require('moment');
//-------------------------------- Admin -------------------------------
module.exports.mainAdmin = async (req, res) => {
    const admin = await req.session.admin
    res.render('admin/index', {
        title: 'Admin',
        layout: 'admin',
        admin
    })
}
//------------------------------ Profile ----------------------------
//------------------------------- Look ------------------------------
module.exports.lookAdmin = async (req, res) => {
    const admin = await req.session.admin
    res.render('admin/lookProfile', {
        title: 'Look',
        layout: 'admin',
        admin
    })
}
//---------------------------- Edit Profile GET --------------------------
module.exports.editAdminGet = async (req, res) => {
    const admin = await Admin.findById(req.params.id)
    res.render('admin/editProfile', {
        layout: 'admin',
        title: 'Edit Profile',
        admin
    })
}
//---------------------------- Edit Profile POST -------------------------
module.exports.editAdminPost = async (req, res) => {
    const admin = await req.body
    let { avatar } = await Admin.findById(req.params.id) ///---------------------------------
    if (req.file) {
        toDelete(avatar)
        avatar = req.file.filename
    } else {
        avatar = ""
    }
    const hash = await bcrypt.hash(admin.password, 10)
    admin.password = hash
    admin.avatar = avatar
    await Admin.findByIdAndUpdate(req.params.id, admin, (err) => {
        console.log(err)
    })
    req.session.admin = await admin
    res.redirect("/admin/lookProfile")
}
//------------------------------ Categorys ----------------------------
//--------------------------- All Categorys GET -----------------------
module.exports.CategorysGet = async (req, res) => {
    const admin = req.session.admin
    const categorys = await Category.find()
    res.render('admin/categorys', {
        layout: 'admin',
        categorys,
        admin
    })
}
//--------------------------- Add Categorys GET -----------------------
module.exports.createCategorysGet = async (req, res) => {
    const admin = req.session.admin
    const cafes = await Cafe.find()
    res.render('admin/addCategory', {
        layout: 'admin',
        title: 'Create category',
        admin,
        cafes
    })
}
//---------------------------- ID Categorys GET -----------------------
module.exports.idCategorysGet = async (req, res) => {
    const admin = req.session.admin
    const { title } = await Category.findById(req.params.id)
    let foods = await Category.aggregate([{
        $lookup: {
            from: "foods",
            localField: "_id",
            foreignField: "categoryId",
            as: "foods"
        }
    },
    {
        $match: {
            _id: mongoose.Types.ObjectId(req.params.id)
        }
    },
    {
        $group: {
            _id: {
                _id: "$_id"
            },
            foods: {
                $push: "$foods"
            }
        }
    },
    {
        $project: {
            _id: "$_id._id",
            name: "$_id.name",
            price: "$_id.price",
            img: "$_id.img",
            foods: "$foods"
        }
    },
    {
        $unwind: {
            path: "$foods"
        }
    },

    ])
    console.log(foods);
    if (foods.length) {
        foods = foods[0].foods
    } else {
        foods = ""
    }
    res.render('admin/category', {
        title: title,
        layout: 'admin',
        foods,
        admin
    })
}
//-------------------------- Edit Categorys GET -----------------------
module.exports.editCategorysGet = async (req, res) => {
    const admin = req.session.admin
    const category = await Category.findById(req.params.id)
    const cafes = await Cafe.find()
    res.render('admin/editCategory', {
        layout: 'admin',
        title: 'Edit category',
        category,
        cafes,
        admin
    })
}
//--------------------------- Add Categorys POST -----------------------
module.exports.createCategorysPost = async (req, res) => {
    const {
        name,
        cafeId
    } = req.body
    if (req.file) {
        img = req.file.filename
    } else {
        img = ""
    }
    const category = new Category({
        name,
        img,
        cafeId
    })
    await category.save()
    res.redirect('/admin/categorys')
}
//--------------------------- Edit Categorys POST -----------------------
module.exports.editCategorysPost = async (req, res) => {
    const { img } = await Category.findById(req.params.id)
    toDelete(img)
    const admin = req.body
    if (req.file) {
        admin.img = req.file.filename
        toDelete(img)
    } else {
        admin.img = img
    }
    admin.img = req.file.filename
    await Category.findByIdAndUpdate(req.params.id, admin, (err) => {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/admin/categorys")
        }
    })
}
//--------------------------- Delete Categorys GET -----------------------
module.exports.deleteCategorysGet = async (req, res) => {
    const admin = req.session.admin
    const { img } = await Category.findById(req.params.id)
    toDelete(img)
    await Category.findByIdAndDelete(req.params.id)
    res.redirect("/admin/categorys")
}
//------------------------------ Cafes ----------------------------
//--------------------------- All Cafes GET -----------------------
module.exports.CafesGet = async (req, res) => {
    const admin = req.session.admin
    const cafes = await Cafe.find()
    res.render('admin/cafes', {
        layout: 'admin',
        cafes,
        admin
    })
}
//--------------------------- Add Cafes GET -----------------------
module.exports.createCafesGet = (req, res) => {
    const admin = req.session.admin
    res.render('admin/addCafe', {
        layout: 'admin',
        title: 'Create Cafe',
        admin
    })
}
//---------------------------- ID Cafes GET -----------------------
module.exports.idCafesGet = async (req, res) => {
    const admin = req.session.admin
    const {
        title
    } = await Cafe.findById(req.params.id)

    let categories = await Cafe.aggregate([
        {
            $lookup: {
                from: "categories",
                localField: "_id",
                foreignField: "cafeId",
                as: "categories"
            }
        },
         {
            $match: {
                _id: mongoose.Types.ObjectId(req.params.id)
            }
        },
        {
            $group: {
                _id: {
                    _id: "$_id"
                },
                categories: {
                    $push: "$categories"
                }
            }
        },
        {
            $project: {
                _id: "$_id._id",
                name: "$_id.name",
                img: "$_id.img",
                categories: "$categories"
    
            }
        },
        {
            $unwind: {
                path: "$categories"
            }
        },
    ])
    console.log(categories);

    if (categories.length) {
        categories = categories[0].categories
    } else {
        categories = ""
    }
    res.render('admin/cafe', {
        title: title,
        layout: 'admin',
        categories,
        admin
    })
}
//-------------------------- Edit Cafes GET -----------------------
module.exports.editCafesGet = async (req, res) => {
    const admin = req.session.admin
    const cafe = await Cafe.findById(req.params.id)
    res.render('admin/editCafe', {
        layout: 'admin',
        title: 'Edit Cafe',
        cafe,
        admin
    })
}
//--------------------------- Add Cafes POST -----------------------
module.exports.createCafesPost = async (req, res) => {
    const { name } = req.body
    if (req.file) {
        img = req.file.filename
    } else {
        img = ""
    }
    const cafe = new Cafe({
        name,
        img
    })
    await cafe.save()
    res.redirect('/admin/cafes')
}
//--------------------------- Edit Cafes POST -----------------------
module.exports.editCafesPost = async (req, res) => {
    const {
        img
    } = await Cafe.findById(req.params.id)
    toDelete(img)
    const admin = req.body
    if (req.file) {
        admin.img = req.file.filename
        toDelete(img)
    } else {
        admin.img = img
    }
    admin.img = req.file.filename
    await Cafe.findByIdAndUpdate(req.params.id, admin, (err) => {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/admin/cafes")
        }
    })
}
//--------------------------- Delete  GET -----------------------
module.exports.deleteCafesGet = async (req, res) => {
    const admin = req.session.admin
    const {
        img
    } = await Cafe.findById(req.params.id)
    toDelete(img)
    await Cafe.findByIdAndDelete(req.params.id)
    res.redirect("/admin/cafes")
}
//------------------------------ Foods --------------------------------

//--------------------------- All Foods GET ---------------------------
module.exports.FoodsGet = async (req, res) => {
    const admin = req.session.admin
    const foods = await Food.find()
    res.render("admin/foods", {
        layout: "admin",
        title: "Foods",
        foods,
        admin
    })
}
//--------------------------- ID Food GET ---------------------------
module.exports.idFoodGet = async (req, res) => {
    const admin = req.session.admin
    const {
        title
    } = await Food.findById(req.params.id)
    const food = await Food.findById(req.params.id)
    console.log(food);
    res.render('admin/food', {
        title: title,
        layout: 'admin',
        food,
        admin
    })
}
//--------------------------- Search Foods GET ---------------------------
module.exports.searchFoodsGet = async (req, res) => {
    const admin = req.session.admin
    const foods = await Food.find()
    res.render("admin/search", {
        layout: "admin",
        title: "Foods models",
        foods,
        admin
    })
}
//--------------------------- Search Foods Post ---------------------------
module.exports.searchFoodsPost = async (req, res) => {
    const { bin } = req.body
    const search = new Search({
        bin
    })
    await search.save()
    res.redirect('/admin/foods/searchBin')
}
//--------------------------- SearchBin Foods GET ---------------------------
module.exports.searchBinFoodsGet = async (req, res) => {
    const admin = req.session.admin
    const search = await Search.find()
    const foods = await Food.find()
    for (i = 0; i < foods.length; i++) {
        console.log(Object.values(search)[0])
        if (search.bin == foods[i].name) {
            await Search.findByIdAndDelete()  //req.params.id
            res.render("admin/searchBin", {
                layout: "admin",
                title: "Food search",
                foods,
                admin
            })
        }
    }
}
//--------------------------- Top Foods GET ---------------------------
module.exports.topFoodsGet = async (req, res) => {
    const admin = req.session.admin
    const foods = await Food.find().sort({ price: -1 }).limit(13)
    res.render("admin/topFoods", {
        layout: "admin",
        title: "Foods Top",
        foods,
        admin
    })
}
//--------------------------- Between Marks GET ---------------------------
//module.exports.betweenMarksGet = async (req, res) => {
//    const admin = req.session.admin
//    const {start, end} = req.params
//    const marks = await Mark.find(
//        {price: {$gte:parseInt(start),$lte:parseInt(end)}}
//    )
//    res.render("admin/marks/top", { ////// top
//        layout: "admin",
//        title: "Drug models Top",
//        marks,
//        admin
//    })
//}
//---------------------------- Add Foods GET ---------------------------
module.exports.createFoodsGet = async (req, res) => {
    const admin = req.session.admin
    const categorys = await Category.find()
    res.render('admin/addFood', {
        layout: 'admin',
        title: 'Create Food',
        categorys,
        admin
    })
}
//---------------------------- Edit Foods GET --------------------------
module.exports.editFoodsGet = async (req, res) => {
    const admin = req.session.admin
    const food = await Food.findById(req.params.id)
    const categorys = await Category.find()
    res.render('admin/editFood', {
        layout: 'admin',
        title: 'Edit Food',
        food,
        categorys,
        admin
    })
}
//---------------------------- Add Foods POST --------------------------
module.exports.createFoodsPost = async (req, res) => {
    const {
        name,
        price,
        categoryId
    } = req.body
    if (req.file) {
        img = req.file.filename
    } else {
        img = ""
    }
    const food = new Food({
        name,
        price,
        img,
        categoryId
    })
    await food.save()
    res.redirect('/admin/foods')
}
//---------------------------- Edit Foods POST -------------------------
module.exports.editFoodsPost = async (req, res) => {
    const {
        img
    } = await Food.findById(req.params.id)
    toDelete(img)
    const admin = req.body
    if (req.file) {
        admin.img = req.file.filename
        toDelete(img)
    } else {
        admin.img = img
    }
    admin.img = req.file.filename
    await Food.findByIdAndUpdate(req.params.id, admin, (err) => {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/admin/foods")
        }
    })
}
//---------------------------- Delete Foods GET ------------------------
module.exports.deleteFoodsGet = async (req, res) => {
    const admin = req.session.admin
    const {
        img
    } = await Food.findById(req.params.id)
    toDelete(img)
    await Food.findByIdAndDelete(req.params.id)
    res.redirect("/admin/foods")
}