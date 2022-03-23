import { Big } from "big.js";




export function compare(a: string  | number) {

  let opOne = new Big(a)

  return { 
    gt: (opTwo: string  | number) =>  opOne.gt(new Big(opTwo)),
    lt: (opTwo: string  | number) => opOne.lt(new Big(opTwo)),
    gte: (opTwo:string  | number) => opOne.gte(new Big(opTwo)),
    lte: (opTwo:string  | number) => opOne.lte(new Big(opTwo)),
    eq: (opTwo: string  | number) => opOne.eq(new Big(opTwo))
  }
  
}

export function take(a: string) {
  let opOne = new Big(a)

  return {
    times: (opTwo:string | number) => opOne.times(new Big(opTwo)),
    plus: (opTwo:string  | number) => opOne.plus(new Big(opTwo)),
    minus: (opTwo:string  | number) => opOne.minus(new Big(opTwo)),
    div: (opTwo:string  | number) => opOne.div(new Big(opTwo))
  }
}
