global class BatchAccountUpdate implements Database.Batchable<sObject>, Database.RaisesPlatformEvents {
 
    global Database.QueryLocator start( Database.BatchableContext BC ) {
 
        //String query = 'SELECT Id,Name FROM Account';
        String query = 'SELECT Id,Account.Name FROM Quote';
        return Database.getQueryLocator( query );
 
    }
   
    global void execute( Database.BatchableContext BC, List< Account > scope ) {

        List<String> accNames = new  List<String>();
 
         for ( Account a : scope ) {
         
             accNames.add(a.Name);    
             
         }

         List<Account> acc = [SELECT Id, Name FROM Account WHERE Name IN :accNames LIMIT 1];
         system.debug('acc'+acc);
         //update scope;
 
    }   
    
    global void finish( Database.BatchableContext BC ) {
        // my test commit comment
         // my Github Actions commit comment
         // blah
         // blah more
         // blah :)
         // Nice
         // Nice work
    }
 
}