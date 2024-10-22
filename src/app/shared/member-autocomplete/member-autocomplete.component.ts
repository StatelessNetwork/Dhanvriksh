import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { debounceTime, distinctUntilChanged, filter, of, switchMap } from 'rxjs';
import { applicationObject } from 'src/app/model/applicationEnum';
import { loginUserDetails } from 'src/app/model/common-model';
import { MemberService } from 'src/app/services/member.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-member-autocomplete',
  templateUrl: './member-autocomplete.component.html',
  styleUrls: ['./member-autocomplete.component.scss'],
})
export class MemberAutocompleteComponent  implements OnInit {

  @Input() control: FormControl;  // Input to bind the form control
  filteredMembers: any[] = [];
  isLoading = false;
  @Output() memberSelected = new EventEmitter<any>();
  loginUserData:loginUserDetails;
  constructor(private memberService: MemberService,private _storageService:StorageService,
    private navCtrl: NavController
  ) {
    this._storageService.get(applicationObject.token).then(data => {
      if(data){
        let currentDateTime:any= new Date().getTime();
        let expiryDateTime=new Date(data.expirationDate).getTime();
        if(currentDateTime<=expiryDateTime)
        {
          this._storageService.get(applicationObject.loginUserDetails).then((res:loginUserDetails) => {
            if(res) {
            this.loginUserData=res;
            }
          });
        }
        else{
          this.navCtrl.navigateRoot(['/login']);
        }
      }
      else{
        this.navCtrl.navigateRoot(['/login']);
      }
    });
   }

  // ngOnInit() {
  //   if (!this.control) {
  //     throw new Error('FormControl is required for MemberAutocompleteComponent');
  //   }

  //   this.control.valueChanges.pipe(
  //     debounceTime(300), // Wait 300ms after the last keystroke before considering the value
  //     distinctUntilChanged(), // Only emit if the current value is different than the last
  //     filter(value => value && value.length >= 3), // Only search if the query is at least 3 characters long
  //     switchMap(value => {
  //       this.isLoading = true;
  //       return of(this.filterMembers(value)); // Use static array instead of making an API call
  //     })
  //   ).subscribe(
  //     (members: any[]) => {
  //       this.isLoading = false;
  //       this.filteredMembers = members;
  //     },
  //     (error) => {
  //       this.isLoading = false;
  //       console.error('Error fetching members:', error);
  //     }
  //   );
  // }

  // filterMembers(query: string): any[] {
  //   return this.staticMembers.filter(member =>
  //     member.name.toLowerCase().includes(query.toLowerCase())
  //   );
  // }
  ngOnInit() {
    if (!this.control) {
      throw new Error('FormControl is required for MemberAutocompleteComponent');
    }

    this.control.valueChanges.pipe(
      debounceTime(300), // Wait 300ms after the last keystroke before considering the value
      distinctUntilChanged(), // Only emit if the current value is different than the last
      filter(value => value && value.length >= 3), // Only search if the query is at least 3 characters long
      switchMap(value => {
        this.isLoading = true;
        return this.memberService.searchMembers(value,this.loginUserData.encryptUserId); // Replace with your actual search method
      })
    ).subscribe(
      (members: any[]) => {
        this.isLoading = false;
        this.filteredMembers = members;
      },
      (error) => {
        this.isLoading = false;
        console.error('Error fetching members:', error);
      }
    );
  }

  onSelect(member: any) {
    this.control.setValue(member.Name, { emitEvent: false });  // Suppress valueChanges event
    this.memberSelected.emit(member);
    this.filteredMembers = [];
  }

}
