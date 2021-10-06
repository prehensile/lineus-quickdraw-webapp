import { Component, OnInit } from '@angular/core';

import { LineUsService } from './lineus.service';
import { SpeechService } from './speech.service';

import { categories } from './categories';


interface CategoryOption {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    LineUsService,
    SpeechService
  ]
})

export class AppComponent implements OnInit {

  title = 'lineus-quickdraw-webapp';

  constructor(private lineusService: LineUsService, private speechService: SpeechService) { }

  ngOnInit() {

    // this.lineusService.fetchBinaryData();
    const that = this;
    this.lineusService.onStatusMessage = function (message: any) {
      that.onStatusUpdate(message);
    }

  }

  valSelectCategory = '';
  showActivity = false;
  boolBotEnabled = true;
  botAddress: string = "line-us.local";

  onDrawButtonClick(event?: MouseEvent) {
    if (this.valSelectCategory) {
      this.onCategorySelected(this.valSelectCategory);
    }
  }

  onCategorySelected(category: string) {

    this.lineusService.botAddress = this.botAddress;
    this.lineusService.botEnabled = this.boolBotEnabled;

    this.showActivity = true;

    this.lineusService.makeRandomDrawingForCategory(category, 'json', (strokes: any) => {
      this.onDrawingSelected(strokes);
      this.showActivity = false;
    });

  }

  onStatusUpdate(status: string) {
    const statusItem: any = document.getElementById('status-display');
    statusItem.innerHTML = status;
    console.log(status);
  }

  onDrawingSelected(strokes: any) {

    var canvas: any = document.getElementById('canvas-drawing');
    if (canvas.getContext) {

      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < strokes.length; i++) {

        const stroke = strokes[i];
        ctx.beginPath();

        for (let ii = 0; ii < stroke.length; ii++) {
          const p = stroke[ii];
          p[0] *= 0.5;
          p[1] *= 0.5;
          if (ii == 0) ctx.moveTo(p[0], p[1]);
          else ctx.lineTo(p[0], p[1]);
        }

        ctx.stroke();
      }
    }

  }

  constructCategories : any = function() {
    const out = [];
    for( const category of categories ){
      out.push(
        {value: category, viewValue: category }
      )
    }
    return out;
  }

  categories: CategoryOption[] = this.constructCategories();

}