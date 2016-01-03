# Programmeerproject

Er zijn voornamelijk twee groepen mensen geïnteresseerd in data van www.funda.nl: kopers en verkopers. Daar wil ik me op richten. Met dit project wil ik een aantal vragen kunnen beantwoorden:

Vragen voor kopers:
* Wat zijn de duurste/goedkoopste gebieden?
* Hoe verhouden die zich tot de treinstations/wegen?

Vragen voor verkopers:
* Hoeveel kan ik ervoor vragen?
* Hoe lang duurt het voordat huizen worden verkocht?

Dit zijn vragen die niet kunnen worden beantwoord met behulp van de huidige Funda-website. 

De tool begint met een landing page:

## Landing page
![Home](doc/home.png)

Hier scheid ik direct de kopers en verkopers. 

## Kopers - soort huis
![Home](doc/kopen-soorthuis.png)

De koper kiest hier het soort huis dat hij of zij wil: woonhuis, appartement, parkeerplaats of bouwgrond. Funda maakt hier ook onderscheid tussen en deze stap zorgt ervoor dat de scraper niet door alle huizen heen hoeft, maar alleen door bijvoorbeeld alle appartementen. 

Op de site van Funda staan wel de aantallen vermeld, maar dit zegt een bezoeker niet zoveel. Een pie chart geeft meteen een visueel overzicht van de aantallen.

### Benodigdheden
Aantal huizen per categorie over heel Nederland. 

* http://www.funda.nl/koop/heel-nederland/
* 1e .search-sidebar-filter  
* alle .radio-group-items
* .count

