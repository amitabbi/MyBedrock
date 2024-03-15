public with sharing class OrganizationController {
    @AuraEnabled(cacheable=true)
  public static List<Organization> getOrgAddressCoordinates() {
  return [SELECT Id, Latitude, Longitude FROM Organization];
  }
}