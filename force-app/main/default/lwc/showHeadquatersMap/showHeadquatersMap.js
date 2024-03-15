import { LightningElement, wire } from 'lwc';
import getCoordinates from '@salesforce/apex/OrganizationController.getOrgAddressCoordinates';

export default class ShowHeadquatersMap extends LightningElement {


    latitude;
    longitude;
    mapMarkers=[];
    listView;

    @wire (getCoordinates) wiredCoordinates({data,error}){
        if (data) {
        console.log(data[0].Latitude); 
        console.log(data[0].Longitude); 
        this.latitude = data[0].Latitude;
        this.longitude = data[0].Longitude;
        this.updateMap(this.latitude, this.longitude);
        } else if (error) {
        console.log(error);
        }
   }

   updateMap(mylatitude, mylongitude){
    this.mapMarkers = [
        {
            location: {
                Latitude: mylatitude,
                Longitude: mylongitude,
            },
            mapIcon: {
                path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
                fillColor: 'gold',
                fillOpacity: .8,
                strokeWeight: 0,
                scale: .10,
                anchor: {x: 122.5, y: 115}
                },
                title: 'The Landmark @ One Market, Suite 300, San Francisco, CA 94105'
        },
    ];
}

}