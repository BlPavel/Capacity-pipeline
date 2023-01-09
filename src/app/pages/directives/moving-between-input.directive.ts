import { Directive, ElementRef, HostListener } from '@angular/core';
import { MovingBetweenInput } from '../interfaces/moving-between-input.interface';

@Directive({
  selector: '[movingBetweenInput]'
})
export class MovingBetweenInputDirective {
  constructor(private _el: ElementRef) {}

  @HostListener('keydown', ["$event"])
  onKeydown(event: KeyboardEvent){
    const code = event.code
    const inputs: HTMLCollection = this._el.nativeElement.querySelectorAll('input')
    const target: HTMLElement = event.target as HTMLElement
    const parent: ParentNode | null = target.parentNode
    const quantityColumn: number | undefined = parent?.querySelectorAll('input').length
    let numberInput: number = -1
    for (let i = 0; i < inputs.length; i++){
      if(inputs[i] === target){
        numberInput = i
        break
      }
    }
    const quantityRow: number | undefined = typeof(quantityColumn)=== "number" ?
    inputs.length / quantityColumn: undefined

    const dataForMoving: MovingBetweenInput = {
      code, numberInput, event, inputs,
      quantityColumn, quantityRow
    }

    this._movesBetweenInput(dataForMoving)
  }

  private _movesBetweenInput(dataForMoving: MovingBetweenInput): void {
    if(dataForMoving.code === 'ArrowDown'){
      dataForMoving.event.preventDefault()
      this._movesDown(dataForMoving)
    }
    if(dataForMoving.code === 'ArrowUp'){
      dataForMoving.event.preventDefault()
      this._movesUp(dataForMoving)
    }
    if(dataForMoving.code === 'ArrowRight'){
      dataForMoving.event.preventDefault()
      this._movesRight(dataForMoving)
    }
    if(dataForMoving.code === 'ArrowLeft'){
      dataForMoving.event.preventDefault()
      this._movesLeft(dataForMoving)
    }
  }

  private _movesDown(dataForMoving: MovingBetweenInput): void{
    if (dataForMoving.quantityRow && dataForMoving.quantityColumn){
      const isNotLastRow: boolean =
      dataForMoving.inputs.length - dataForMoving.numberInput >
      dataForMoving.quantityColumn ? true : false
      if(isNotLastRow){
        const focusInput: HTMLElement =
        dataForMoving.inputs[dataForMoving.numberInput +
          dataForMoving.quantityColumn] as HTMLElement
        focusInput.focus()
      }
    }
  }

  private _movesUp(dataForMoving: MovingBetweenInput): void{
    if (dataForMoving.quantityRow && dataForMoving.quantityColumn){
      const isNotFirstRow: boolean =
      dataForMoving.inputs.length - dataForMoving.numberInput <=
      dataForMoving.inputs.length - dataForMoving.quantityColumn
      ? true : false
      if(isNotFirstRow){
        const focusInput: HTMLElement =
        dataForMoving.inputs[dataForMoving.numberInput -
          dataForMoving.quantityColumn] as HTMLElement
        focusInput.focus()
      }
    }
  }

  private _movesRight(dataForMoving: MovingBetweenInput): void{
    if (dataForMoving.quantityRow && dataForMoving.quantityColumn){
      const isNotLastInput: boolean =
      dataForMoving.inputs.length - (dataForMoving.numberInput + 1) === 0
      ? false : true
      if(isNotLastInput){
        const focusInput: HTMLElement =
        dataForMoving.inputs[dataForMoving.numberInput + 1] as HTMLElement
        focusInput.focus()
      }
    }
  }

  private _movesLeft(dataForMoving: MovingBetweenInput): void{
    if (dataForMoving.quantityRow && dataForMoving.quantityColumn){
      const isNotLastInput: boolean = dataForMoving.numberInput === 0
      ? false : true
      if(isNotLastInput){
        const focusInput: HTMLElement =
        dataForMoving.inputs[dataForMoving.numberInput - 1] as HTMLElement
        focusInput.focus()
      }
    }
  }
}
