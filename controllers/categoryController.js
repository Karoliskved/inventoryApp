const Category = require('../models/category');
const Item = require('../models/item');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

// Display list of all category.
exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({}).sort({ name: 1 }).exec();
  res.render('category_list', {
    title: 'category list',
    categories: allCategories,
  });
});

// Display detail page for a specific category.
exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, itemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).sort({ name: 1 }).exec(),
  ]);
  res.render('category_detail', {
    title: 'Category details',
    category: category,
    items: itemsInCategory,
  });
});

// Display category create form on GET.
exports.category_create_get = (req, res, next) => {
  res.render('category_form', {
    title: 'category form',
  });
};

// Handle category create on POST.
exports.category_create_post = [
  body('name', 'Category must contain at least 2 letters')
    .trim()
    .isLength({ min: 2 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category({ name: req.body.name });
    if (!errors.isEmpty()) {
      res.render('category_form', {
        title: 'category form',
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      const categoryExists = await Category.findOne({
        name: req.body.name,
      })
        .collation({ locale: 'en', strength: 2 })
        .exec();
      if (categoryExists) {
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        res.redirect(category.url);
      }
    }
  }),
];

// Display category delete form on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, allItemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, 'name').exec(),
  ]);
  if (category == null) {
    const err = new Error('category not found');
    err.status = 404;
    return next(err);
  }
  res.render('category_delete', {
    title: 'delete category',
    category: category,
    items: allItemsInCategory,
  });
});

// Handle category delete on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, allItemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, 'name').exec(),
  ]);
  if (allItemsInCategory > 0) {
    res.render('category_delete', {
      title: 'delete category',
      category: category,
      items: allItemsInCategory,
    });
    return;
  } else {
    await Category.findByIdAndRemove(req.body.categoryid);
    res.redirect('/inventory/categories');
  }
});

// Display category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();
  if (category == null) {
    const err = new Error('category not found');
    err.status = 404;
    return next(err);
  }
  res.render('category_form', {
    title: 'category update',
    category: category,
  });
});

// Handle category update on POST.
exports.category_update_post = [
  body('name', 'Category must contain at least 2 letters')
    .trim()
    .isLength({ min: 2 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category({ name: req.body.name, _id: req.params.id });
    if (!errors.isEmpty()) {
      res.render('category_form', {
        title: 'category form',
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      const categoryExists = await Category.findOne({
        name: req.body.name,
      })
        .collation({ locale: 'en', strength: 2 })
        .exec();
      if (categoryExists) {
        res.redirect(categoryExists.url);
      } else {
        await Category.findByIdAndUpdate(req.params.id, category);
        res.redirect(category.url);
      }
    }
  }),
];
