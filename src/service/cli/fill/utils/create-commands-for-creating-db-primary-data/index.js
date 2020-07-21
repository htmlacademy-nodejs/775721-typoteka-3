'use strict';

const {createInsertCommand} = require(`../create-insert-command`);

exports.createCommandsForCreatingDBPrimaryData = (entities, entityKeyToEntityPropertiesOrder) => {
  const createEntitiesCommands = Object.keys(entities).map((entityKey) => {
    const entity = entities[entityKey];
    const propertiesOrder = entityKeyToEntityPropertiesOrder[entityKey];

    return createInsertCommand({tableName: entityKey, entity, propertiesOrder});
  });

  return createEntitiesCommands.join(`\n\n`);
};
