import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Game } from '../models/game.model';
import { GamesService } from './../services/game.service';

@Component({
  selector: 'games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {
  public games:Array<Game> = [];
  public _cols:number;
  get cols(){
    return this._cols;
  }
  set cols(value){
    this._cols = value;
  }


  constructor( 
    private gameService:GamesService,
    @Inject(MAT_DIALOG_DATA) public data:boolean
    ) { }

  ngOnInit(): void {
    this.gameService.getGames()
    .then(res=>{
      this.cols = this.data?(res.length>12?4:3):(res.length>12?7:4);
      this.games = res;
    })
  }

}
