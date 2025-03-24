declare module 'json-logic-js' {
  interface JSONLogic {
    apply: (logic: any, data: any) => any;
    add_operation: (name: string, fn: Function) => void;
  }
  
  const jsonLogic: JSONLogic;
  export default jsonLogic;
}