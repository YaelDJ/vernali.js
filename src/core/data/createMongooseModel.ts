import { Schema, Model, Connection, Types } from 'mongoose'

const MONGOOSE_TYPES: Record<string, any> = {
  'string': String,
  'number': Number,
  'boolean': Boolean,
  'date': Date,
  'object': Object,
  'float': Number,
  'array': Types.Array
}

export function createMongooseModel<T extends Document> (
  entity: new () => T,
  connection: Connection
): Model<T> {
  const metadata = Reflect.getMetadata('entity:columns', entity)
  const modelName = Reflect.getMetadata('modelo:nombre', entity)
  const collectionName = Reflect.getMetadata('modelo:tabla', entity)

  if (!metadata) throw new Error('La clase proporcionada no corresponde a un modelo')

  const schemaDefinition: Record<string, any> = {}

  metadata.columns.forEach((column: any) => {
    const fieldConfig: Record<string, any> = {
      type: null,
      required: column.required || false,
      unique: column.unique || false
    }

    if (column.type === 'array') {
      if (!column.arrayType) throw new Error(`Debes especificar el tipo del arreglo en la columna ${column.name}`)
      fieldConfig.type = [MONGOOSE_TYPES[column.arrayType]]
    } else {
      fieldConfig.type = MONGOOSE_TYPES[column.type]
    }

    if (column.defaultValue) {
      if (column.defaultValue === 'CURRENT_TIMESTAMP') {
        fieldConfig.default = Date.now
      } else {
        fieldConfig.default = column.defaultValue
      }
    }

    schemaDefinition[column.name] = fieldConfig
  })

  const schemaOptions = {
    collection: collectionName,
    timestamps: false,
    versionKey: false
  }

  const schema = new Schema(schemaDefinition, schemaOptions)
  return connection.model<T>(modelName, schema)
}