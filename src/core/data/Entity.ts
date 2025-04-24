const entityMetadata = new Map<Function, any>()

interface EntityConfig {
  modelo: string
  tabla?: string
  conexion?: string
}

export function Entity (config?: EntityConfig[]) {
  return function<T extends new (...args: any[]) => object>(constructor: T) {
    Reflect.defineMetadata('entity:details', config ?? [], constructor)
    Reflect.defineMetadata('class:type', 'entity', constructor)
  }
}

export function Column<T> (options: {
  unique?: boolean,
  length?: number,
  required?: boolean,
  defaultValue?: string | number | boolean | any[] | 'CURRENT_TIMESTAMP',
  arrayType?: 'number' | 'string' | 'array' | 'boolean' | 'object' | 'float' | 'date'
  type? : 'float'
} = {}) {
  return function (target: any, propertyKey: keyof T) {
    const tipo = Reflect.getMetadata('design:type', target, propertyKey.toString()).name.toLowerCase()

    const meta = Reflect.getMetadata('entity:columns', target) || { columns: [], requiredCols: [] }
    // const metadata = entityMetadata.get(target.constructor) || { columns: [], requiredCols: [] }

    if (meta.columns.find((column: any) => column.name === propertyKey)) throw new Error(`Propiedad duplicada: ${propertyKey.toString()} en clase ${target.constructor.name}`)

    if (options.required) {
      meta.requiredCols.push(propertyKey)
    }

    meta.columns.push({
      type: tipo,
      name: propertyKey,
      ...options
    })

    Reflect.defineMetadata('entity:columns', meta, target)
    // entityMetadata.set(target.constructor, metadata)
  }
}

export function PrimaryKey (options: {
  autoincrement?: boolean
} = {}) {
  return function (target: any, propertyKey: string) {
    const meta = Reflect.getMetadata('entity:columns', target) || { columns: [], requiredCols: [] }
    // const metadata = entityMetadata.get(target.constructor) || { columns: [], requiredCols: [] }

    if (meta.primaryKey) throw new Error(`Ya hay una llave primaria para la clase ${target.constructor.name}`)

    meta.autoincrementPK = options.autoincrement ?? false
    meta.primaryKey = propertyKey

    Reflect.defineMetadata('entity:columns', meta, target)
  }
}

export function BelongsTo (entityOwner: any, options: {
  targetKey?: string
}) {
  return function (target: any, propertyKey: string) {
    const meta = Reflect.getMetadata('entity:relationships', target) || { belongsTo: [] }
    const cols = Reflect.getMetadata('entity:columns', target) || { columns: [], requiredCols: [] }

    const existingColumn = cols.columns.find((col: any) => col.name === propertyKey)
    if (!existingColumn) {
      cols.columns.push({ name: propertyKey, relationship: true })
    } else {
      cols.columns = cols.columns.map((col: any) => col.name === propertyKey ? { ...col, relationship: true } : col)
    }

    meta.push({
      propertyKey: propertyKey,
      targetKey: options.targetKey ?? '',
      entityTarget: entityOwner
    })

    Reflect.defineMetadata('entity:columns', cols, target)
    Reflect.defineMetadata('entity:relationships', meta, target)
  }
}

export function HasOne (entityTarget: any, options: {
  foreignKey?: string
}) {
  return function (target: any, propertyKey: string) {
    const meta = Reflect.getMetadata('entity:relationships', target) || { hasOne: [] }
    const cols = Reflect.getMetadata('entity:columns', target) || { columns: [], requiredCols: [] }

    const existingColumn = cols.columns.find((col: any) => col.name === propertyKey)
    if (!existingColumn) {
      cols.columns.push({ name: propertyKey, relationship: true })
    } else {
      cols.columns = cols.columns.map((col: any) => col.name === propertyKey ? { ...col, relationship: true } : col)
    }

    meta.hasOne.push({
      propertyKey,
      foreignKey: options.foreignKey ?? '',
      entityTarget
    })

    Reflect.defineMetadata('entity:columns', cols, target)
    Reflect.defineMetadata('entity:relationships', meta, target)
  }
}

export function HasMany (entityTarget: any, options: {
  foreignKey?: string
}) {
  return function (target: any, propertyKey: string) {
    const meta = Reflect.getMetadata('entity:relationships', target) || { hasMany: [] }
    const cols = Reflect.getMetadata('entity:columns', target) || { columns: [], requiredCols: [] }

    const existingColumn = cols.columns.find((col: any) => col.name === propertyKey)
    if (!existingColumn) {
      cols.columns.push({ name: propertyKey, relationship: true })
    } else {
      cols.columns = cols.columns.map((col: any) => col.name === propertyKey ? { ...col, relationship: true } : col)
    }

    meta.hasMany.push({
      propertyKey,
      foreignKey: options.foreignKey ?? '',
      entityTarget
    })

    Reflect.defineMetadata('entity:columns', cols, target)
    Reflect.defineMetadata('entity:relationships', meta, target)
  }
}

export function ManyToMany (entityTarget: any, options: { through?: string }) {
  return function (target: any, propertyKey: string) {
    const meta = Reflect.getMetadata('entity:relationships', target) || { manyToMany: [] }
    const cols = Reflect.getMetadata('entity:columns', target) || { columns: [], requiredCols: [] }

    const existingColumn = cols.columns.find((col: any) => col.name === propertyKey)
    if (!existingColumn) {
      cols.columns.push({ name: propertyKey, relationship: true })
    } else {
      cols.columns = cols.columns.map((col: any) => col.name === propertyKey ? { ...col, relationship: true } : col)
    }

    meta.manyToMany.push({
      propertyKey,
      through: options.through ?? '',
      entityTarget
    })

    Reflect.defineMetadata('entity:columns', cols, target)
    Reflect.defineMetadata('entity:relationships', meta, target)
  }
}

export function getEntityMetadata (entity: Function) {
  return entityMetadata.get(entity)
}