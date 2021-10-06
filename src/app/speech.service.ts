import { Injectable, Inject, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';

import { categories } from './categories';

declare var webkitSpeechRecognition: any;
declare var webkitSpeechGrammarList: any;
declare var SpeechRecognition: any;
declare var SpeechGrammarList: any;


@Injectable()
export class SpeechService implements OnDestroy, OnInit {

    _recognition: any = null;

    constructor() {
        // this.beginRecogniser();

        if( webkitSpeechRecognition ){
            SpeechRecognition = webkitSpeechRecognition;
        }
    }

    beginRecogniser(){
        if( !this._recognition ){
            this._recognition = new SpeechRecognition();
            this._recognition.grammars = this.initGrammars();
            this._recognition.continuous = false;
        }

        const that = this;
        this._recognition.onresult = function( event :any ){
            that.onRecognitionResult( event );
        }
        this._recognition.onend = function (event: any) {
            that.onRecognitionEnd( event );
        }

        console.log( "start recognition" );
        this._recognition.start();

        return this._recognition;

    }

    onRecognitionEnd( event: any ){
        console.log( "onRecognitionEnd" );
        console.log( event );

        this.beginRecogniser();
    }

    onRecognitionResult( event : any ){
        console.log( event );
    }

    initGrammars(){
        
        const wakeGrammar = '#JSGF V1.0; grammar wakes; public <wake> = lynus;';
        
        let categoryGrammar = '#JSGF V1.0; grammar categories; public <category> =';
        categoryGrammar += categories.join(" | ") + ";";    

        let grammarList = new SpeechGrammarList();
        grammarList.addFromString( wakeGrammar, 1 );
        grammarList.addFromString( categoryGrammar, 2 );

        return grammarList;
    }

    ngOnInit() {
        console.log('Service ngOnInit');
    }

    ngOnDestroy() {
        console.log('Service ngOnDestroy');
    }

}