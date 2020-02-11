using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using WebApiWithBackgroundWorker.Subscriber.Messaging;

namespace WebApiWithBackgroundWorker.Controllers
{
    [EnableCors("MyPolicy")]
    [ApiController]
    [Route("[controller]")]
    public class MessagesController : ControllerBase
    {
        private readonly IMessagesRepository _messagesRepository;

        public MessagesController(IMessagesRepository messagesRepository)
        {
            _messagesRepository = messagesRepository ?? throw new ArgumentNullException(nameof(messagesRepository));
        }

        [HttpGet]
        public IActionResult Get()
        {
            var messages = _messagesRepository.GetMessages();
            return Ok(messages);
        }

        [HttpPost]
        public IActionResult Publish(Common.Messaging.Message message)
        {
            _messagesRepository.Add(message);
            return Ok();
        }

    }
}
