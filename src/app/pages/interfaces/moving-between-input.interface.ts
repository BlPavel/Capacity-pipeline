export interface MovingBetweenInput{
  code: string,
  numberInput: number,
  event: KeyboardEvent,
  inputs: HTMLCollection,
  quantityColumn: number | undefined,
  quantityRow: number | undefined,
};
