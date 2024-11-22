const fileName = (oldFileName) => {
  return `${oldFileName}.entity`;
};

const relationName = (relation) => {
  const columnOldName = relation.fieldName.split('_pkid')[0];

  return columnOldName.replace(/_([a-z])/g, (_, letter) =>
    letter.toUpperCase(),
  );
};

const relationIdName = (relationId) => {
  const columnOldName = relationId.fieldName;

  return columnOldName;
};

module.exports = {
  fileName,
  relationName,
  relationIdName,
};
