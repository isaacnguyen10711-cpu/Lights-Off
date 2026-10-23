using Lights_Off.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Lights_Off.Filters
{
    // stops the request if they woke up before they went to bed
    public class ValidateBedTimeAndWakeUpTimeAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            // find the SleepLogRequest the endpoint received
            var request = context.ActionArguments.Values
                .OfType<SleepLogRequest>()
                .FirstOrDefault();

            if (request != null && request.WakeUpTime <= request.Bedtime)
            {
                // setting Result stops the endpoint and sends this back instead
                context.Result = new BadRequestObjectResult("Wake up time must be after bedtime.");
            }
        }
    }
}
