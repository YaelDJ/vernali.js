import { DataTypes, Model, ModelStatic, Sequelize } from 'sequelize'

const SEQUELIZE_TYPES: Record<string, any> = {
  'string': DataTypes.STRING,
  'number': DataTypes.NUMBER,
  'boolean': DataTypes.BOOLEAN,
  'date': 'TIMESTAMP WITHOUT TIME ZONE',
  'object': DataTypes.JSONB,
  'float': DataTypes.FLOAT,
  'array': DataTypes.ARRAY
}

export function createSequelizeModel<T extends object> (
  entity: new () => T,
  sequelize: Sequelize
): ModelStatic<Model> {
  const metadata = Reflect.getMetadata('entity:columns', entity)

  const modelName = Reflect.getMetadata('modelo:nombre', entity)
  const tableName = Reflect.getMetadata('modelo:tabla', entity)

  if (!metadata) throw new Error('La clase proporcionada no corresponde a un modelo')

  const attributes: any = {}

  metadata.columns.forEach((column: any) => {
    if (column.relationship) return

    if (column.defaultValue === 'CURRENT_TIMESTAMP') {
      column.defaultValue = Sequelize.literal('CURRENT_TIMESTAMP')
    }

    attributes[column.name] = {
      type: SEQUELIZE_TYPES[column.type],
      unique: column.unique || false,
      allowNull: column.required || false
    }

    if (column.type === 'array') {
      if (!column.arrayType) throw new Error(`Debes especificar el tipo del arreglo en la columna ${column.name} del la entidad ${entity.name}`)

      attributes[column.name] = {
        type: SEQUELIZE_TYPES['array'](SEQUELIZE_TYPES[column.arrayType])
      }
    }

    if (metadata.primaryKey === column.name) {
      attributes[column.name] = {
        primaryKey: true,
        autoIncrement: metadata.autoincrementPK,
        ...attributes[column.name]
      }
    }
  })

  class GeneratedModel extends Model {}

  GeneratedModel.init(attributes, {
    sequelize,
    modelName: modelName,
    tableName: tableName,
    timestamps: false,
    freezeTableName: true
  })

  const relationships = Reflect.getMetadata('entity:relationships', entity) || {}

  if (relationships.belongsTo) {
    relationships.belongsTo.forEach((relationship: any) => {
      const keys: {foreignKey: string, targetKey?: string } = { foreignKey: relationship.foreignKey }

      if (relationship.targetKey) keys.targetKey = relationship.targetKey

      GeneratedModel.belongsTo(relationship.entityTarget, keys)
    })
  }

  if (relationships.hasOne) {
    relationships.hasOne.forEach((rel: any) => {
      GeneratedModel.hasOne(rel.entityTarget, { foreignKey: rel.foreignKey })
    })
  }

  if (relationships.hasMany) {
    relationships.hasMany.forEach((rel: any) => {
      GeneratedModel.hasMany(rel.entityTarget, { foreignKey: rel.foreignKey })
    })
  }

  if (relationships.manyToMany) {
    relationships.manyToMany.forEach((rel: any) => {
      GeneratedModel.belongsToMany(rel.entityTarget, { through: rel.through })
    })
  }

  return GeneratedModel
}