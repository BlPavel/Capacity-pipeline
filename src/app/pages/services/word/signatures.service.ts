import { ElementsService } from '../elements.service';
import { DateService } from './date.service';
import { Injectable } from '@angular/core';
import { Paragraph, TextRun, AlignmentType} from "docx";

@Injectable({
  providedIn: 'root'
})
export class SignaturesService {

  constructor(
    private readonly _el: ElementsService,
    private readonly _date: DateService,
    ){};

  public create(allSignaturse: boolean = true): Paragraph[]{
    const nameChairman = this._el.commonData.nameChairman;
    const nameMember1 = this._el.commonData.nameMember1;
    const nameMember2 = this._el.commonData.nameMember2;
    const nameMember3 = this._el.commonData.nameMember3;
    const paragraph1 = new Paragraph({
      alignment: AlignmentType.LEFT,
      style: "standartStyle",
      spacing:{
        before: 1000
      },
      children:[
        new TextRun({
          text: "Председатель",
        })
      ]
    });
    const paragraph2 = new Paragraph({
      alignment: AlignmentType.LEFT,
      style: "standartStyle",
      children:[
        new TextRun({
          text: "комиссии:",
        }),
        new TextRun({
          text: "                                 ________________     "
        }),
        new TextRun({
          text: nameChairman
        })
      ]
    });
    const paragraph3 = new Paragraph({
      alignment: AlignmentType.LEFT,
      style: "standartStyle",
      spacing:{
        before: 500
      },
      children:[
        new TextRun({
          text: "Члены комиссии:",
        }),
        new TextRun({
          text: "                    ________________     "
        }),
        new TextRun({
          text: nameMember1
        })
      ]
    });
    const paragraph4 = new Paragraph({
      alignment: AlignmentType.LEFT,
      style: "standartStyle",
      spacing:{
        before: 200
      },
      children:[
        new TextRun({
          text: "                                                  ________________     "
        }),
        new TextRun({
          text: nameMember2
        })
      ]
    });
    const paragraph5 = new Paragraph({
      alignment: AlignmentType.LEFT,
      style: "standartStyle",
      spacing:{
        before: 200
      },
      children:[
        new TextRun({
          text: "                                                  ________________     "
        }),
        new TextRun({
          text: nameMember3
        })
      ]
    });
    const paragraph6 = new Paragraph({
      alignment: AlignmentType.LEFT,
      style: "standartStyle",
      spacing:{
        before: 300
      },
      children:[
        new TextRun({
          text: this._date.getDay() +
          "." + this._date.getMounth() + "."
          + this._date.getYear() + " г."
        })
      ]
    });
    let result: Paragraph[] = [paragraph1, paragraph2, paragraph3];
    if(nameMember2) result.push(paragraph4);
    if(nameMember3) result.push(paragraph5);
    result.push(paragraph6);
    if(allSignaturse) return result;
    else return [paragraph1, paragraph2];
  };
};
