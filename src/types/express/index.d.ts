// @ts-ignore
declare global {
  namespace Express {
    interface Request {
      usdata?: {
        fk_id_tipo_user?: number,
        id_user?: string|number,
        type_user?:string|number|undefined,
        campass?:string|number,
        fk_id_cat_type_users?: number
      }
    }
  }
}