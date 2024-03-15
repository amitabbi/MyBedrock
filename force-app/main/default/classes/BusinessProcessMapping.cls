public with sharing class BusinessProcessMapping {
    public BusinessProcessMapping() {

    }

    @AuraEnabled(cacheable=true)
    public static Boolean showProcess(String recId, String parentObjectApiName){
        boolean isValid = false;
        String ObjApiName = parentObjectApiName;
        //String currentRecId = '006QE000003zMDBYA2';

        List<Process_Component_Condition__c> pcc = [SELECT Id, ConditionType__c, FieldApiName__c, Operator__c, FieldValue__c FROM Process_Component_Condition__c WHERE Process_Component_Mapping__r.ParentObjectApiName__c = :parentObjectApiName AND Process_Component_Mapping__r.isActive__c = true];
        system.debug('pcc is:'+ pcc);

        if (pcc.size()<=0){
            return isValid;
        }

        String FieldApiName = '';
        String Operator = '';
        String FieldApiValue = '';
        String whereCondition = '';
        
        for(Process_Component_Condition__c cond: pcc){
            FieldApiName = cond.FieldApiName__c;
            Operator = cond.Operator__c;
            FieldApiValue = cond.FieldValue__c;

            whereCondition = whereCondition + FieldApiName + Operator + FieldApiValue + ' AND ';
            
            //system.debug('whereCondition is:'+ whereCondition);
        }
        system.debug('whereCondition is:'+ whereCondition);
        whereCondition = whereCondition.removeEnd(' AND ');
        system.debug('whereCondition is:'+ whereCondition);
        
        String masterQuery = 'SELECT Id FROM ' + ObjApiName + ' WHERE ' + whereCondition + ' AND Id = ' + '\''+ recId + '\'';
        
        //'\''+ recId + '\''
        system.debug('masterQuery is:'+ masterQuery);
        List<Object> objRes = Database.query(masterQuery);
        system.debug('objRes is:'+ objRes);

        if (objRes.size()>0){
            isValid = true;
        }
        system.debug('isValid is:'+ isValid);

        return isValid;
    }



    @AuraEnabled(cacheable=true)
    public static Map<String, String> getBusinessProcessMap(String parentObjectApiName){

       
        List<String> finalList = new List<String>();
        List<Process_Component_Mapping__c> pcm = [SELECT ParentObjectApiName__c, CreateRelatedObjectApiName__c, UpdateRelatedObjectApiName__c, ViewRelatedObjectApiName__c FROM Process_Component_Mapping__c WHERE ParentObjectApiName__c = :parentObjectApiName AND isActive__c = true LIMIT 1];
        
        String parentObjectName = pcm[0].ParentObjectApiName__c;
        String updateRelatedObjectName = pcm[0].UpdateRelatedObjectApiName__c;
        String viewRelatedObjectName = pcm[0].ViewRelatedObjectApiName__c;
        


        String relListId = getChildRelationshipName(parentObjectName, updateRelatedObjectName);
        String viewRelListId = getChildRelationshipName(parentObjectName, viewRelatedObjectName);

 
        Map<String, String> finalMap = new  Map<String, String>();
        finalMap.put('ParentObjectApiName', pcm[0].ParentObjectApiName__c);
        finalMap.put('UpdateRelatedObjectApiName', pcm[0].UpdateRelatedObjectApiName__c);
        finalMap.put('relListId', relListId);
        finalMap.put('viewRelListId', viewRelListId);
        finalMap.put('CreateRelatedObjectApiName', pcm[0].CreateRelatedObjectApiName__c);
        finalMap.put('ViewRelatedObjectApiName', pcm[0].ViewRelatedObjectApiName__c);

  
        
        
        system.debug('finalMap is:' + finalMap);
       
        //return finalList;
        return finalMap;
        
    }

    public static String getChildRelationshipName(String parentsObj, String childsObj) {

        //Create sobject Instance 
        sObject dynamicObj = (SObject)Type.forName(parentsObj).newInstance();
        //get the type token
        SObjectType sObjType = dynamicObj.getSObjectType();
        //get describe
        DescribeSobjectResult sObjDescribe = sObjType.getDescribe();
        //loop through children
        for(Schema.ChildRelationship rels :sObjDescribe.getChildRelationships()){
            //find the child
            if(String.ValueOf(rels.getChildSObject()) == childsObj){
                system.debug('Relationship Name' + rels.getRelationshipName());
                return rels.getRelationshipName();
                
            }
        }
        return null;
    }

    @AuraEnabled(cacheable=true)
    public static Map<Id, String> getFilesToPreview(String recId){

        //system.debug('recMap'+recMap);
        Map<Id, String> finalFilesMap = new Map<Id, String>();
        Map<Id, String> inputMap = new Map<Id, String>();
        inputMap.put(recId, 'blah');

       Set<Id> newSet = inputMap.keySet();
        //newSet.add(recId);


        List<ContentDocumentLink> cdl = [Select ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId IN : newSet];

        List<Id> setEntityIds = new List<Id>();
        for(ContentDocumentLink cd: cdl){
            setEntityIds.add(cd.ContentDocumentId);
        }

        List<ContentVersion> cv = [Select Id, ContentDocumentId, Title FROM ContentVersion WHERE ContentDocumentId IN : setEntityIds];
        for (ContentVersion cvv: cv){
            finalFilesMap.put(cvv.ContentDocumentId, cvv.Title);

        }


        return finalFilesMap;


    }
   
}