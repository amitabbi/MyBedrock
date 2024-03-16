import { LightningElement, api, track, wire } from 'lwc';
import { NavigationMixin } from "lightning/navigation";
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';

const columns = [
    { label: 'Name', fieldName: 'Name' },
    {
        type: 'button-icon',
        typeAttributes:
        {
            iconName: 'utility:edit',
            name: 'edit',
            iconClass: 'slds-icon-text-error'
        }
    }
];

const othercolumns = [
    { label: 'Name', fieldName: 'Subject' },
    {
        type: 'button-icon',
        typeAttributes:
        {
            iconName: 'utility:edit',
            name: 'edit',
            iconClass: 'slds-icon-text-error'
        }
    }
];


export default class BusinessProcessUpdate extends NavigationMixin(LightningElement) {

    @api updateobjectname;
    //@api parRecordId = '006QE000003xPYXYA2';
    //@api parRecordId;
    @api recordid;
    @api rellistid;
    @track updateLabel;
    @api flds;

    @track tableData = [];
    error;
    @track columns;
    //@track columns = columns;
    @track isModalOpen = false;
    selectedRecId;
    otherobjects = ['Case'];
    showRelatedRecords = false;
    showErrorMessage = false;
    @api isLoading = false;



    connectedCallback(){
        console.log('this.updateobjectname in connectedCallback is:', this.updateobjectname);
        console.log('this.relListId in connectedCallback is:', this.rellistid);
        console.log('this.recordid in connectedCallback is:', this.recordid);
        console.log('flds in update child is:', JSON.stringify(this.flds));
        this.updateLabel = 'Update'+ ' '+ this.updateobjectname;


        this.fldName = this.updateobjectname + '.Name';

       

        if (this.otherobjects.includes(this.updateobjectname)){
            this.columns = othercolumns;
        }else{
            this.columns = columns;
        }
    
    }


    handleUpdateClick(event){
        
        
        this.isLoading = true;
        this.isModalOpen = true;
        this.isLoading = false;
        
    }

    @wire(getRelatedListRecords, {
        parentRecordId: '$recordid',
        relatedListId: '$rellistid',
        fields: '$flds'
        //sortBy: ['$updateobjectname'+'.Name']
      })
      listInfo({ error, data }) {
        
        if (data) {
            console.log('data records', JSON.stringify(data.records));

            if(Object.keys(data.records).length === 0){
                this.showErrorMessage = true;
                this.isLoading = false;
                return;
            }

            this.showRelatedRecords = true;

            if (this.otherobjects.includes(this.updateobjectname)){
                   
            // flatten the json and get Name and Id to display in the datatable
          this.tableData = data.records.map(item=>{
            return {"Subject":item.fields.Subject.value, "Id":item.fields.Id.value}
        });
            }else {
   
            // flatten the json and get Name and Id to display in the datatable
            this.tableData = data.records.map(item=>{
                return {"Name":item.fields.Name.value, "Id":item.fields.Id.value}
            });
            }
     
            this.isLoading = false;

        } else if (error) {
          this.error = error;
          this.data = undefined;
          this.showErrorMessage = true;
          this.showRelatedRecords = false;
          this.isLoading = false;
        }
        this.isLoading = false;
      }

     

    handleRowAction(event){
        this.selectedRecId = event.detail.row.Id;
        console.log('selectedRecId', this.selectedRecId);
        this.navigateToEditObjectPage(this.updateobjectname);
    }

        // Navigate to Edit Account Page
        navigateToEditObjectPage(updateobjectname) {
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: this.selectedRecId,
                    objectApiName: updateobjectname,
                    actionName: 'edit'
                },
            });
        }


        closeModal(){
            this.isModalOpen = false;
        }


}