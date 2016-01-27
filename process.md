# 4 januari
De url naar alle huizen in een bepaalde postcode is niet gewoon: 
http://www.funda.nl/koop/' + postcode + '/' + soort + '/

Maar het is:
http://www.funda.nl/koop/' + stad + '/' + postcode + '/' + soort + '/

Ik moet dus ook aan de url kunnen toevoegen in welke stad de postcode zit. Postcode 1624 in Hoorn heeft als url:
http://www.funda.nl/koop/hoorn-nh/1624/

Opgelost met POST request naar funda site. Moest wel met delay want funda gooide me er eerst uit.

# 5 januari
Probeer de spaties en enters te verwijderen uit de json bestanden. Volgens verschillende pagina's kon dat gemakkelijk met de vorige versie van x-ray, maar (nog) niet met de nieuwe. Daar kon je .prepare(functie) en .format(functie) gebruiken. Wil liever niet downgraden. Ik kijk eerst wel of het lukt wanneer ik de data gebruik in D3. D3 lijkt een soortgelijke manier te hebben met .format. 

Edward Mac Gillavry van webmapper gebeld om toegang te krijgen tot de Geocoders API. Heb nu een account! Daarmee krijg ik een geoJSON van de postcodes terug :D.

# 6 januari
Bezig geweest het aanbod in Nederland per type netjes in een pie chart te krijgen. Lukte gewoon in D3, maar het toevoegen van labels vond ik lastig. Ik wilde het overzichtelijker, beter leesbaar. De D3Pie library tegengekomen. Daarmee ging het gemakkelijker. Ook gelukt om de strings netjes te formatten met regex, net voordat het naar de visualisatie geschreven wordt:

.replace(/\s/g,'').split(/[0-9]/)[0]

Bij het deel Verkopers wilde ik niet weer een piechart doen, dus heb ik nu vier icoontjes waar je op klikt om verder te gaan.

# 7 januari
Gewerkt aan de transitions van de applicatie, dus van de pie chart naar de choropleth en van de icoontjes naar de informatie voor verkopers. Zat eerst heel moeilijk te doen met visibility classes en dan met addClass en removeClass maar het was eigenlijk heel simpel met jQuery hide() en show(). 

Het prototype krijgt hierdoor echt vorm. Ook heb ik het design voor de verkoopinformatie verder uitgedacht. Het wordt een soort grid met ingekleurde vakjes voor de weken dat een huis te koop heeft gestaan. Een beetje net als de activiteit van een gebruiker op Github. Als je er dan overheen hovert krijg je de vraagprijs en meer info te zien. 

# 8 januari
Design document en presentatie.

# 11 januari
Begonnen met choropleth map mbv Leaflet.js. Daarmee kun je namelijk verschillende lagen toevoegen aan een basemap van mapbox, wat echt top is voor mijn project. En je kan makkelijk layers toevoegen voor treinstations en snelwegen. Dit gaat makkelijker dan met D3-kaarten. 

Geojsons van alle postcodes gescraped van places.geocoders API. 

De vorm van de postcodes was wel goed, maar de plek kwam niet overeen met de plek van Nederland op de basemap. Bleek uiteindelijk door bootstrap te komen. Nu komt ie wel overeen. Style wat aangepast.

# 12 januari
Begin met berekenen vraagprijzen per postcode. Ik heb een geojson met alle appartementen bijvoorbeeld, en elk appartement heeft daar een adres, postcode en vraagprijs. Nu moet ik alle appartementen met dezelfde postcode gaan koppelen en daar het gemiddelde van berekenen. Heel inefficient om elke keer alles door de loopen op zoek naar de zelfde postcode. 

Oplossen met crossfilter module?

# 13 januari
Crossfilter toch best wel lastig te begrijpen. Eerst gewoon proberen door alle postcodes heen te gaan en te kijken welke gemiddelde vraagprijs erbij hoort elke keer dat je een geojson bestand heen gaat. Eerst moet de data nog gecleaned worden. Daarna naar gemiddeldes.json geschreven zodat ik erbij kan bij het maken van de kaart. Dit gebeurt allemaal buiten de webapplicatie, want de gebruiker moet niet hoeven wachten tot alle gemiddeldes zijn uitgerekend. Dit wordt dus gedaan op hetzelfde moment als het scrapen van de data, zodat de informatie al aanwezig is wanneer een gebruiker de applicatie gebruikt. 

Het bestand is gemaakt, maar moet nog worden toegepast. Elke keer dat de shapefile van het postcodegebied in de applicatie wordt getekend op de kaart, moet dus de juiste kleur worden gekozen aan de hand van de gemiddelde vraagprijs. Even zien hoe dat werkt, want nu wordt alles gewoon groen.

# 14 januari
Moeilijk om de kleur van de postcodes aan te passen. In de voorbeelden van LeafletJS staan de kenmerken namelijk in hetzelfde geojson-bestand. Bij mij staat het kenmerk dat de kleur bepaald, de vraagprijs, in een ander bestand. Ik kan dus niet gewoon het geojson-feature meesturen aan de style-functie, wat heel gemakkelijk is. Ik moet ook gemiddeldes.json uitlezen en de juiste vraagprijs opzoeken. Het lukt wel om op basis van postcodes te kleuren, dus bijvoorbeeld alle postcodes tussen 1000 en 2000 een kleur, tussen 2000 en 3000, enz.

