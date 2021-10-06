import { Injectable, Inject, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Buffer  } from 'buffer';

import Flatten from '@flatten-js/core'
const {Point, Vector, Circle, Line, Ray, Segment, Arc, Box, Polygon, Matrix, PlanarSet} = Flatten;

//import { Parser } from 'binary-parser';
// import { BigInteger } from 'javascript-biginteger';
import * as parser from 'binary-parser';
import { Observable } from 'rxjs';
const Parser = parser.Parser;

declare var LineUs: any;

const drawableArea : any = new Box( 0, 0, 1125, 2000 );
const safeMargin = 40;
const safeArea : any = new Box( 
    safeMargin,
    safeMargin, 
    (drawableArea.xmax-drawableArea.xmin) - (safeMargin*2),
    (drawableArea.ymax-drawableArea.ymin) - (safeMargin*2)
);
const qdDrawingSize : any = new Box( 0, 0, 255.0, 255.0 );


const Drawing = Parser.start()
  .endianess('little')
  .array('key_id', {
      type: 'uint8',
      length: 8
  })
  .string('countrycode', { length: 2, encoding: 'ascii' })
  // .uint8('recognized')
  .bit1('recognized')
  .uint32le('timestamp') // unix timestamp in seconds
  .uint16le('n_strokes')
  .array('strokes', {
    type: Parser.start()
      .uint16le('n_points')
      .array('x', {
        type: 'uint8',
        length: 'n_points'
      })
      .array('y', {
        type: 'uint8',
        length: 'n_points'
      }),
    length: 'n_strokes'
  });

const big256 = BigInt(256);
  class BinaryParser {
    
    parseBinaryDrawings( buffer: any ) {
        var unpacked = Parser.start()
        .array('drawings', {
            type: Drawing,
            // length: 2
            readUntil: 'eof'
        }).parse(buffer);
      //console.log("unpacked", unpacked)
      var drawings = unpacked.drawings.map(function(d:any) {
        var ka = d.key_id;
        // the key is a long integer so we have to parse it specially
        // var key = BigInteger(0);
        var key = BigInt(0);
        for (var i = 7; i >= 0; i--) {
            key = key * big256;
            key = key + BigInt(ka[i]);
        }
        var strokes = d.strokes.map(function(d:any,i:any) { return [ d.x, d.y ] });
        return {
          'key_id': key.toString(),
          'countrycode': d.countrycode,
          'recognized': !!d.recognized, //convert to boolean
          'timestamp': d.timestamp * 1000, // turn it into milliseconds
          'drawing': strokes
        }
      })
      return drawings;
    }
}


@Injectable()
export class LineUsService implements OnDestroy, OnInit {

    _bot : any = null;
    _parser : BinaryParser;
    botEnabled : boolean = true;
    onStatusMessage : any = null;
    botAddress : string = "linef-us.local";

    constructor(private httpClient: HttpClient) {
        this._parser = new BinaryParser();
    }

    ngOnInit() {
        console.log('Service ngOnInit');
    }

    ngOnDestroy() {
        console.log('Service ngOnDestroy');
    }

    updateStatus( status :string ){
        if( this.onStatusMessage != null ) this.onStatusMessage( status );
    }

    getBot() {

        if( this._bot && this._bot.state == "disconnected" ){
            this._bot = null;
        }

        if( !this._bot ){

            const opts = {
                url: 'ws://' + this.botAddress,
                autoConnect: true,
                autoStart: true,
                concurrency: 3
            };

            this._bot = new LineUs({ opts });
        }

        return this._bot

    }

    makeRandomDrawingForCategory( category: string, mode: string, callback?:any ){

        if( mode == 'binary' ){

            this.fetchBinaryDataForCategory( category, (data: any) => {
                const drawing = this.randomElement( data );
                const strokes = this.sendDrawingToBot( drawing );
                callback( strokes );
            });

        } else {

            this.fetchJSONDataForCategory( category, (data: any) => {
                const drawing = this.extractRandomDrawingFromJSONData( data );
                const strokes = this.sendDrawingToBot( drawing );
                callback( strokes );
            });

        }
    }

    proxiedURL( url:string, raw?: boolean ){
        let proxyURL = "https://api.allorigins.win/";
        proxyURL += raw ? "raw" : "get"; 
        return proxyURL + "?url=" + encodeURIComponent(url);
    }

