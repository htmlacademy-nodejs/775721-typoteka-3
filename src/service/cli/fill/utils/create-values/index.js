'use strict';

module.exports.createValues = (entities, propertiesOrder) => entities.map((entity) => {
  let value = propertiesOrder.map((propertyKey) => {
    const entityValue = entity[propertyKey];

    return typeof entityValue === `string` ? `'${ entityValue }'` : entityValue;
  }).join(`,`);

  return `(${ value })`;
});
