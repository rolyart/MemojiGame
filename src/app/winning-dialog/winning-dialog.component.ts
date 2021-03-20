import { AfterViewInit, Component, ElementRef, Inject, OnInit, Renderer2,} from '@angular/core';
import * as confetti from 'canvas-confetti';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GamesComponent } from '../games/games.component';
import { Game } from '../models/game.model';

@Component({
  selector: 'winning-dialog',
  templateUrl: './winning-dialog.component.html',
  styleUrls: ['./winning-dialog.component.scss']
})
export class WinningDialogComponent implements OnInit, AfterViewInit {

	winSoundUrl= new Audio('assets/sounds/win.m4a');
	starsRating:Array<number> = [];
	interval;

	constructor(
		private renderer2: Renderer2,
		private elementRef: ElementRef,
		@Inject(MAT_DIALOG_DATA) public data:any,
		private dialog:MatDialog, private dialogRef:MatDialogRef<WinningDialogComponent>
	) { }

	ngOnInit(): void {
		this.starsRating = this.data.starsRating;
	}

	/* Show confetti
	=========================================== */
	ngAfterViewInit() {
		this.winSoundUrl.play()
		const canvas = this.renderer2.createElement('canvas');
		this.renderer2.appendChild(this.elementRef.nativeElement, canvas);
		const myConfetti = confetti.create(canvas, {
			resize: true
		});
		myConfetti();
		setTimeout(() => {
			canvas.remove();
		},3000);

		this.renderer2.listen("document", "click", event=>{
			canvas.remove();
		})

		


  	} 

	 /* Display timer
	=========================================== */ 
	displayTimer(){
		let s:string = this.data.timer.seconds<10?'0'+this.data.timer.seconds:this.data.timer.seconds;
		let m:string = this.data.timer.minutes<10?'0'+this.data.timer.minutes:this.data.timer.minutes;
		let h:string = this.data.timer.hours<10?'0'+this.data.timer.hours:this.data.timer.hours;
		return h+':'+m+':'+s;
	}

	/* Open games dialog
	=========================================== */ 
	openGamesDialog(){
		const dialogRef = this.dialog.open(GamesComponent, {
			width:'100%',
			height:'100%',
			maxWidth:'100%',
			panelClass: 'full-screen-modal',
			data:this.data.mediaQuery
		});
		dialogRef.afterClosed()
		.subscribe((res:Game)=>{
			this.dialogRef.close({game:res, state:'new-game'})
		})
		
	}

}