import { LightningElement, api, wire } from 'lwc';
import getBusinessProcessMap from '@salesforce/apex/BusinessProcessMapping.getBusinessProcessMap';
import showProcess from '@salesforce/apex/BusinessProcessMapping.showProcess';

export default class BusinessProcessParent extends LightningElement {

    @api objectApiName;
    @api recordId;


    //createobjectname = "Product2";
    //updateobjectname = "Quote";
    viewobjectname;
    createobjectname;
    updateobjectname;
    rellistid;
    viewrellistid;
    showChildren;
    showParent;
    flds;
    viewflds;
    otherobjects = ['Case'];
    showBPMessage = false;

    

    connectedCallback(){
        console.log('recordId in parent is:', this.recordId);
    }

    @wire(showProcess , { recId: '$recordId', parentObjectApiName: '$objectApiName'})
    wiredRecordsMethodShowProcess({ error, data }) {
        console.log('showProcess data is:'+JSON.stringify(data));

        if (data == undefined){
            return;
        }
        else if (data) {
            //this.isValid = data.isValid;
            //if (this.isValid == true){
               
                //this.showChildren = true;
            //}
          
            this.showParent = true;
            


            getBusinessProcessMap({ parentObjectApiName: this.objectApiName})
            .then((result) => {
                console.log('data business process map is:'+JSON.stringify(result));
                if (result) {
                    this.isValid == true;
                    //this.showParent = true;
                   // if (this.showParent){
                    //this.showParent = true;
                    this.showChildren = true;
                    this.createobjectname = result.CreateRelatedObjectApiName;
                    this.updateobjectname = result.UpdateRelatedObjectApiName;
                    this.rellistid = result.relListId;
                    this.viewrellistid = result.viewRelListId;
                    if (!this.otherobjects.includes(this.updateobjectname)){
                   // if (this.updateobjectname != 'Case'){
                    this.flds = [this.updateobjectname+'.Name',this.updateobjectname+'.Id'];}
                    else{
                        this.flds = [this.updateobjectname+'.Subject',this.updateobjectname+'.Id'];
                    }
                    this.viewobjectname = result.ViewRelatedObjectApiName;
                    if (this.viewobjectname != 'Case'){
                    this.viewflds = [this.viewobjectname+'.Name',this.viewobjectname+'.Id'];
                    }else{
                        this.viewflds = [this.viewobjectname+'.Subject',this.viewobjectname+'.Id'];
                    }
                    
                //}
                    //this.data  = data;
                    //this.error = undefined;
            
                } 
            })
            .catch((error) => {
                console.log('erro status -' + error);
            });









    
        } else if (error) {
            this.error = error;
            this.data  = undefined;
        }else{
            this.showBPMessage = true;
              
           
             
            
        }
    }


/*
    @wire(getBusinessProcessMap , { parentObjectApiName: '$objectApiName'})
wiredRecordsMethod({ error, data }) {
    console.log('data business process map is:'+JSON.stringify(data));
    if (data) {
       // if (this.showParent){
        //this.showParent = true;
        this.showChildren = true;
        this.createobjectname = data.CreateRelatedObjectApiName;
        this.updateobjectname = data.UpdateRelatedObjectApiName;
        this.rellistid = data.relListId;
        this.viewrellistid = data.viewRelListId;
        if (!this.otherobjects.includes(this.updateobjectname)){
       // if (this.updateobjectname != 'Case'){
        this.flds = [this.updateobjectname+'.Name',this.updateobjectname+'.Id'];}
        else{
            this.flds = [this.updateobjectname+'.Subject',this.updateobjectname+'.Id'];
        }
        this.viewobjectname = data.ViewRelatedObjectApiName;
        if (this.viewobjectname != 'Case'){
        this.viewflds = [this.viewobjectname+'.Name',this.viewobjectname+'.Id'];
        }else{
            this.viewflds = [this.viewobjectname+'.Subject',this.viewobjectname+'.Id'];
        }
        
    //}
        //this.data  = data;
        //this.error = undefined;

    } else if (error) {
        this.error = error;
        this.data  = undefined;
    }
}
*/






   

}