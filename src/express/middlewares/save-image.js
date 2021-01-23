'use strict';

const path = require(`path`);

const fs = require(`fs`).promises;

const {DirName} = require(`../constants`);

const ALLOW_TYPES = [`image/jpeg`, `image/png`];

exports.saveImage = (imageName) => async (req, res, next) => {
  const image = req.files[imageName];

  if (!image) {
    return next();
  }

  const {type, size, path: imagePath, name} = image;
  const isCorrectType = ALLOW_TYPES.includes(type);
  const isImageInvalid = size === 0 && !isCorrectType;

  if (isImageInvalid) {
    fs.unlink(imagePath);

    return next();
  }

  try {
    const newPath = path.resolve(__dirname, `../${DirName.PUBLIC}/img/${name}`);

    await fs.rename(imagePath, newPath);

    res.locals.imageName = name;
  } catch (error) {
    return next(error);
  }

  return next();
};
