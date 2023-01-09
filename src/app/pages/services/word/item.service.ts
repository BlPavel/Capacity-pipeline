import { Injectable } from '@angular/core';
import { Paragraph, TextRun, AlignmentType } from "docx";

@Injectable({ providedIn: 'root' })
export class ItemService {
  public create(str: string):Paragraph{
    return new Paragraph({
      alignment: AlignmentType.LEFT,
      style: "standartStyle",
      spacing:{
        before:200,
        after: 80
      },
      children:[
        new TextRun({
          text: str
        })
      ]
    });
  };
};
