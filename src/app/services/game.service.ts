import {Injectable} from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs';
import {API_URL, HttpService} from './http.service';
import { Game } from './../models/game.model';



@Injectable({
    providedIn: 'root'
})
export class GamesService {

    public games: Observable<Game>
    private gamesSubject: BehaviorSubject<Game>

    constructor (private httpService: HttpService) {
        // Initialization of the behavior subjects.
        this.gamesSubject = new BehaviorSubject(null)
        this.games = this.gamesSubject.asObservable()
    }

    /**
     * Return the games
     */
    getGames (): Promise<Array<Game>> {
        return this.httpService.get(API_URL.LOCAL_ASSETS, 'games.json')
    }

}
