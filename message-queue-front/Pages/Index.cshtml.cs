using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using todo_list_front.Models;

namespace todo_list_front.Pages
{
    public class IndexModel : PageModel
    {
        private readonly IConfiguration _configuration;
        private static readonly HttpClient client = new HttpClient();
        private CancellationToken cancellationToken;

        public IndexModel(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void OnGet()
        {
            ViewData["RabbitApi"] = "http://"+_configuration["RabbitApi"]+ "/messages";
        }

        public async Task<JsonResult> OnGetMessagesAsync()
        {
            var Url = "http://" + _configuration["RabbitApi"] + "/messages";
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));
            HttpResponseMessage response = await client.GetAsync(new Uri(Url));
            var productList = new List<Message>();
            var productString = "";
            if (response.IsSuccessStatusCode)
            {
                productString = await response.Content.ReadAsStringAsync();
                productList = JsonConvert.DeserializeObject<List<Message>>(productString);
            }
            return new JsonResult(productList);
        }

        public void OnPost()
        {

        }

        public async Task<IActionResult> OnPostSendMessageAsync([FromBody] Message message)
        {
            var Url = "http://" + _configuration["RabbitApi"] + "/messages";
          
            using (var request = new HttpRequestMessage(HttpMethod.Post, Url))
            using (var httpContent = CreateHttpContent(message))
            {
                request.Content = httpContent;

                using (var response = await client
                    .SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken)
                    .ConfigureAwait(false))
                {
                    response.EnsureSuccessStatusCode();
                }
            }
            return StatusCode(200);
        }

        public static void SerializeJsonIntoStream(Message value, Stream stream)
        {
            using (var sw = new StreamWriter(stream, new UTF8Encoding(false), 1024, true))
            using (var jtw = new JsonTextWriter(sw) { Formatting = Formatting.None })
            {
                var js = new JsonSerializer();
                js.Serialize(jtw, value);
                jtw.Flush();
            }
        }
        private static HttpContent CreateHttpContent(Message content)
        {
            HttpContent httpContent = null;

            if (content != null)
            {
                var ms = new MemoryStream();
                SerializeJsonIntoStream(content, ms);
                ms.Seek(0, SeekOrigin.Begin);
                httpContent = new StreamContent(ms);
                httpContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            }

            return httpContent;
        }
    }
}
