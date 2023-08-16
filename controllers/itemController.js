const item = require('../models/item');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.index = asyncHandler(async (req, res, next) => {});
// Display list of all item.
exports.item_list = asyncHandler(async (req, res, next) => {});

// Display detail page for a specific item.
exports.item_detail = asyncHandler(async (req, res, next) => {});

// Display item create form on GET.
exports.item_create_get = (req, res, next) => {};

// Handle item create on POST.
exports.item_create_post = asyncHandler(async (req, res, next) => {});

// Display item delete form on GET.
exports.item_delete_get = asyncHandler(async (req, res, next) => {});

// Handle item delete on POST.
exports.item_delete_post = asyncHandler(async (req, res, next) => {});

// Display item update form on GET.
exports.item_update_get = asyncHandler(async (req, res, next) => {});

// Handle item update on POST.
exports.item_update_post = asyncHandler(async (req, res, next) => {});
