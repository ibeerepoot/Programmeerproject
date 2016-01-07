# Minimum Viable Product

## Huidig prototype
Het prototype is gemaakt op basis van een bootstrap template. De applicatie is daardoor voor de werking afhankelijk van de aanwezigheid van Bootstrap CSS en enkele andere CSS-bestanden, zoals animate.min.css. Hetzelfde geldt voor een aantal JS-scripjes. 

De applicatie bestaat eigenlijk uit 5 schermen. Deze schermen zal ik in detail gaan beschrijven.

### Scherm 1
![Scherm 1](doc/home2.png)
Dit scherm bevat een introductietekstje en de gebruiker drukt op een van de twee knoppen. De knoppen verwijzen met anchor links naar de betreffende div-gedeeltes: #kopers en #verkopers. 

### Scherm 2
![Scherm 2](doc/huiskopen1van2.png)
Wanneer de gebruiker op 'Ik wil een huis kopen' heeft geklikt of gewoon een stukje naar beneden is gescrolld vanaf het eerste scherm, komt hij hier terecht. Dit gedeelte bevat een piechart waarbij verschillende soorten bezit zijn uitgelicht. De benodigde data hiervoor is gescraped met behulp van Node.js en de Node.js module X-ray vanaf http://www.funda.nl/koop/heel-nederland/. De functie soort_aanbod_koop() vind je in scraper.js. De functie schrijft de data weg naar het JSON-bestand aanbod.json.  

De piechart geeft het huidige aantal weer van vier soorten bezit, namelijk woonhuis, appartement, parkeerplaats en bouwgrond. Het is gemaakt met D3 en D3Pie. De gebruiker kan over de verschillende delen hoveren en krijgt dan een tooltip te zien met het aantal en percentage van het geheel. Als de gebruiker op een van de delen van de piechart klikt, verdwijnt de piechart (met jQuery) en komt er een nieuwe div tevoorschijn met een choropleth map, nieuwe tekst en 2 aanvinkbare lagen:

### Scherm 3
![Scherm 3](doc/huiskopen2van2.png)
Dit scherm bevat nu alleen nog een afbeelding van Nederlandse gemeentes die zijn ingekleurd. Dit moet een interactieve choropleth gaan worden op basis van huidige data van funda. Een deel van de benodigde data kan ik al scrapen, met X-ray, naar vraagprijzen.json. Ik scrape per postcode heel Nederland per type bezit, zodat ik met alle vraagprijzen de gemiddelde vraagprijs van die postcode uit kan rekenen. Op basis daarvan krijgt die postcode op de kaart een kleur. Ik ga de kaart maken met leaflet.js. Daarmee kan ik namelijk ook gemakkelijk nieuwe lagen toevoegen, die gebruikers vervolgens aan en uit kunnen zetten. De extra lagen behoren niet tot de MVP en kan ik eventueel later dus nog doen.

Van Webmapper heb ik een gebruikersnaam gekregen voor de Geocoders API. Daarmee kan ik op een postcode zoeken en krijg ik een geoJSON terug, waarmee ik de kaart kan opbouwen. 

### Scherm 4
![Scherm 4](doc/huisverkopen1van2.png)
In dit scherm kiest de gebruiker voor het type bezit dat hij of zij wil verkopen. Als je op een van de vier icoontjes klikt, verdwijnt die div en komt er een nieuwe div met scherm 5.

### Scherm 5
![Scherm 5](doc/huisverkopen2van2.png)
De gebruiker wordt hier gevraagd een postcode in te vullen, waarna er een grid verschijnt dat gemaakt is in D3. De hoogte van het grid is afhankelijk van hoeveel aanbiedingen er zijn van het door de gebruiker gekozen type bezit in de door de gebruiker gekozen postcode. De adressen komen onder elkaar aan de linkerkant van het grid te staan, en de afgelopen maanden erboven. Elk vierkantje staat voor een week. De blauwgekleurde vierkantjes vertegenwoordigen de maanden dat dat woonhuis/appartement/parkeerplaats/bouwgrond te koop heeft gestaan. Wanneer je over een balk (het aantal weken dat het te koop heeft gestaan) heen beweegt, krijg je te zien wat de vraagprijs is, het adres en het aantal weken dat het te koop heeft gestaan. 

De data die hiervoor nodig zijn komt van de individuele huizenpagina's, dus de scraper moet verder gaan dan alleen de zoekresultaten. X-ray kan dit, maar het is me nog niet gelukt om het werkend te krijgen. 

# Optioneel

### Scherm 3 en 5
Bij beide schermen wil ik dat gebruikers nog verder kunnen filteren op:

* aantal kamers: 1, 2+, 3+, 4+, 5+
* woonoppervlakte: 50+, 75+, 100+, 150+, 250+
* aanwezigheid van: balkon, bedrijfsruimte, CV ketel, dakterras, duurzame energie, garage, jacuzzi, kluswoning, lift, lig/zitbad, monumentaal pand, open haard, sauna, schuur/berging, stoomcabine, tuin, zwembad

Zo kunnen ze de informatie nog beter op hun interesse afstemmen. Ook wil ik in scherm 5 nog dat gebruikers de duur kunnen opvragen van een reis van de postcode naar een specifiek punt. Zo zou de gebruiker zijn werkadres op kunnen geven en favoriete middel van vervoer, en als je dan over een postcodegebied heen hovert, krijg je te zien hoe lang die reis ongeveer duurt. Om dat uit te rekenen zal ik gebruik maken van de Google Distance API.