# Programmeerproject

Er zijn voornamelijk twee groepen mensen geïnteresseerd in data van www.funda.nl: kopers en verkopers. Op deze twee groepen wil ik me richten. Met dit project wil ik een aantal vragen kunnen beantwoorden:

Vragen voor kopers:
* Wat zijn de duurste/goedkoopste gebieden?
* Hoe verhouden die zich tot de treinstations/wegen?

Vragen voor verkopers:
* Hoeveel kan ik ervoor vragen?
* Hoe lang duurt het voordat huizen (in de buurt) worden verkocht?

Dit zijn vragen die niet kunnen worden beantwoord met behulp van de huidige Funda-website. 

De tool begint met een landing page:

## Landing page
![Home](doc/home (2).png)

Hier scheid ik direct de kopers en verkopers. 

## Kopers - soort huis
![Kopers - soort huis](doc/huiskopen1van2.png)

De koper kiest hier het soort huis dat hij of zij wil: woonhuis, appartement, parkeerplaats of bouwgrond. Funda maakt hier ook onderscheid tussen en deze stap zorgt ervoor dat de scraper niet door alle huizen heen hoeft, maar alleen door bijvoorbeeld alle appartementen. Bovendien zouden parkeerplaatsen de gemiddelde vraagprijs omlaag halen, terwijl de gebruiker misschien helemaal niet geïnteresseerd is in parkeerplaatsen.

Op de site van Funda staan wel de aantallen vermeld, maar dit zegt een bezoeker niet zoveel. Een pie chart geeft meteen een visueel overzicht van de aantallen.

### Benodigde informatie
Aantal huizen per categorie over heel Nederland. 

1. http://www.funda.nl/koop/heel-nederland/
2. 1e .search-sidebar-filter  
3. alle .radio-group-items
4. .count

## Kopers - choropleth
![Kopers - choropleth](doc/huiskopen2van2.png)

Nu de koper gekozen heeft voor een soort huis, kan een weergave worden getoond van de prijzen van dat soort huis in Nederland. Dit gebeurt door middel van een choropleth-kaart. Postcodegebieden zijn gekleurd op basis van prijs. Het gaat hier om 4-cijferige postcodes. Ik kies bewust voor 4-cijferige postcodes, en niet voor bijvoorbeeld steden. In het laatste geval zou bijvoorbeeld heel Amsterdam een kleur krijgen, terwijl het juist interessant kan zijn om te zien welke gebieden in Amsterdam nu duurder zijn dan andere.

Gebruikers kunnen ook een laag met treinstations toevoegen en een met snelwegen. Zo kun je op zoek naar een huis dat in een goedkoper gebied is maar wel gunstig ligt ten opzichte van je werk. 

Mogelijke toevoegingen:

* Extra informatie over de postcode kan worden opgevraagd door over de postcode te hoveren. 
* Afstand tot POI kan worden opgevraagd: POI is bijvoorbeeld je werk, dat mag niet langer dan 30 min met de auto zijn of 60 min met OV. -> https://developers.google.com/maps/documentation/distance-matrix/intro

### Benodigde informatie
Shapefile/geoJSON met postcodegebieden, een met treinstations en een met snelwegen. http://places.geocoders.nl/ geeft bij het geven van een postcode een geoJSON terug van dat gebied.

Daarnaast heb ik de gemiddelde vraagprijs in die postcode voor dat soort huis nodig:

1. http://www.funda.nl/koop/hoorn-nh/1624/woonhuis/
2. .search-result-price

Ik zou ook graag nog verder willen filteren op:

* aantal kamers: 1, 2+, 3+, 4+, 5+
* woonoppervlakte: 50+, 75+, 100+, 150+, 250+
* aanwezigheid van: balkon, bedrijfsruimte, CV ketel, dakterras, duurzame energie, garage, jacuzzi, kluswoning, lift, lig/zitbad, monumentaal pand, open haard, sauna, schuur/berging, stoomcabine, tuin, zwembad

## Verkopers - soort huis
![Verkopers - soort huis](doc/huisverkopen1van2.png)

Ook de verkopers worden gescheiden op basis van het soort huis waarin ze geïnteresseerd zijn. Ik gebruik nu icoontjes ipv pie chart, want de verkoper hoeft niet geleid te worden in het proces: hij of zij heeft iets en wil dat verkopen.

### Benodigde informatie
1. http://www.funda.nl/koop/verkocht/heel-nederland/
[is nog niet vernieuwd, straks wel?]
2. 1e .search-sidebar-filter  
3. alle .radio-group-items
4. .count

## Verkopers - marktsituatie
![Verkopers - marktsituatie](doc/huisverkopen2van2.png)

Nadat de verkoper een postcode heeft ingevuld kan hij of zij beginnen met de analyse van de marktsituatie in dat gebied. Van elk verkocht huis van het gekozen type in de gekozen postcode kan worden afgelezen wat de vraagprijs is en hoe lang het te koop staat en of het in prijs is gedaald. Ook kan er worden doorgeklikt op het huis, waarna de bezoeker naar dat huis op de Funda site wordt gebracht. Zo kan hij of zij het huis direct vergelijken met het eigen te verkopen huis. 

De laatste maanden komen direct in beeld, de maanden daarvoor kunnen ook worden weergegeven. 

Ook hier zou ik verder willen filteren op:

* aantal kamers: 1, 2+, 3+, 4+, 5+
* woonoppervlakte: 50+, 75+, 100+, 150+, 250+
* aanwezigheid van: balkon, bedrijfsruimte, CV ketel, dakterras, duurzame energie, garage, jacuzzi, kluswoning, lift, lig/zitbad, monumentaal pand, open haard, sauna, schuur/berging, stoomcabine, tuin, zwembad

## API's en andere componenten
Voor de scraper gebruik ik node.js in combinatie met de x-ray module van https://github.com/lapwinglabs/x-ray. x-ray schrijft de verzamelde informatie weg naar een json-bestand. 

Voor de visualisatie maak ik gebruik van D3.js. De json-data van de scraper kan ik gemakkelijk gebruiken in D3. 

Ik hoop dat ik gebruik mag maken van de Postcode API van Webmapper. Daar is een gebruikersnaam voor nodig. Deze geeft de geografische informatie terug in de vorm van kant en klare geoJSON. Als ik hier geen toestemming voor krijg zal ik een postcode shapefile moeten gebruiken en die naar geoJSON omzetten. Het nadeel hiervan is dat postcode-data niet geüpdated wordt, wat bij de Postcode API wel het geval is. 

De applicatie krijgt de vorm van een onepage website met de vijf bovengenoemde onderdelen. Om een voorbeeld hiervan te geven: de knop 'Ik wil een huis kopen' brengt de gebruiker door middel van een anchor-link naar het juiste onderdeel. De visualisaties worden pas geladen wanneer de gebruiker een keus maakt wat betreft soort huis en postcode.