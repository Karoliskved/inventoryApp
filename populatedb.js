#! /usr/bin/env node

console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Item = require('./models/item');
const Category = require('./models/category');

const items = [];
const categories = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  await createCategories();
  await createBooks();

  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name) {
  const category = new Category({ name: name });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function itemCreate(index, name, description, amount, price, category) {
  const itemDetail = {
    name: name,
    description: description,
    amount: amount,
    price: price,
  };
  if (category != false) itemDetail.category = category;

  const item = new Item(itemDetail);

  await item.save();
  items[index] = item;
  console.log(`added item: ${name}`);
}

async function createCategories() {
  console.log('Adding Categories');
  await Promise.all([
    categoryCreate(0, 'storage'),
    categoryCreate(1, 'health'),
    categoryCreate(2, 'maintenance'),
  ]);
}

async function createBooks() {
  console.log('Adding Books');
  await Promise.all([
    itemCreate(0, 'healX', 'a healing patch to patch you right up', 20, 5, [
      categories[1],
    ]),
    itemCreate(1, 'box^2', 'a metal box to store everything you need', 100, 3, [
      categories[0],
    ]),
    itemCreate(2, 'visionE', 'allow yourself to see in dark rooms', 25, 10, [
      categories[1],
    ]),
    itemCreate(
      3,
      'wrench',
      'for all your fixing needs in citadel station',
      5,
      50,
      [categories[2]]
    ),
    itemCreate(4, 'welder', 'efficient and reliable!', 20, 27, [categories[2]]),
    itemCreate(5, 'portable inventory', 'fits right in your pocket', 10, 500, [
      categories[0],
    ]),
    itemCreate(6, 'A cart', 'a simple cart to wheel around things', 200, 10, [
      categories[0],
    ]),
  ]);
}
