export interface Operation {
  id: string;
  description: string;
  implementation?: Function;
  category: string;
}

export interface OperationCategory {
  name: string;
  operations: Operation[];
}

export interface JSONLogicExpression {
  [key: string]: any;
}

export interface TestData {
  [key: string]: any;
}
