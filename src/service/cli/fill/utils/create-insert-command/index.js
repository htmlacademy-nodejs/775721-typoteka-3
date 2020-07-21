'use strict';

const {createValues} = require(`../create-values`);

exports.createInsertCommand = ({tableName, entity, propertiesOrder}) => {
  const values = createValues(entity, propertiesOrder);

  return `--Add ${ tableName }\nINSERT INTO ${ tableName } VALUES\n${ values.join(`,\n`) };`;
};
