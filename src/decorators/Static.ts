/**
 * Decorador que convierte una clase en estática, evitando que pueda ser instanciada
 *
 * @template T - El tipo de la clase que se va a decorar.
 * @param {T} ctr - El constructor de la clase que se va a decorar.
 * @returns {T} - Una nueva clase que extiende la clase original y desactiva la instanciación
 */
function Static<T extends new (...args: any[]) => any>(ctr: T):T {
  return class extends ctr {
    /**
     * Sobreescribe el constructor de la clase para lanzar un error al intentar instanciarla.
     *
     * @param {...any[]} args - Los argumentos que se pasan al constructor.
     * @throws {Error} - Siempre lanza un error al intentar instanciar la clase.
     */
    // @ts-ignore
    constructor (...args: any[]) {
      throw new Error('No se puede instanciar esta clase')
    }
  }
}

export default Static
