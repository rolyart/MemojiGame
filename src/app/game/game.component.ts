import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GamesComponent } from '../games/games.component';
import { Game } from '../models/game.model';
import { WinningDialogComponent } from '../winning-dialog/winning-dialog.component';

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  animations: [
    trigger('shrinkOut', [
      state('in', style({})),
      transition('* => void', [
        style({ height: '!', opacity: 1, transform:'scale(.1)' }),
        animate(400, style({ height: 0, opacity: 0 }))
      ]),
      transition('void => *', [
        style({ height: 0, opacity: 0, transform:'scale(1)' }),
        animate(800, style({ height: '*', opacity: 1 }))
      ])
    ])

  ],
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
	@Input() breakpoint;
	private _game:Game = null;	
	@Input() 
	get game(){
	  return this._game;
	}
	set game(value ){
		this._game= value;
		this.cards = [];
		if(value){
			this.moves = 0;
			this.matchedCards = 0;
			this.shuffleCards(value.cards.concat(value.cards)).map(el=>{
				this.cards.push({state:'hide', type:el});
			})
			clearInterval(this.interval);
			this.timer = {seconds:0, minutes:0, hours:0, state:'stop' }
		}
	}

	_cols:number;
	get cols(){
		return this._cols;
	}
	set cols(value){
		this._cols = value;
	}

  	cards:Array<any> = [];
  	openedCards:Array<any> = [];
	moves:number = 0;
	matchedCards:number = 0;
	timer:any = {seconds:0, minutes:0, hours:0, state:'stop' }
	openCardSound = new Audio('assets/sounds/open-card.mp3');
	starsRating:Array<number> = [];
	interval;

  	constructor(private dialog:MatDialog) { }

	ngOnInit(): void {
	}

	/* Shuffle  cards;
	=========================================== */
	shuffleCards(cards):Array<any>{
		var currentIndex = cards.length, temporaryValue, randomIndex;
		this.cols = this.breakpoint?(this.game.cards.length<=6?3:4):(this.game.cards.length<=6?4:5);
		while (currentIndex !== 0) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = cards[currentIndex];
			cards[currentIndex] = cards[randomIndex];
			cards[randomIndex] = temporaryValue;
		}
		return cards;
	}

	/* Show Card
	=========================================== */
	displayCard(i, event){
		if(this.cards[i].state=='matched' || this.cards[i].state=='show' || this.openedCards.length==2 ) return;
		this.playOpenCardSound();
		this.cards[i].state = 'show';
		this.openedCards.push(this.cards.indexOf(this.cards[i]));
		if(this.openedCards.length==2){
			this.moves++;
			if(this.cards[this.openedCards[0]].type == this.cards[this.openedCards[1]].type){
				this.cards[this.openedCards[0]].state = 'matched';
				this.cards[this.openedCards[1]].state = 'matched';
				this.matchedCards++;
				this.openedCards = [];
			}
			else{
				this.cards[this.openedCards[0]].state = 'show';
				this.cards[this.openedCards[1]].state = 'show';
				setTimeout(()=>{
					this.cards[this.openedCards[0]].state = 'no-matched';
					this.cards[this.openedCards[1]].state = 'no-matched';
				}, 500)
				setTimeout(()=>{
					this.cards[this.openedCards[0]].state = 'hide';
					this.cards[this.openedCards[1]].state = 'hide';
					this.openedCards = [];
				},1000)	
				
			}
		}
		if(this.matchedCards == this.game.cards.length){
			clearInterval(this.interval);
			setTimeout(() => {
				this.openWinninDialog();
			}, 500);
			
		}
		if(this.timer.state =='stop' && this.openedCards.length == 1)this.startTimer();
	}

	/* Start timer on first move
	=========================================== */
	startTimer(){
		this.timer.state = 'started';
		this.interval = setInterval(()=>{
		this.timer.seconds++ ;
		if(this.timer.seconds == 60){
			this.timer.minutes++;
			this.timer.seconds=0;
		}
		if(this.timer.minutes == 60){
			this.timer.hours++;
			this.timer.minute = 0;
		}
		},1000);
	}
	/* Stop timer
	=========================================== */
	stopTimer(){
		clearInterval(this.interval);
		this.timer = {seconds:0, minutes:0, hours:0, state:'stop' };
	}

	/* Display timer
	=========================================== */
	displayTimer(){
		let s:string = this.timer.seconds<10?'0'+this.timer.seconds:this.timer.seconds;
		let m:string = this.timer.minutes<10?'0'+this.timer.minutes:this.timer.minutes;
		let h:string = this.timer.hours<10?'0'+this.timer.hours:this.timer.hours;
		return h+':'+m+':'+s;
	}

	/* Wining dialog
	=========================================== */
	openWinninDialog(){
		this.getRating();
		const dialogRef = this.dialog.open(WinningDialogComponent,{
			width:'100%',
			height:'100vh',
			maxWidth:'100%',
			panelClass: 'winning-dialog',
			data:{moves:this.moves, timer:this.timer, starsRating:this.starsRating, mediaQuery:this.breakpoint }
		})
		dialogRef.afterClosed()
		.subscribe(res=>{
			if(res){
				if(res=='play-again'){
					this.playAgain();
				}
				if(res.state=='new-game') this.game = res.game;
			}
		})
	}

	/* Get ratings
	=========================================== */
	getRating(){
		if(this.moves >= this.game.cards.length * 2 && this.timer.seconds / 2){
			this.starsRating =  [1, 2];
		}
		if(this.moves <= this.game.cards.length * 2 && this.timer.seconds <= this.game.cards.length * 2){
			this.starsRating =  [1, 2, 3, 4, 5];
		}
	}

	/* Play Again
	=========================================== */
	playAgain(){
		this.cards = [];
		this.shuffleCards(this.game.cards.concat(this.game.cards)).map(el=>{
			this.cards.push({state:'hide', type:el});
		})
		this.moves = 0;
		this.matchedCards = 0;
		this.stopTimer();
	}

	/* Open games dialog
	=========================================== */
	openGamesDialog(){
		const dialogRef = this.dialog.open(GamesComponent, {
			width:'100%',
			height:'100%',
			maxWidth:'100%',
			panelClass: 'full-screen-modal',
			data:this.breakpoint
		});
		dialogRef.afterClosed()
		  .subscribe((game:Game)=>{
			if(game){
			  this.game  = game;
			}
		})
	}

	/* Open card sound
	=========================================== */
	playOpenCardSound(){
		if(this.openCardSound.played) {
			this.openCardSound.pause();
			this.openCardSound.currentTime = 0;
		}
		this.openCardSound.play();
	}

}
