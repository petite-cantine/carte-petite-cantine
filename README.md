# Carte des acteurs – La Petite Cantine (Villeurbanne)

Carte interactive qui lit en direct un Google Sheet (acteurs, contacts, projets) et le géolocalise.

- `index.html` : l'application (Leaflet + OpenStreetMap, aucun build).
- `geo.js` : coordonnées déjà calculées par adresse.
- `apps-script/Code.gs` : script Google qui enregistre les collaborations validées (♥) dans la colonne « Validé » du Sheet.

Pour changer de Sheet ou activer l'enregistrement des cœurs, modifier `SHEET_ID` et `SCRIPT_URL` en haut du script de `index.html`.
