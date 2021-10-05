import { Component, OnInit } from '@angular/core';
import { LineUsService } from './lineus.service';


interface CategoryOption {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers : [LineUsService]
})

export class AppComponent implements OnInit {
  
  title = 'lineus-quickdraw-webapp';

  constructor(private lineusService: LineUsService) { }

  ngOnInit() {

    // this.lineusService.fetchBinaryData();
    const that = this;
    this.lineusService.onStatusMessage = function( message :any ){
      that.onStatusUpdate( message );
    }
    
  }

  valSelectCategory = '';
  showActivity = false;
  boolBotEnabled = true;
  botAddress : string = "line-us.local";

  onDrawButtonClick( event?: MouseEvent ) {  
    if( this.valSelectCategory ){
      this.onCategorySelected( this.valSelectCategory );
    }
  }

  onCategorySelected( category: string ){

    this.lineusService.botAddress = this.botAddress;
    this.lineusService.botEnabled = this.boolBotEnabled;

    this.showActivity = true;

    this.lineusService.makeRandomDrawingForCategory( category, (strokes:any) =>{
      this.onDrawingSelected( strokes );
      this.showActivity = false;
    } );

  }

  onStatusUpdate( status:string ){
    const statusItem : any = document.getElementById('status-display');
    statusItem.innerHTML = status;
    console.log( status );
  }

  onDrawingSelected( strokes: any ){

    var canvas : any = document.getElementById('canvas-drawing');
    if (canvas.getContext) {
      
      var ctx = canvas.getContext('2d');
      ctx.clearRect( 0, 0, canvas.width, canvas.height );

      for( var i=0; i< strokes.length; i++ ){
      
        const stroke = strokes[i];
        ctx.beginPath();
        
        for (let ii = 0; ii < stroke.length; ii++) {
          const p = stroke[ii];
          p[0] *= 0.5;
          p[1] *= 0.5;
          if( ii == 0 ) ctx.moveTo( p[0], p[1] );
          else ctx.lineTo( p[0], p[1] );
        }
        
        ctx.stroke();
      }
    }


    
  }
  
