import { LightningElement,api,track,wire } from 'lwc';
import getContactIndirectRels from '@salesforce/apex/GetContactIndirectRels.getContactIndirectRels';

const columns = [
    { label: 'First Name', fieldName: 'FirstName' },
    { label: 'Last Name', fieldName: 'LastName' },
    { label: 'Account Name', fieldName: 'Name', sortable: "true" },
    { label: 'Num Rels', fieldName: 'expr0', sortable: "true" }
];

export default class ShowContactIndirectRelationships extends LightningElement {

    @track data = [];
    columns = columns;
    sortDirection;


@api numItems;
@api sortBy;
@api numOfRels;
@api recordId;
@track allData = [];

@wire(getContactIndirectRels , { accRecId: '$recordId', numItems: '$numItems'})
wiredRecordsMethod({ error, data }) {
    console.log('data content is:'+JSON.stringify(data));
    if (data) {

        // get the row data
        this.allData = data.map(item=>{
            return {"FirstName":item.FirstName, "LastName":item.LastName, "Name":item.Name, "expr0":item.expr0};
            //return {"Contact.FirstName":item.Contact.FirstName, "Contact.LastName":item.Contact.LastName, "Account.Name":item.Account.Name, "NumRels":1, "IsDirect":item.Contact.IsDirect}
        });


    } else if (error) {
        this.error = error;
        this.data  = undefined;
    }
}



doSorting(event) {
    this.sortBy = event.detail.fieldName;
    this.sortDirection = event.detail.sortDirection;
    this.sortData(this.sortBy, this.sortDirection);
}

sortData(fieldname, direction) {
    let parseData = JSON.parse(JSON.stringify(this.allData));
    // Return the value stored in the field
    let keyValue = (a) => {
        return a[fieldname];
    };
    // cheking reverse direction
    let isReverse = direction === 'asc' ? 1: -1;
    // sorting data
    parseData.sort((x, y) => {
        x = keyValue(x) ? keyValue(x) : ''; // handling null values
        y = keyValue(y) ? keyValue(y) : '';
        // sorting values based on direction
        return isReverse * ((x > y) - (y > x));
    });
    this.allData = parseData;
}  


}


// flatten all row data once instead of one column at a time
        
        /*
//this is the final array into which the flattened response will be pushed. 
let contactsArray = [];
            
for (let row of data) {
     // this const stroes a single flattened row. 
     const flattenedRow = {}
     
     // get keys of a single row — Name, Phone, LeadSource and etc
     let rowKeys = Object.keys(row); 
    
     //iterate 
     rowKeys.forEach((rowKey) => {
         
         //get the value of each key of a single row. John, 999-999-999, Web and etc
         const singleNodeValue = row[rowKey];
         
         //check if the value is a node(object) or a string
         if(singleNodeValue.constructor === Object){
             
             //if it's an object flatten it
             this._flatten(singleNodeValue, flattenedRow, rowKey)        
         }else{
             
             //if it’s a normal string push it to the flattenedRow array
             flattenedRow[rowKey] = singleNodeValue;
         }
         
     });
    
     //push all the flattened rows to the final array 
     contactsArray.push(flattenedRow);

    }
    this.allData = contactsArray;

    _flatten = (nodeValue, flattenedRow, nodeName) => {        
    let rowKeys = Object.keys(nodeValue);
    rowKeys.forEach((key) => {
        let finalKey = nodeName + '.'+ key;
        flattenedRow[finalKey] = nodeValue[key];
    })
}
*/