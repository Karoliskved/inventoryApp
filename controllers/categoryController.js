const category = require('../models/category');
const Item = require('../models/item');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

// Display list of all category.
exports.category_list = asyncHandler(async (req, res, next) => {});

// Display detail page for a specific category.
exports.category_detail = asyncHandler(async (req, res, next) => {});

// Display category create form on GET.
exports.category_create_get = (req, res, next) => {};

// Handle category create on POST.
exports.category_create_post = asyncHandler(async (req, res, next) => {});

// Display category delete form on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {});

// Handle category delete on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {});

// Display category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {});

// Handle category update on POST.
exports.category_update_post = asyncHandler(async (req, res, next) => {});
