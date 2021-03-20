import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SwiperOptions } from 'swiper';
import { GamesComponent } from './games/games.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
	title = 'memojiGame';
  	mobileQuery: MediaQueryList;
  	private _mobileQueryListener: () => void;

	selectedGame:any = null;
	constructor(
		changeDetectorRef: ChangeDetectorRef, 
    	media: MediaMatcher,
    	private dialog:MatDialog
    ){
		this.mobileQuery = media.matchMedia('(max-width: 600px)');
    	this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    	this.mobileQuery.addListener(this._mobileQueryListener);
  	}

	/* Open Games
	=========================================== */ 
	openGamesDialog(){
		const dialogRef = this.dialog.open(GamesComponent, {
			width:'100%',
			height:'100%',
			maxWidth:'100%',
			panelClass: 'full-screen-modal',
			data:this.mobileQuery.matches
		});
		dialogRef.afterClosed()
		.subscribe(res=>{
			if(res){
				this.selectedGame  = res;
			}
		})
	}

	ngOnDestroy(): void {
		this.mobileQuery.removeListener(this._mobileQueryListener);
	}

}