  categories: CategoryOption[] = [
    {value: 'aircraft carrier', viewValue: 'aircraft carrier'},
    {value: 'airplane', viewValue: 'airplane'},
    {value: 'alarm clock', viewValue: 'alarm clock'},
    {value: 'ambulance', viewValue: 'ambulance'},
    {value: 'angel', viewValue: 'angel'},
    {value: 'animal migration', viewValue: 'animal migration'},
    {value: 'ant', viewValue: 'ant'},
    {value: 'anvil', viewValue: 'anvil'},
    {value: 'apple', viewValue: 'apple'},
    {value: 'arm', viewValue: 'arm'},
    {value: 'asparagus', viewValue: 'asparagus'},
    {value: 'axe', viewValue: 'axe'},
    {value: 'backpack', viewValue: 'backpack'},
    {value: 'banana', viewValue: 'banana'},
    {value: 'bandage', viewValue: 'bandage'},
    {value: 'barn', viewValue: 'barn'},
    {value: 'baseball', viewValue: 'baseball'},
    {value: 'baseball bat', viewValue: 'baseball bat'},
    {value: 'basket', viewValue: 'basket'},
    {value: 'basketball', viewValue: 'basketball'},
    {value: 'bat', viewValue: 'bat'},
    {value: 'bathtub', viewValue: 'bathtub'},
    {value: 'beach', viewValue: 'beach'},
    {value: 'bear', viewValue: 'bear'},
    {value: 'beard', viewValue: 'beard'},
    {value: 'bed', viewValue: 'bed'},
    {value: 'bee', viewValue: 'bee'},
    {value: 'belt', viewValue: 'belt'},
    {value: 'bench', viewValue: 'bench'},
    {value: 'bicycle', viewValue: 'bicycle'},
    {value: 'binoculars', viewValue: 'binoculars'},
    {value: 'bird', viewValue: 'bird'},
    {value: 'birthday cake', viewValue: 'birthday cake'},
    {value: 'blackberry', viewValue: 'blackberry'},
    {value: 'blueberry', viewValue: 'blueberry'},
    {value: 'book', viewValue: 'book'},
    {value: 'boomerang', viewValue: 'boomerang'},
    {value: 'bottlecap', viewValue: 'bottlecap'},
    {value: 'bowtie', viewValue: 'bowtie'},
    {value: 'bracelet', viewValue: 'bracelet'},
    {value: 'brain', viewValue: 'brain'},
    {value: 'bread', viewValue: 'bread'},
    {value: 'bridge', viewValue: 'bridge'},
    {value: 'broccoli', viewValue: 'broccoli'},
    {value: 'broom', viewValue: 'broom'},
    {value: 'bucket', viewValue: 'bucket'},
    {value: 'bulldozer', viewValue: 'bulldozer'},
    {value: 'bus', viewValue: 'bus'},
    {value: 'bush', viewValue: 'bush'},
    {value: 'butterfly', viewValue: 'butterfly'},
    {value: 'cactus', viewValue: 'cactus'},
    {value: 'cake', viewValue: 'cake'},
    {value: 'calculator', viewValue: 'calculator'},
    {value: 'calendar', viewValue: 'calendar'},
    {value: 'camel', viewValue: 'camel'},
    {value: 'camera', viewValue: 'camera'},
    {value: 'camouflage', viewValue: 'camouflage'},
    {value: 'campfire', viewValue: 'campfire'},
    {value: 'candle', viewValue: 'candle'},
    {value: 'cannon', viewValue: 'cannon'},
    {value: 'canoe', viewValue: 'canoe'},
    {value: 'car', viewValue: 'car'},
    {value: 'carrot', viewValue: 'carrot'},
    {value: 'castle', viewValue: 'castle'},
    {value: 'cat', viewValue: 'cat'},
    {value: 'ceiling fan', viewValue: 'ceiling fan'},
    {value: 'cello', viewValue: 'cello'},
    {value: 'cell phone', viewValue: 'cell phone'},
    {value: 'chair', viewValue: 'chair'},
    {value: 'chandelier', viewValue: 'chandelier'},
    {value: 'church', viewValue: 'church'},
    {value: 'circle', viewValue: 'circle'},
    {value: 'clarinet', viewValue: 'clarinet'},
    {value: 'clock', viewValue: 'clock'},
    {value: 'cloud', viewValue: 'cloud'},
    {value: 'coffee cup', viewValue: 'coffee cup'},
    {value: 'compass', viewValue: 'compass'},
    {value: 'computer', viewValue: 'computer'},
    {value: 'cookie', viewValue: 'cookie'},
    {value: 'cooler', viewValue: 'cooler'},
    {value: 'couch', viewValue: 'couch'},
    {value: 'cow', viewValue: 'cow'},
    {value: 'crab', viewValue: 'crab'},
    {value: 'crayon', viewValue: 'crayon'},
    {value: 'crocodile', viewValue: 'crocodile'},
    {value: 'crown', viewValue: 'crown'},
    {value: 'cruise ship', viewValue: 'cruise ship'},
    {value: 'cup', viewValue: 'cup'},
    {value: 'diamond', viewValue: 'diamond'},
    {value: 'dishwasher', viewValue: 'dishwasher'},
    {value: 'diving board', viewValue: 'diving board'},
    {value: 'dog', viewValue: 'dog'},
    {value: 'dolphin', viewValue: 'dolphin'},
    {value: 'donut', viewValue: 'donut'},
    {value: 'door', viewValue: 'door'},
    {value: 'dragon', viewValue: 'dragon'},
    {value: 'dresser', viewValue: 'dresser'},
    {value: 'drill', viewValue: 'drill'},
    {value: 'drums', viewValue: 'drums'},
    {value: 'duck', viewValue: 'duck'},
    {value: 'dumbbell', viewValue: 'dumbbell'},
    {value: 'ear', viewValue: 'ear'},
    {value: 'elbow', viewValue: 'elbow'},
    {value: 'elephant', viewValue: 'elephant'},
    {value: 'envelope', viewValue: 'envelope'},
    {value: 'eraser', viewValue: 'eraser'},
    {value: 'eye', viewValue: 'eye'},
    {value: 'eyeglasses', viewValue: 'eyeglasses'},
    {value: 'face', viewValue: 'face'},
    {value: 'fan', viewValue: 'fan'},
    {value: 'feather', viewValue: 'feather'},
    {value: 'fence', viewValue: 'fence'},
    {value: 'finger', viewValue: 'finger'},
    {value: 'fire hydrant', viewValue: 'fire hydrant'},
    {value: 'fireplace', viewValue: 'fireplace'},
    {value: 'firetruck', viewValue: 'firetruck'},
    {value: 'fish', viewValue: 'fish'},
    {value: 'flamingo', viewValue: 'flamingo'},
    {value: 'flashlight', viewValue: 'flashlight'},
    {value: 'flip flops', viewValue: 'flip flops'},
    {value: 'floor lamp', viewValue: 'floor lamp'},
    {value: 'flower', viewValue: 'flower'},
    {value: 'flying saucer', viewValue: 'flying saucer'},
    {value: 'foot', viewValue: 'foot'},
    {value: 'fork', viewValue: 'fork'},
    {value: 'frog', viewValue: 'frog'},
    {value: 'frying pan', viewValue: 'frying pan'},
    {value: 'garden', viewValue: 'garden'},
    {value: 'garden hose', viewValue: 'garden hose'},
    {value: 'giraffe', viewValue: 'giraffe'},
    {value: 'goatee', viewValue: 'goatee'},
    {value: 'golf club', viewValue: 'golf club'},
    {value: 'grapes', viewValue: 'grapes'},
    {value: 'grass', viewValue: 'grass'},
    {value: 'guitar', viewValue: 'guitar'},
    {value: 'hamburger', viewValue: 'hamburger'},
    {value: 'hammer', viewValue: 'hammer'},
    {value: 'hand', viewValue: 'hand'},
    {value: 'harp', viewValue: 'harp'},
    {value: 'hat', viewValue: 'hat'},
    {value: 'headphones', viewValue: 'headphones'},
    {value: 'hedgehog', viewValue: 'hedgehog'},
    {value: 'helicopter', viewValue: 'helicopter'},
    {value: 'helmet', viewValue: 'helmet'},
    {value: 'hexagon', viewValue: 'hexagon'},
    {value: 'hockey puck', viewValue: 'hockey puck'},
    {value: 'hockey stick', viewValue: 'hockey stick'},
    {value: 'horse', viewValue: 'horse'},
    {value: 'hospital', viewValue: 'hospital'},
    {value: 'hot air balloon', viewValue: 'hot air balloon'},
    {value: 'hot dog', viewValue: 'hot dog'},
    {value: 'hot tub', viewValue: 'hot tub'},
    {value: 'hourglass', viewValue: 'hourglass'},
    {value: 'house', viewValue: 'house'},
    {value: 'house plant', viewValue: 'house plant'},
    {value: 'hurricane', viewValue: 'hurricane'},
    {value: 'ice cream', viewValue: 'ice cream'},
    {value: 'jacket', viewValue: 'jacket'},
    {value: 'jail', viewValue: 'jail'},
    {value: 'kangaroo', viewValue: 'kangaroo'},
    {value: 'key', viewValue: 'key'},
    {value: 'keyboard', viewValue: 'keyboard'},
    {value: 'knee', viewValue: 'knee'},
    {value: 'knife', viewValue: 'knife'},
    {value: 'ladder', viewValue: 'ladder'},
    {value: 'lantern', viewValue: 'lantern'},
    {value: 'laptop', viewValue: 'laptop'},
    {value: 'leaf', viewValue: 'leaf'},
    {value: 'leg', viewValue: 'leg'},
    {value: 'light bulb', viewValue: 'light bulb'},
    {value: 'lighter', viewValue: 'lighter'},
    {value: 'lighthouse', viewValue: 'lighthouse'},
    {value: 'lightning', viewValue: 'lightning'},
    {value: 'line', viewValue: 'line'},
    {value: 'lion', viewValue: 'lion'},
    {value: 'lipstick', viewValue: 'lipstick'},
    {value: 'lobster', viewValue: 'lobster'},
    {value: 'lollipop', viewValue: 'lollipop'},
    {value: 'mailbox', viewValue: 'mailbox'},
    {value: 'map', viewValue: 'map'},
    {value: 'marker', viewValue: 'marker'},
    {value: 'matches', viewValue: 'matches'},
    {value: 'megaphone', viewValue: 'megaphone'},
    {value: 'mermaid', viewValue: 'mermaid'},
    {value: 'microphone', viewValue: 'microphone'},
    {value: 'microwave', viewValue: 'microwave'},
    {value: 'monkey', viewValue: 'monkey'},
    {value: 'moon', viewValue: 'moon'},
    {value: 'mosquito', viewValue: 'mosquito'},
    {value: 'motorbike', viewValue: 'motorbike'},
    {value: 'mountain', viewValue: 'mountain'},
    {value: 'mouse', viewValue: 'mouse'},
    {value: 'moustache', viewValue: 'moustache'},
    {value: 'mouth', viewValue: 'mouth'},
    {value: 'mug', viewValue: 'mug'},
    {value: 'mushroom', viewValue: 'mushroom'},
    {value: 'nail', viewValue: 'nail'},
    {value: 'necklace', viewValue: 'necklace'},
    {value: 'nose', viewValue: 'nose'},
    {value: 'ocean', viewValue: 'ocean'},
    {value: 'octagon', viewValue: 'octagon'},
    {value: 'octopus', viewValue: 'octopus'},
    {value: 'onion', viewValue: 'onion'},
    {value: 'oven', viewValue: 'oven'},
    {value: 'owl', viewValue: 'owl'},
    {value: 'paintbrush', viewValue: 'paintbrush'},
    {value: 'paint can', viewValue: 'paint can'},
    {value: 'palm tree', viewValue: 'palm tree'},
    {value: 'panda', viewValue: 'panda'},
    {value: 'pants', viewValue: 'pants'},
    {value: 'paper clip', viewValue: 'paper clip'},
    {value: 'parachute', viewValue: 'parachute'},
    {value: 'parrot', viewValue: 'parrot'},
    {value: 'passport', viewValue: 'passport'},
    {value: 'peanut', viewValue: 'peanut'},
    {value: 'pear', viewValue: 'pear'},
    {value: 'peas', viewValue: 'peas'},
    {value: 'pencil', viewValue: 'pencil'},
    {value: 'penguin', viewValue: 'penguin'},
    {value: 'piano', viewValue: 'piano'},
    {value: 'pickup truck', viewValue: 'pickup truck'},
    {value: 'picture frame', viewValue: 'picture frame'},
    {value: 'pig', viewValue: 'pig'},
    {value: 'pillow', viewValue: 'pillow'},
    {value: 'pineapple', viewValue: 'pineapple'},
    {value: 'pizza', viewValue: 'pizza'},
    {value: 'pliers', viewValue: 'pliers'},
    {value: 'police car', viewValue: 'police car'},
    {value: 'pond', viewValue: 'pond'},
    {value: 'pool', viewValue: 'pool'},
    {value: 'popsicle', viewValue: 'popsicle'},
    {value: 'postcard', viewValue: 'postcard'},
    {value: 'potato', viewValue: 'potato'},
    {value: 'power outlet', viewValue: 'power outlet'},
    {value: 'purse', viewValue: 'purse'},
    {value: 'rabbit', viewValue: 'rabbit'},
    {value: 'raccoon', viewValue: 'raccoon'},
    {value: 'radio', viewValue: 'radio'},
    {value: 'rain', viewValue: 'rain'},
    {value: 'rainbow', viewValue: 'rainbow'},
    {value: 'rake', viewValue: 'rake'},
    {value: 'remote control', viewValue: 'remote control'},
    {value: 'rhinoceros', viewValue: 'rhinoceros'},
    {value: 'rifle', viewValue: 'rifle'},
    {value: 'river', viewValue: 'river'},
    {value: 'roller coaster', viewValue: 'roller coaster'},
    {value: 'rollerskates', viewValue: 'rollerskates'},
    {value: 'sailboat', viewValue: 'sailboat'},
    {value: 'sandwich', viewValue: 'sandwich'},
    {value: 'saw', viewValue: 'saw'},
    {value: 'saxophone', viewValue: 'saxophone'},
    {value: 'school bus', viewValue: 'school bus'},
    {value: 'scissors', viewValue: 'scissors'},
    {value: 'scorpion', viewValue: 'scorpion'},
    {value: 'screwdriver', viewValue: 'screwdriver'},
    {value: 'sea turtle', viewValue: 'sea turtle'},
    {value: 'see saw', viewValue: 'see saw'},
    {value: 'shark', viewValue: 'shark'},
    {value: 'sheep', viewValue: 'sheep'},
    {value: 'shoe', viewValue: 'shoe'},
    {value: 'shorts', viewValue: 'shorts'},
    {value: 'shovel', viewValue: 'shovel'},
    {value: 'sink', viewValue: 'sink'},
    {value: 'skateboard', viewValue: 'skateboard'},
    {value: 'skull', viewValue: 'skull'},
    {value: 'skyscraper', viewValue: 'skyscraper'},
    {value: 'sleeping bag', viewValue: 'sleeping bag'},
    {value: 'smiley face', viewValue: 'smiley face'},
    {value: 'snail', viewValue: 'snail'},
    {value: 'snake', viewValue: 'snake'},
    {value: 'snorkel', viewValue: 'snorkel'},
    {value: 'snowflake', viewValue: 'snowflake'},
    {value: 'snowman', viewValue: 'snowman'},
    {value: 'soccer ball', viewValue: 'soccer ball'},
    {value: 'sock', viewValue: 'sock'},
    {value: 'speedboat', viewValue: 'speedboat'},
    {value: 'spider', viewValue: 'spider'},
    {value: 'spoon', viewValue: 'spoon'},
    {value: 'spreadsheet', viewValue: 'spreadsheet'},
    {value: 'square', viewValue: 'square'},
    {value: 'squiggle', viewValue: 'squiggle'},
    {value: 'squirrel', viewValue: 'squirrel'},
    {value: 'stairs', viewValue: 'stairs'},
    {value: 'star', viewValue: 'star'},
    {value: 'steak', viewValue: 'steak'},
    {value: 'stereo', viewValue: 'stereo'},
    {value: 'stethoscope', viewValue: 'stethoscope'},
    {value: 'stitches', viewValue: 'stitches'},
    {value: 'stop sign', viewValue: 'stop sign'},
    {value: 'stove', viewValue: 'stove'},
    {value: 'strawberry', viewValue: 'strawberry'},
    {value: 'streetlight', viewValue: 'streetlight'},
    {value: 'string bean', viewValue: 'string bean'},
    {value: 'submarine', viewValue: 'submarine'},
    {value: 'suitcase', viewValue: 'suitcase'},
    {value: 'sun', viewValue: 'sun'},
    {value: 'swan', viewValue: 'swan'},
    {value: 'sweater', viewValue: 'sweater'},
    {value: 'swing set', viewValue: 'swing set'},
    {value: 'sword', viewValue: 'sword'},
    {value: 'syringe', viewValue: 'syringe'},
    {value: 'table', viewValue: 'table'},
    {value: 'teapot', viewValue: 'teapot'},
    {value: 'teddy-bear', viewValue: 'teddy-bear'},
    {value: 'telephone', viewValue: 'telephone'},
    {value: 'television', viewValue: 'television'},
    {value: 'tennis racquet', viewValue: 'tennis racquet'},
    {value: 'tent', viewValue: 'tent'},
    {value: 'The Eiffel Tower', viewValue: 'The Eiffel Tower'},
    {value: 'The Great Wall of China', viewValue: 'The Great Wall of China'},
    {value: 'The Mona Lisa', viewValue: 'The Mona Lisa'},
    {value: 'tiger', viewValue: 'tiger'},
    {value: 'toaster', viewValue: 'toaster'},
    {value: 'toe', viewValue: 'toe'},
    {value: 'toilet', viewValue: 'toilet'},
    {value: 'tooth', viewValue: 'tooth'},
    {value: 'toothbrush', viewValue: 'toothbrush'},
    {value: 'toothpaste', viewValue: 'toothpaste'},
    {value: 'tornado', viewValue: 'tornado'},
    {value: 'tractor', viewValue: 'tractor'},
    {value: 'traffic light', viewValue: 'traffic light'},
    {value: 'train', viewValue: 'train'},
    {value: 'tree', viewValue: 'tree'},
    {value: 'triangle', viewValue: 'triangle'},
    {value: 'trombone', viewValue: 'trombone'},
    {value: 'truck', viewValue: 'truck'},
    {value: 'trumpet', viewValue: 'trumpet'},
    {value: 't-shirt', viewValue: 't-shirt'},
    {value: 'umbrella', viewValue: 'umbrella'},
    {value: 'underwear', viewValue: 'underwear'},
    {value: 'van', viewValue: 'van'},
    {value: 'vase', viewValue: 'vase'},
    {value: 'violin', viewValue: 'violin'},
    {value: 'washing machine', viewValue: 'washing machine'},
    {value: 'watermelon', viewValue: 'watermelon'},
    {value: 'waterslide', viewValue: 'waterslide'},
    {value: 'whale', viewValue: 'whale'},
    {value: 'wheel', viewValue: 'wheel'},
    {value: 'windmill', viewValue: 'windmill'},
    {value: 'wine bottle', viewValue: 'wine bottle'},
    {value: 'wine glass', viewValue: 'wine glass'},
    {value: 'wristwatch', viewValue: 'wristwatch'},
    {value: 'yoga', viewValue: 'yoga'},
    {value: 'zebra', viewValue: 'zebra'},
    {value: 'zigzag', viewValue: 'zigzag'}
  ];
}
