import { LightningElement,api,track } from 'lwc';
import { NavigationMixin } from "lightning/navigation";

export default class BusinessProcessCreate extends NavigationMixin(LightningElement) {

@api createobjectname;
@track createLabel;

connectedCallback(){
    console.log('this.createobjectname in connectedCallback is:', this.createobjectname);
    this.createLabel = 'Create'+' '+ this.createobjectname;
}

    handleCreateClick(event){
        console.log('this.createobjectname is:', this.createobjectname);
        this.navigateToNewRecordPage(this.createobjectname);

    }

    navigateToNewRecordPage(createobjectname) {
        console.log('this.createobjectname is:', this.createobjectname);
        // Opens the new Account record modal
        // to create an Account.
        this[NavigationMixin.Navigate]({
          type: "standard__objectPage",
          attributes: {
            objectApiName: createobjectname,
            actionName: "new",
          },
        });
      }

}