'use strict';

exports.createCategories = ({names}) => names.map((name, index) => {
  const id = index + 1;

  return {
    id,
    title: name,
  };
});
