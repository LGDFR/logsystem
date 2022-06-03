const fs = require('fs')
const cron = require('node-cron');
const {WebhookClient} = require('discord.js')
// Envoie de logs vers discord

var sendLog = function(dir, webhook){
  var hook = new WebhookClient({url:`${webhook}`})

  hook.send({content:`Logs du ${new Date().getDate()}-${new Date().getMonth()+1}-${new Date().getFullYear()}`,files:[{
    attachment: `${dir}`,
    name: `${dir}/${new Date().getDate()}-${new Date().getMonth()+1}-${new Date().getFullYear()}.log`
  }]})
}
// Système de vérification de l'existance d'un dossier
var direxist = async function(dir){
  return new Promise(resolve =>{
  fs.access(dir,(err)=>{
    
    // si le dossier existe
    if(err === null){
      resolve('Directory Exist')
    }else{
      resolve('Directory Not Exist')
    }
  })
})
}

// Système de création de dossier

var dirmake = async function(dir){
  fs.mkdirSync(dir)
  return new Promise(resolve =>{
    resolve('Directory Create')
    
  })
}

// Système de logs
var logs = async function(type, content,dir){
  
  var nom_du_fichier = `${dir}/${new Date().getDate()}-${new Date().getMonth()+1}-${new Date().getFullYear()}.log`
  var contenue = `\n[${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}][${type}]${content}`
  console.log(contenue)
  // Initialisation des functions
var DirectoryExist = await direxist(dir)
    // Vérification de l'existance du répertoire `logs`
    if(DirectoryExist === "Directory Exist"){
      
      var DirectoryExist = await direxist(nom_du_fichier)
      
      if(DirectoryExist === "Directory Exist"){
        // Ecrit dans le fichier à la suite  
        fs.appendFile(nom_du_fichier, contenue, function (err) {
          if (err) throw err;
          
       });
      }else{
        // Ecrit dans un nouveau fichier 
        fs.writeFile(nom_du_fichier, contenue, err => {
          if (err) {
            console.error(err);
          }
          
        });
      }
       
    }else{

      var DirectoryCreate = await dirmake(`${dir}`)
      // Creation du répertoire
      if(DirectoryCreate === "Directory Create"){

        var DirectoryExist = await direxist(nom_du_fichier)
        
        if(DirectoryExist === "Directory Exist"){
          // Ecrit à lui suite du fichier
          fs.appendFile(nom_du_fichier, contenue, function (err) {
            if (err) throw err;
            
         });
        }else{
          // Ecrit dans un nouveau fichier si l'ancien n'existe pas
          fs.writeFile(nom_du_fichier, contenue, err => {
            if (err) {
              console.error(err);
            }
            
          });
        }
      }
    }


}



// Tâche cron
cron.schedule('* * 16 * * *', function() {
  sendLog(`${__dirname}/logs/${new Date().getDate()}-${new Date().getMonth()+1}-${new Date().getFullYear()}.log`)
});

module.exports = {
  logs:logs
}
  

