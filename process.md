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