    fetchBinaryDataForCategory( category: string, callback: any ) {
        category = encodeURIComponent( category );
        const proxiedURL = this.proxiedURL(
            `https://quickdraw_dataset.storage.googleapis.com/full/binary/${category}.bin`,
            true
        );
        this.updateStatus( "Fetching binary data..." )

        this.httpClient.get(
            proxiedURL, {
                responseType: "arraybuffer"
            }
        ).subscribe(data => {
            const parsed = this.parseBinaryData( data );
            callback( parsed );
        })
    }

    parseBinaryData( data: any ){
        this.updateStatus("Parsing binary data...");
        const buf = Buffer.from( data );
        return this._parser.parseBinaryDrawings( buf );
    }

    fetchJSONDataForCategory( category: string, callback?: any ) {
        category = encodeURIComponent( category );
        const proxiedURL = this.proxiedURL(
            `https://quickdraw_dataset.storage.googleapis.com/full/simplified/${category}.ndjson`
        );

        this.updateStatus( "Fetching JSON data..." )

        this.httpClient.get(proxiedURL).subscribe(data => {
            callback( data );
        })
    }

    extractRandomDrawingFromJSONData( data: any ){
        const lines = data.contents.split( "\n" );
        const line: string = this.randomElement( lines );
        return JSON.parse( line );
    }

    sendDrawingToBot( drawingItem :any ){

        this.updateStatus( "Sending drawing to bot..." );

        const scaleFactor : number = (safeArea.xmax - safeArea.xmin) / (qdDrawingSize.xmax - qdDrawingSize.xmin);
        const offsetY : number = safeArea.center.y - ( (qdDrawingSize.ymax-qdDrawingSize.ymin)*scaleFactor*0.5)


        // use this arr to keep track of strokes as drawn
        const strokesDrawn = [];
        
        const strokes = this.preProcessDrawing( drawingItem.drawing );
        const bot = this.botEnabled ? this.getBot() : null;

        for( var i=0; i< strokes.length; i++ ){
            const stroke = strokes[i];
            const scaled = this.scaleStroke( stroke, scaleFactor );

            const strokeDrawn = [];

            for( var ii=0; ii< scaled.length; ii++ ) {
                const p = scaled[ ii ];

                // preprocess this point
                p[0] += safeArea.xmin;
                p[1] += safeArea.ymin + offsetY;

                if( this.botEnabled ){
                    // format this point for the line-us library
                    const xy = { x: p[0], y : p[1] };
                    
                    if( ii == 0 ) bot.moveTo( xy );
                    else bot.lineTo( xy );
                }

                // add the point as drawn to the current strokeDrawn array
                strokeDrawn.push( p ); 
            }

            strokesDrawn.push( strokeDrawn );
        }

        if( this.botEnabled ) bot.home();

        // return the strokes we actually drew
        return( strokesDrawn );
    }

    scaleStroke( stroke: any, scaleFactor : any ){
        const scaled : any = [];
        for( const p of stroke ){
            scaled.push([
                p[0] * scaleFactor,
                p[1] * scaleFactor
            ]);
        }
        return scaled;
    }

    preProcessDrawing( drawing: any ){

        // drawing is an array of strokes
        // a stroke is a 2-element array: stroke[0] is x-coords, stroke[1] is y-coords

        const strokesOut : any = [];

        for( const stroke of drawing ){
            // zip x and y arrays into array of [x,y] pairs
            const zipped = this.zip( stroke[0], stroke[1] );
            strokesOut.push( zipped );
        }

        return strokesOut;
    }

    zip( arr1:any, arr2:any ){
        /*
        Given two arrays, returns an array of 2-element arrays in the format:
            [ 
                [arr1[0], arr2[0]],
                [arr1[1], arr2[1]],
                ...
            ]
        */
        return arr1.map(function(e:any, i:any) {
            return [e, arr2[i]];
        });
    }

    randomElement( container: any ) {
        return container[ Math.floor(container.length * Math.random()) ];
    }

    wave(){
        
        if( !this.botEnabled ) return;
        
        const bot = this.getBot();

        bot.penUp();
        bot.moveTo({x:0,y:0});
        bot.moveTo({x:drawableArea.xmax,y:0});
        bot.home();
    }

}