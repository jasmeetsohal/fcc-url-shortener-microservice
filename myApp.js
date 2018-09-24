const dns = require('dns');
const appService = require('./app.service');

 
async function generateShortUrl(req,res,next){
  let urlRegx = /^(http(s)?:\/\/)([w]{3})?([\w]+).([\w]+)(\/[\w])*/i;
  let url = req.body.url;
  if(urlRegx.test(url)){
      dns.lookup(url.split("://")[1],(err,address,family)=>{
         if(err) {
             console.error(err.stack);
         }
         console.log(`Addresss :: ${address} and Family :: ${family}`);
        if(!address){
          res.json({"error":"invalid Hostname"});
        }
        else{
         appService.findURL({ original_url: url }).then((urlRecord,err)=>{
            if(err){
               console.log("Error while getting Existing URL : ",err);
            }  

            if(urlRecord){
              return res.json({
                original_url: urlRecord.original_url,
                short_url : urlRecord.short_url
              });
               
            }
            else{
              console.log("Before next sequencer call :: ");
              appService.getSeq('url_seq').then((seq,err)=>{
                if(err){
                  console.error("Error while getting Sequencer :: ",err);
                }
      
                  appService.saveURL(url,seq.counter).then((saveUrl,err)=>{
                    if(err){
                        console.error("Error while saving URL : ",err);
                        return;
                    }
                         return res.json({
                           original_url : saveUrl.original_url,
                           short_url: saveUrl.short_url
                         });
                  }).catch((e)=>{
                      console.error("Exception while saving URL : ",e);
                  });
                 
              }).catch((e)=>{
                console.error("Exception while getting Sequencer : ",e);
              });
            }
         }).catch((e)=>{
           console.error("Exception while getting existing URL : ",e);
         });
        }
      });
  }
  else{
     res.json({"error":"invalid URL"});
  }
}

function getShortUrl(req,res,next){
     appService.findURL({short_url:req.params.short_url}).then((urlRecord,err)=>{
       if(err)    {
         console.error("Error in GetShortUrl :: ",err);
         return;
       }
       if(urlRecord){
         res.redirect(urlRecord.original_url);
         return;
       }
       res.json({"error":"No short url found for given input"});
       return;
     }).catch((e)=>{
          console.error("Exception while getting short URL : ",e);
     });
}

module.exports =  { generateShortUrl, getShortUrl };