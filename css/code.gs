function onEdit(e) {
  const feuille = e.source.getActiveSheet();
  const cellule = e.range;
  
  // Vérifie la colonne 3 (C) et si la case est cochée
  if (cellule.getColumn() == 3 && cellule.getValue() == true) {
    const ligne = cellule.getRow();
    const nom = feuille.getRange(ligne, 1).getValue();   // Colonne A
    const email = feuille.getRange(ligne, 2).getValue(); // Colonne B

    if (!email || !nom) return;

    try {
      // Prépare l'email à partir du fichier HTML
      const template = HtmlService.createTemplateFromFile('convocation');
      template.nom = nom;
      const corpsHtml = template.evaluate().getContent();

      // Envoie l'email
      MailApp.sendEmail({
        to: email,
        subject: "Convocation",
        htmlBody: corpsHtml
      });

      // Rendu visuel dans Sheets : Case VERT foncée, texte BLANC
      cellule.setBackground("#27ae60"); 
      cellule.setFontColor("white");
      
    } catch (erreur) {
      // Rendu visuel en cas d'erreur : Case ROUGE
      cellule.setBackground("#e74c3c");
      cellule.setFontColor("white");
    }
  }
}