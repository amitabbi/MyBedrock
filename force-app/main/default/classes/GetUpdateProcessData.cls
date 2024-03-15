public with sharing class GetUpdateProcessData {
    public GetUpdateProcessData() {

    }

    @AuraEnabled(cacheable=true)
    public static List<Object> getObjectData(String recId, String objectApiName){
  
        
        //String myObj = objectApiName;
        String query = 'SELECT Id, Name from objectApiName';
        //‘SELECT Id, Name FROM Account WHERE AccountId = \” + recId + ‘\”;
        List<sObject> objr = Database.query(query + ' WHERE OpportunityId = :recId');
        //List<Object> objr = [SELECT Id, Name FROM myObj WHERE OpportunityId =: recId];
        return objr;
    }
}