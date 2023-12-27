import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, mergeMap } from 'rxjs';
import { IWord } from '../Model/word';

const header = new HttpHeaders({
  'Content-Type':'application/json'
});

@Injectable({
  providedIn: 'root'
})
export class SearchWordService {

  apiUrl:string="https://api.dictionaryapi.dev/api/v2/entries/en";
  firebaseUrl:string="https://moderndictionary-5869f-default-rtdb.firebaseio.com/";

  constructor(private _http:HttpClient) { }

  getWord(word:string):Observable<Array<IWord>>{
    return this._http.get<Array<IWord>>(`${this.apiUrl}/${word}`,{headers:header});
  }

  getWordFormFireBase(word:string){
    return this._http.get<Array<IWord>>(this.firebaseUrl+'Words/'+word.toLowerCase()+".json",{headers:header})
  }

  putWordToFireBase(wordDetails:Array<IWord>,word:string){
    return this._http.put<Array<IWord>>(this.firebaseUrl+'Words/'+word.toLowerCase()+".json",wordDetails,{headers:header})
  }
}