# 15 januari
Gelukt om de juiste kleuren te krijgen! Kaart krijgt nu mooi vorm. Nu alleen nog met appartementen.

# 17 januari
Bezig de kaart ook te kleuren bij de andere vormen, dus als je op woonhuis klikt moet de kaart gekleurd worden op basis van woonhuizen. Er zit nu een grijze overlay voor de kaart, die weggaat wanneer je ´element inspecteren´ doet. Raar. Ook worden sommige gebieden niet direct gekleurd, maar zijn de grijs totdat je er met je muis overheen gaat.

Andere huissoorten nu in de kaart gezet, maar de gebieden kleuren niet goed meer. De juiste vraagprijs wordt nog wel goed weergegeven in de tooltip, maar er zijn slechts enkele gebieden gekleurd, en dan ook nog heel licht terwijl het donkerder zou moeten zijn. Legenda klopt nu wel.

# 18 januari
Bij parkeerplaatsen slaan de kleuren natuurlijk nergens op. Zijn meestal maar een paar duizend euro, dus bijna allemaal tussen 0 en 50000. Beter weglaten? Is toch niet zo interessant, en bovendien kun je niet echt spreken van een 'huis'.

# 19 januari
Parkeerplaatsen en bouwgrond weggehaald. Misschien best interessant, maar door het verschil in niveaus van vraagprijzen e.d. kost het veel tijd. Beter meer functionaliteit bieden voor appartementen en woonhuizen. https://github.com/emeeks/d3.layout.timeline lijkt me mooi voor infotabel verkopers. 

# 20 januari
Kaartje weer in orde gekregen. Ging niet goed bij berekenen gemiddelde vraagprijzen. Postcodes kwamen meerdere keren voor. Nu een object gemaakt met postcode als key en vraagprijs als value. Hoef ik ook niet meer door alles heen te loopen om de juiste vraagprijs bij de postcode te vinden. 

# 21 januari
Gelukt om verkoopdata van huizen te scrapen. X-ray ondersteunde voorheen dat je een pagina kon scrapen en dan weer op die linkjes kon klikken om verder te scrapen op die pagina's. Daar zijn nu issues mee, bij meerdere mensen (merk ik op de github repository). Nu pak ik eerst de linkjes, en pak ik dan zo'n linkje om de verkoopdetails te scrapen. Duurt wel lang. 

# 22 januari
Ik merk dat sommige huizen undefined verkoopdetails terug geven. De eerste lijken wel allemaal goed te zijn, maar aan het eind krijg ik een heel aantal keer undefined objecten terug. Misschien dat Funda het niet leuk meer vindt en me een andere pagina teruggeeft?

Het JSON bestand dat ik schrijf met de scraper moet anders. De datum van de start van de verkoop bijvoorbeeld, staat nu in json.details.start, maar moet json.start worden voor de timeline. Anders pakt layout.timeline de data niet. Functie herschrijfjson geschreven.

# 24 januari
Probeer nog steeds een goed bestand met spoor- en snelwegen te vinden, maar geen resultaat. Rijkswaterstaat heeft wel wat, en die heb ik van shapefile naar json geconverteerd met ogr2ogr, maar de projectie is verkeerd denk ik. In Mapbox geeft ie namelijk niet goed weer en ook op mijn kaartje niet. 

Correctie, toch wel iets gevonden! De maker hiervan is een held: https://github.com/openstate/geodata/blob/master/nwbspoorwegen/spoorvakken.geojson

# 25 januari
De spoorwegen wil ik als laag op het kaartje, dus dat je hem aan en uit kan zetten. Met leaflet kun je aangeven welke lagen direct aanwezig moeten zijn, welke lagen de basislagen zijn (dus waar je er maar een van kunt hebben) en welke overlays je wilt hebben. Het is me wel gelukt om de spoorwegen erop te krijgen, maar nu is de basislaag weer weg...

Basislaag ook weer tevoorschijn getoverd. Nu kun je als gebruiker de spoorwegenlaag aanzetten.

# 27 januari
SVG van de verkooptabel is nu nog standaard 300x300, maar als er meer huizen zijn heb ik een probleem. Hoogte moet dus dynamisch aangepast worden. Daarvoor moet het aantal huizen x de hoogte (18) en nog een beetje erbij, door de marges. Ziet er nu goed uit.

De ticks zijn ook nog een probleem. Soms is de looptijd maar heel kort, en kun je een tick per maand doen, maar als er een huis is geweest met een looptijd van meerdere jaren, gaan de ticks overlappen. Hoe bereken je hoeveel ticks er komen? 

Blijkbaar kun je de maximale originalEnd datum minus de minimale originalStart datum doen en krijg je een getal. Dat is in de miljarden. Daarmee kan ik aangeven wanneer er een tick per maand moet komen, of een tick per 3 maanden, of een tick per 6 maanden. Nu komen de ticks er altijd netjes op te staan. 