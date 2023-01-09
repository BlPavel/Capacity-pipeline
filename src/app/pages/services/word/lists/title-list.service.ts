import { ElementsService } from '../../elements.service';
import { LocalStorageService } from '../../local-storage.service';
import { DateService } from '../date.service';
import { Injectable } from '@angular/core';
import { Paragraph, TextRun, AlignmentType } from "docx";

@Injectable({ providedIn: 'root' })
export class TitleListService {

  constructor(
    private readonly _date: DateService,
    private readonly _LS: LocalStorageService,
    private readonly _el: ElementsService
    ){};

  public createList(): any[]{
    const sections = [{
      properties: {
        page: {
          margin: {
              top: 1000,
              right: 1000,
              bottom: 1000,
              left: 1500,
          },
        },
      },
      children: [
        ...this._createHeaderTitleList(),
        ...this._createMainTitleList(),
        ...this._createFooterTitleList()
      ]
    }];
    return sections;
  };

  private _createHeaderTitleList(): Paragraph[]{
    const paragraph1 = new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing:{
        after: 150
      },
      style: "standartStyle",
      children:[
        new TextRun({
          text: "УТВЕРЖДАЮ",
          bold: true,
        })
      ]
    });
    const paragraph2 = new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing:{
        after: 100
      },
      style: "standartStyle",
      children:[
        new TextRun({
          text: this._slicePositionAndOrganization('positionHead')[0],
        })
      ]
    });
    const paragraph3 = new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing:{
        after: 100
      },
      style: "standartStyle",
      children:[
        new TextRun({
          text: this._slicePositionAndOrganization('positionHead')[1],
        })
      ]
    });
    const paragraph4 = new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing:{
        after: 100
      },
      style: "standartStyle",
      children:[
        new TextRun({
          text: "____________" + this._el.commonData.nameHead,
        })
      ]
    });
    const paragraph5 = new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing:{
        after: 100
      },
      style: "standartStyle",
      children:[
        new TextRun({
          text: this._date.getDay() + "."
          + this._date.getMounth() + "."
          + this._date.getYear() + " г.",
        })
      ]
    });
    return [paragraph1, paragraph2, paragraph3, paragraph4, paragraph5];
  };

  private _createMainTitleList(): Paragraph[]{
    const namePipeline = this._el.commonData.name
    const paragraph1 = new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing:{
        before: 3000,
        after: 150
      },
      style: "standartStyle",
      children:[
        new TextRun({
          text: "ТАБЛИЦА ВМЕСТИМОСТИ",
          bold: true,
        })
      ]
    })
    const paragraph2 = new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing:{
        after: 150
      },
      style: "standartStyle",
      children:[
        new TextRun({
          text: "НА ТЕХНОЛОГИЧЕСКИЙ НЕФТЕПРОВОД",
          bold: true,
        })
      ]
    })
    const paragraph3 = new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing:{
        after: 2300
      },
      style: "standartStyle",
      children:[
        new TextRun({
          text: namePipeline,
          bold: true,
        })
      ]
    })
    const paragraph4 = new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing:{
        after: 800
      },
      style: "standartStyle",
      children:[
        new TextRun({
          text: "Относительная погрешность определения вместимости ± 0,5%",
        })
      ]
    })
    const paragraph5 = new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing:{
        after: 1700
      },
      style: "standartStyle",
      children:[
        new TextRun({
          text: "Срок очередного определения вместимости: ",
        }),
        new TextRun({
          text: "при изменении параметров технологического нефтепровода",
          underline:{
            color: "000000",
          }
        }),
        new TextRun({
          text: "  " + this._date.getDay() + "."
          + this._date.getMounth() + "."
          + (+this._date.getYear() + +this._el.commonData.interval) + " г.",
          italics: true
        })
      ]
    });
    return [paragraph1, paragraph2, paragraph3, paragraph4, paragraph5];
  };

  private _createFooterTitleList(): Paragraph[]{
    const paragraph1 = new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing:{
        after: 200
      },
      style: "standartStyle",
      children:[
        new TextRun({
          text: "Председатель комиссии:",
        })
      ]
    });
    const paragraph2 = new Paragraph({
      alignment: AlignmentType.RIGHT,
      style: "standartStyle",
      children:[
        new TextRun({
          text: "______________________________",
        })
      ]
    });
    const paragraph3 = new Paragraph({
      alignment: AlignmentType.RIGHT,
      style: "standartStyle",
      children:[
        new TextRun({
          text: this._slicePositionAndOrganization('positionChairman')[0],
        })
      ]
    });
    const paragraph4 = new Paragraph({
      alignment: AlignmentType.RIGHT,
      style: "standartStyle",
      children:[
        new TextRun({
          text: this._slicePositionAndOrganization('positionChairman')[1],
        })
      ]
    });
    const paragraph5 = new Paragraph({
      alignment: AlignmentType.RIGHT,
      style: "standartStyle",
      children:[
        new TextRun({
          text: this._el.commonData.nameChairman,
        })
      ]
    });
    return [paragraph1, paragraph2, paragraph3, paragraph4, paragraph5];
  };

  private _slicePositionAndOrganization(key: string): string[]{
    const positionAndOrganization: string = this._LS.get('commonData')[key]
    const match = positionAndOrganization.match('АО') === null ?
    positionAndOrganization.match('ООО'): positionAndOrganization.match('АО');
    const position = positionAndOrganization.slice(0, match?.index);
    const organization = positionAndOrganization.slice(match?.index, positionAndOrganization.length);
    if(match){
      return [position, organization];
    }
    else{
      return [positionAndOrganization, ""];
    }
  };
};
