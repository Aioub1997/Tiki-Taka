function onEdit(e) {
  const feuille = e.source.getActiveSheet();
  const cellule = e.range;
  
  if (cellule.getColumn() == 3 && cellule.getValue() == true) {
    const ligne = cellule.getRow();
    const nom = feuille.getRange(ligne, 1).getValue();
    const email = feuille.getRange(ligne, 2).getValue();

    if (!email || !nom) return;

    try {
      const template = HtmlService.createTemplateFromFile('convocation');
      template.nom = nom;
      
      const corpsHtml = template.evaluate().getContent();

      MailApp.sendEmail({
        to: email,
        subject: "Convocation",
        htmlBody: corpsHtml
      });

      // La case devient verte avec le "V" blanc
      cellule.setBackground("#27ae60"); 
      cellule.setFontColor("white");
      
    } catch (erreur) {
      cellule.setBackground("#e74c3c");
      cellule.setFontColor("white");
    }
  }
}