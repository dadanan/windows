/**
 * 规范前端代码，将可能报错的地方都抛出到控制台，后续会统一弹出，提示用户
 */

export const log = msg => console.log(msg)
export const debug = msg => console.debug(msg)
export const info = msg => console.info(msg)
export const warn = msg => console.warn(msg)
export const error = msg => console.error(msg)
