/**
 * for download library docx:
 * first: npm install --save docx
 * second: npm i --save-dev @types/file-saver
 */
import { GraduationPipelineListService } from './lists/graduation-pipeline-list.service';
import { ProtokolListsService } from './lists/protokol-lists.service';
import { SeparationListService } from './lists/separation-list.service';
import { TitleListService } from './lists/title-list.service';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { Document, Packer } from "docx";
import { ElementsService } from '../elements.service';

@Injectable({ providedIn: 'root' })
export class WordService {

  constructor(
    private readonly _titleList: TitleListService,
    private readonly _separationList: SeparationListService,
    private readonly _protokolLists: ProtokolListsService,
    private readonly _graduationList: GraduationPipelineListService,
    private readonly _el: ElementsService
    ){};

  private _createDocument(){
    const doc = new Document({
      styles:{
        paragraphStyles:[
          {
            id: "standartStyle",
            name: "Standart style",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              size: 24
            },
            paragraph: {
                spacing: {
                    line: 276,
                },
            },
          },
        ]
      },
      sections:[
        ...this._titleList.createList(),
        ...this._separationList.createList(),
        ...this._protokolLists.createLists(),
        ...this._graduationList.createList()
      ]
    });
    return doc;
  };

  public save(){
    const nameDoc: string = this._el.commonData.name
    Packer.toBlob(this._createDocument()).then(blob => {
      saveAs(blob, `${nameDoc}.docx`);
    });
  };
};

































// const doc = new Document({
    //   sections: [
    //     {
    //       properties:{
    //         page:{
    //           size:{
    //             orientation: PageOrientation.LANDSCAPE
    //           }
    //         }
    //       },
    //       children: [
    //         new Paragraph({
    //           alignment: AlignmentType.RIGHT,
    //           children:[
    //             new TextRun({
    //               text: "Утверждаю",
    //               size: 24
    //             }),
    //           ]
    //         }),
    //       ]
    //     },
    //     {
    //       properties:{
    //         page:{
    //           size:{
    //             orientation: PageOrientation.LANDSCAPE
    //           }
    //         }
    //       },
    //       children: [
    //         new Paragraph({
    //           alignment: AlignmentType.RIGHT,
    //           children:[
    //             new TextRun({
    //               text: "Утверждаю",
    //               size: 24
    //             }),
    //           ]
    //         }),
    //       ]
    //     },
    //   ],
    // })
    // return doc
  // }


  // }
