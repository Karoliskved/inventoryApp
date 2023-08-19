const Item = require('../models/item');
const Category = require('../models/category');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.index = asyncHandler(async (req, res, next) => {
  res.render('index', { title: 'Express' });
});
// Display list of all item.
exports.item_list = asyncHandler(async (req, res, next) => {
  const items = await Item.find({})
    .sort({ name: 1 })
    .populate('category')
    .exec();
  res.render('item_list', {
    title: 'item list',
    items: items,
  });
});

// Display detail page for a specific item.
exports.item_detail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate('category').exec();
  res.render('item_detail.pug', {
    title: 'item details',
    item: item,
  });
});

// Display item create form on GET.
exports.item_create_get = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({}).sort({ name: 1 }).exec();
  res.render('item_form', {
    title: 'item form',
    categories: categories,
  });
});

// Handle item create on POST.
exports.item_create_post = [
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (typeof req.body.category === 'undefined') req.body.category = [];
      else req.body.category = new Array(req.body.category);
    }
    next();
  },
  body('name', 'name must contain at least 2 letters')
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body('description', 'description must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('amount', 'amount must not be empty and greater equal or greater 0')
    .trim()
    .isLength({ min: 1 })
    .isInt({ min: 0 })
    .escape(),
  body('price', 'price must not be empty and greater than 0.00')
    .trim()
    .isFloat({ min: 0.01 })
    .escape(),
  body('category.*').escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);
    const categories = await Category.find({}).sort({ name: 1 }).exec();
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      amount: req.body.amount,
      price: req.body.price,
      category: req.body.category,
    });
    if (!errors.isEmpty()) {
      res.render('item_form', {
        title: 'item form',
        item: item,
        categories: categories,
        errors: errors.array(),
      });
      return;
    } else {
      const itemExists = await Item.findOne({
        name: req.body.name,
      })
        .collation({ locale: 'en', strength: 2 })
        .exec();
      if (itemExists) {
        res.redirect(itemExists.url);
      } else {
        await item.save();
        res.redirect(item.url);
      }
    }
  }),
];

// Display item delete form on GET.
exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec();
  if (item == null) {
    const err = new Error('item not found');
    err.status = 404;
    return next(err);
  }
  res.render('item_delete', {
    title: 'delete item',
    item: item,
  });
});

// Handle item delete on POST.
exports.item_delete_post = asyncHandler(async (req, res, next) => {
  await Item.findByIdAndRemove(req.body.itemid);
  res.redirect('/inventory/items');
});

// Display item update form on GET.
exports.item_update_get = asyncHandler(async (req, res, next) => {
  const [categories, item] = await Promise.all([
    Category.find().exec(),
    Item.findById(req.params.id).populate('category').exec(),
  ]);
  if (item == null) {
    const err = new Error('Item not found');
    err.status = 404;
    return next(err);
  }
  for (const category of categories) {
    for (const itemCategory of item.category) {
      if (category._id.toString() === itemCategory._id.toString()) {
        category.checked = 'true';
      }
    }
  }
  console.log(item.price.toString());
  res.render('item_form', {
    title: 'item update',
    item: item,
    categories: categories,
  });
});

// Handle item update on POST.
exports.item_update_post = [
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (typeof req.body.category === 'undefined') req.body.category = [];
      else req.body.category = new Array(req.body.category);
    }
    next();
  },
  body('name', 'name must contain at least 2 letters')
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body('description', 'description must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('amount', 'amount must not be empty and greater equal or greater 0')
    .trim()
    .isLength({ min: 1 })
    .isInt({ min: 0 })
    .escape(),
  body('price', 'price must not be empty and greater than 0.00')
    .trim()
    .isFloat({ min: 0.01 })
    .escape(),
  body('category.*').escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);
    const categories = await Category.find({}).sort({ name: 1 }).exec();
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      amount: req.body.amount,
      price: req.body.price,
      category: req.body.category,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      res.render('item_form', {
        title: 'item form',
        item: item,
        categories: categories,
        errors: errors.array(),
      });
      return;
    } else {
      const itemExists = await Item.findOne({
        name: req.body.name,
      })
        .collation({ locale: 'en', strength: 2 })
        .exec();
      if (itemExists) {
        res.redirect(itemExists.url);
      } else {
        await Item.findByIdAndUpdate(req.params.id, item);
        res.redirect(item.url);
      }
    }
  }),
];
exports.item_photo_get = asyncHandler(async (req, res, next) => {
  res.render('item_add_photo');
});
exports.item_photo_post = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate('category').exec();
  const newItem = new Item({
    ...item,
    photoURL: '/' + req.file.filename,
    _id: req.params.id,
  });
  console.log(req.file);
  await Item.findByIdAndUpdate(req.params.id, newItem);
  res.redirect(item.url);
});
