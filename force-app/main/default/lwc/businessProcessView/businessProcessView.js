import { LightningElement, api, track, wire } from 'lwc';
import { NavigationMixin } from "lightning/navigation";
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';
import getFilesToPreview from '@salesforce/apex/BusinessProcessMapping.getFilesToPreview';


export default class BusinessProcessCreate extends NavigationMixin(LightningElement) {

    @api viewobjectname;
    //@api parRecordId = '006QE000003xPYXYA2';
    //@api parRecordId;
    @api recordid;
    @api viewrellistid;
    @track viewLabel;
    @api viewflds;

    error;
    @track isModalOpen = false;
    showFile = false;
    showRelatedRecords = false;
    showErrorMessage = false;
    recMap = [];
    filesData =[];
    @api isLoading = false;



    connectedCallback(){
        console.log('this.viewobjectname in view connectedCallback is:', this.viewobjectname);
        console.log('this.viewrellistid in view connectedCallback is:', this.viewrellistid);
        console.log('this.recordid in view connectedCallback is:', this.recordid);
        console.log('viewflds in view child is:', JSON.stringify(this.viewflds));
        this.viewLabel = 'View'+ ' '+ this.viewobjectname;

     

       
       

        //this.mapOfValues.push({value:data[key], key:key})

        //this.fldName = this.updateobjectname + '.Name';
    
    }


    handleViewClick(event){

        if (this.viewobjectname === 'File'){
            this.isLoading = true;
        this.isModalOpen = true;
    

        this.recMap.push({key:this.recordid, value:'blah'});
        console.log('recMap is:',JSON.stringify(this.recMap));
       
      getFilesToPreview({recId: this.recordid})
      .then((result) => {
        
        if(result){ 
            console.log(result);

            if(Object.keys(result).length === 0){
                this.showErrorMessage = true;
                this.isLoading = false;
                return;
            }

            
                this.showFile = true;
            
            
            this.filesData = Object.keys(result).map(item=>({"label":result[item],
             "value": item,
             "url":`/sfc/servlet.shepherd/document/download/${item}`
            }));
            console.log(this.filesData);
        }else{
            this.showFile = false;
            
        }
        this.isLoading = false;
    })
    .catch((error) => {
        this.error = error;
        this.showErrorMessage = true;
        this.showFile = false;
        this.showRelatedRecords = false;
        this.isLoading = false;
      });
    }else{
        this.isModalOpen = true;
        this.showRelatedRecords = true;
        this.showFile = false;
        this.isLoading = false;
    }
}
     






      /*@wire(getFilesToPreview, {recMap: '$mapOfValues'})
      //@wire(getFilesToPreview, {recordId: '$recordid', 'recordId': 'recordId'})
      wiredResult({data, error}){ 
          if(data){ 
              console.log(data)
              this.filesData = Object.keys(data).map(item=>({"label":data[item],
               "value": item,
               "url":`/sfc/servlet.shepherd/document/download/${item}`
              }))
              console.log(this.filesData)
          }
          if(error){ 
              console.log(error)
          }
      }*/
        
        //this.navigateToEditObjectPage(this.updateobjectname);
    //}







    @wire(getRelatedListRecords, {
        parentRecordId: '$recordid',
        relatedListId: '$viewrellistid',
        fields: '$viewflds'
        //sortBy: ['$updateobjectname'+'.Name']
      })
      listInfo({ error, data }) {
        if (data) {
            console.log('data records', JSON.stringify(data.records));

            if(Object.keys(data).length === 0){
                this.showErrorMessage = true;
                return;
            }

            this.data = data.records;
            if (this.viewobjectname != 'File'){
            this.showRelatedRecords = true;
            }


        } else if (error) {
          this.error = error;
          this.data = undefined;
          this.showErrorMessage = true;
          this.showFile = false;
          this.showRelatedRecords = false;
        }
      }

      
/*
      filesData =[]
    @wire(getFilesToPreview, {recMap: '$mapOfValues'})
    //@wire(getFilesToPreview, {recordId: '$recordid', 'recordId': 'recordId'})
    wiredResult({data, error}){ 
        if(data){ 
            console.log(data)
            this.filesData = Object.keys(data).map(item=>({"label":data[item],
             "value": item,
             "url":`/sfc/servlet.shepherd/document/download/${item}`
            }))
            console.log(this.filesData)
        }
        if(error){ 
            console.log(error)
        }
    }
*/


        closeModal(){
            this.isModalOpen = false;
        }

        previewHandler(event){
            console.log(event.target.dataset.id)
            this[NavigationMixin.Navigate]({ 
                type:'standard__namedPage',
                attributes:{ 
                    pageName:'filePreview'
                },
                state:{ 
                    selectedRecordId: event.target.dataset.id
                }
            })
        }


}