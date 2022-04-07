
let _context;
let userPrincipalName;
let requestId;

   
    

    function InitializeTeamsContext() {
    try {
        // Initialize SDK
        microsoftTeams.initialize();
      // Fetch MS-Teams Context and store it in the _context variable
          microsoftTeams.getContext((context, error) => {
          _context = context;
              subEntityId = context.subEntityId;
              console.log("Valor en base64 es " + subEntityId);
              //let decodeSEI = atob(subEntityId);
              //console.log("Valor en base64 es " + decodeSEI);
              const objEntity = JSON.parse(subEntityId);
              let email = context.userPrincipalName;
              userPrincipalName = email.substring(0, email.indexOf('@')).replace(".", "");
              const welcomeMsg = document.querySelector('p#welcomeMsg');
              requestId = objEntity.ID;
              welcomeMsg.innerHTML = "Graba un video para " + objEntity.persona;

    });
  }
    catch (err) {
        alert('error ' + err.message);
  }
}

    InitializeTeamsContext();


