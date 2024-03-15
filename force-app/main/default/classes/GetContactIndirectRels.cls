public with sharing class GetContactIndirectRels {
    public GetContactIndirectRels() {

    }
    @AuraEnabled(cacheable=true)
    //public static List<AccountContactRelation> getContactIndirectRels(String accRecId, Integer numItems){
        public static List<AggregateResult> getContactIndirectRels(String accRecId, Integer numItems){
            List<Object> finaList = new List<Object>();
        set<Id> conList = new set<Id>();
        List<Contact> con = [SELECT Id FROM Contact WHERE AccountId =:accRecId];
        //List<AccountContactRelation> acr = [SELECT Id FROM AccountContactRelation WHERE AccountId =:accRecId];

        for(Contact c: con){
            conList.add(c.Id);
        }

        //List<AggregateResult> cons = [SELECT COUNT(Id), AccountId, FirstName, Account.Name FROM Contact WHERE AccountId IN (SELECT Id FROM Account WHERE Id IN : conList) GROUP BY Account.Name, FirstName, AccountId];
        //List<AccountContactRelation> acrs = [SELECT AccountId, Contact.FirstName, Account.Name FROM AccountContactRelation WHERE Id IN : conList];


        List<AggregateResult> acr = [SELECT COUNT(Id), Contact.FirstName, Contact.LastName, Account.Name, IsDirect, AccountId FROM AccountContactRelation WHERE ContactId IN :conList AND isDirect = false GROUP BY Contact.FirstName, Contact.LastName, Account.Name, IsDirect, AccountId LIMIT : numItems];



    
       // List<AccountContactRelation> acrList = [SELECT Contact.FirstName, Contact.LastName, Account.Name, IsDirect FROM AccountContactRelation WHERE ContactId IN :conList AND isDirect = false LIMIT : numItems];
        return acr;
    }
}