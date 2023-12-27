import { Component, OnDestroy, OnInit } from '@angular/core';
import { SearchWordService } from '../Services/search-word.service';
import { IWord } from '../Model/word';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: '[app-search-result]',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})

export class SearchResultComponent implements OnInit, OnDestroy {

  searchedWord: FormControl = new FormControl();
  wordDetails: IWord[] = [];
  phonetics: any[] = [];
  meaning: any[] = [];
  partsOfSpeech: string[] = [];
  otherMeanings: string[] = [];
  otherMeaningsString!: string;
  whatsAppUrl:string | undefined;
  showSpinner:boolean=false;
  IsBookMarked:boolean=true;
  constructor(private _searchWord: SearchWordService, private _snackBar: MatSnackBar,private _route:ActivatedRoute) { }

  ngOnDestroy(): void {
    this._snackBar.ngOnDestroy();
  }

  ngOnInit(): void {
    this._route.queryParams.subscribe(data=>{
      if(Object.keys(data).length>0){
        this.searchedWord.setValue(data['word']);
        this.getWordDetails()
      }
    })
  }

  inputKeys(event: any) {
    if (event.key == "Enter") {
      this.getWordDetails();
    }
  }

  getWordDetails() {
    this.whatsAppUrl =undefined;
    this.wordDetails = [];
    this.partsOfSpeech = [];
    this.phonetics = [];
    this.meaning = [];
    this.otherMeanings = [];
    this.showSpinner=true;
    if (!this.searchedWord.value) {
      this._snackBar.open("please enter word", "Dismiss");
      return;
    }
    this.whatsAppUrl = `https://api.whatsapp.com/send?text=${location.href}?word=${this.searchedWord.value}`;
    this._searchWord.getWordFormFireBase(this.searchedWord.value.toLowerCase()).subscribe({
      next: (data) => {
        this.showSpinner=false;
        if(data!=null){
          this.transformWordDetails(data);
          console.log("took from firebase");
        }else{
          this.getWordDetailsFromDictionaryApi(this.searchedWord.value.toLocaleLowerCase());
          console.log("took from dictionary api");
        }
      },
      error: (error) => {
        this.showSpinner=false;
        console.log(error);
      }
    })
  }

  getWordDetailsFromDictionaryApi(word:string){
    this._searchWord.getWord(word).subscribe({
      next:data=>{
        this.transformWordDetails(data);
        this.putWordIntoFirebase(word,data);
      },
      error:error=>{
        console.log(error);
        this._snackBar.open("Please enter correct word!!!","Dismiss")
      }
    })
  }

  putWordIntoFirebase(word:string,wordDetails:Array<IWord>){
    this._searchWord.putWordToFireBase(wordDetails,word).subscribe({
      next:data=>{
        console.log(word.toUpperCase() + " Posted to firebase ");
      },
      error:error=>{
        console.log(error);
      }
    })
  }

  transformWordDetails(data:Array<IWord>) {
    this.wordDetails = data.flat();
    console.log(this.wordDetails[0]);
    for (let i = 0; i < this.wordDetails[0].phonetics.length; i++) {
      this.phonetics.push(this.wordDetails[0].phonetics[i]);
    }
    for (let j = 0; j < this.wordDetails[0].meanings.length; j++) {
      this.partsOfSpeech.push(this.wordDetails[0].meanings[j].partOfSpeech);

    }

    this.partsOfSpeech.push("antonyms");
    this.partsOfSpeech.push("synonyms");
  }

  volumeClicked(url: string) {
    console.log(url);
    new Audio(url).play();
  }

  selectedPartofSpeech(part: string, index: number) {
    this.meaning = [];
    this.otherMeanings = [];
    if (part !== "antonyms" && part !== "synonyms") {
      if (this.wordDetails[0].meanings[index].partOfSpeech == part) {
        this.meaning.push(this.wordDetails[0].meanings[index]);
      }
    }
    if (part === "antonyms") {
      for (let k = 0; k < this.wordDetails[0].meanings.length; k++) {
        if(this.wordDetails[0].meanings[k].antonyms){
          for (let m = 0; m < this.wordDetails[0].meanings[k].antonyms.length; m++) {
            this.otherMeanings.push(this.wordDetails[0].meanings[k].antonyms[m])
          }
        }
      }      
    }

    if (part === "synonyms") {
      for (let k = 0; k < this.wordDetails[0].meanings.length; k++) {
        if(this.wordDetails[0].meanings[k].synonyms){
          for (let m = 0; m < this.wordDetails[0].meanings[k].synonyms.length; m++) {
            this.otherMeanings.push(this.wordDetails[0].meanings[k].synonyms[m])
          }
        }
      }
    }
  }

  bookMarked(){
    this.IsBookMarked = (this.IsBookMarked)?false:true;
  }

}
