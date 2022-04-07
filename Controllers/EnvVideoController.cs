using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SharePoint.Client;
using PnP.Framework;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Windows.Web.Http;



namespace PersonalTabMVC.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnvVideoController : ControllerBase
    {
        // GET: api/<EnvVideo>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value3" };
        }

       

        // POST api/<EnvVideo>
        [HttpPost]
        public Task Post(IList<IFormFile> video, string id, string userTeams)
        //public void Post(Models.Video video)
        {

            try
            {
                string fileName = userTeams + "_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".mp4";
                using (var ms = new MemoryStream())
                {
                    video[0].CopyTo(ms);
                    ms.Position = 0;
                    var fileBytes = ms.ToArray();
                    string s = Convert.ToBase64String(fileBytes);
                  
                    using (ClientContext clientContext = new PnP.Framework.AuthenticationManager().GetACSAppOnlyContext("https://raonashowcase.sharepoint.com/sites/VideoTesting/", "1dffa6d1-3fdd-4b2c-916f-ae9273e0fc08", "MNzea3lkeiQqKcqOnPDL7FLK1az96d2QuQPSwSLiKwU="))
                    {
                        List listaDocumentos = clientContext.Web.Lists.GetByTitle("Documentos");
                        var videoUploaded = FileFolderExtensions.UploadFile(listaDocumentos.RootFolder, fileName, ms, true);
                        clientContext.ExecuteQuery();

                        Guid uniqueId = videoUploaded.UniqueId;
                        ListItem videoOnList = listaDocumentos.GetItemByUniqueId(uniqueId);
                        videoOnList["IdSolicitud"] = id;
                        videoOnList.Update();
                        clientContext.ExecuteQuery();

                        return Task.FromResult("ok");


                    }
                }
            }
            catch (Exception ex)
            {
                return Task.FromResult(ex.ToString());
            }

        }


    }
}
