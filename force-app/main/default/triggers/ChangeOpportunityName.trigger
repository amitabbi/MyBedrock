trigger ChangeOpportunityName on Opportunity (before insert) {

DateTime now = DateTime.now();
List<Opportunity> newOppList = new List<Opportunity>();

try{
            for(Opportunity eachOpp : Trigger.New){
                eachOpp.Name = String.valueOf(now);
                newOppList.add(eachOpp);
            }
            upsert newOppList;
        }catch(Exception e){
            System.debug('Error at line number '+e.getLineNumber()+'. '+e.getMessage());
        }
    

}