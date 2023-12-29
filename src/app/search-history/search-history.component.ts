import { Component, DoCheck, OnInit } from '@angular/core';
import { IWord } from '../Model/word';
import { HistoryServiceService } from '../Services/history-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Vegetable {
  name: string;
}

@Component({
  selector: '[app-search-history]',
  templateUrl: './search-history.component.html',
  styleUrls: ['./search-history.component.css']
})
export class SearchHistoryComponent implements OnInit,DoCheck {

  history:Array<IWord>=[];
  navigateTo!:string

  constructor(private _wordhistory:HistoryServiceService,private _snack:MatSnackBar) { }

  ngDoCheck(): void {
    if(this._wordhistory.searchedHistory !=null){
      if(!this.history.find(x=>x.word==this._wordhistory.searchedHistory!.word)){
        this.history.push(this._wordhistory.searchedHistory);
        console.log(this.history);
      }
    }
  }

  ngOnInit(): void {
    this._wordhistory.getHistory('rahul').subscribe(data=>{
      data = Object.values(data).flat();
      data.forEach(item=>{
        this.history.push(item);
      });
    })
    
  }

  wordSelected(word:string){
    this.navigateTo = `${location.href.split('?')[0]}?word=${word}`;
  }

  deleteFromHistory(word:string){
    this._wordhistory.deleteHistory('rahul',word).subscribe(
      {
        next:data=>{
          this._snack.open("History delete successfully.","Dismiss");
          this.history  = this.history.filter(item => item.word != word);
        },
        error:error=>{
          this._snack.open("Techical error occured while deleting history try after some time.","Dismiss");
        }
      })
  }
}
