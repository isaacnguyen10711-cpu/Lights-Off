using Lights_Off.Models.DTOs;

namespace lo_backend.Tests
{
    public class SleepLogHoursTests
    {
        [Fact]
        public void HoursSleptTest()
        {
            var sleepLog = new SleepLogResponse
            {
                Bedtime = new DateTime(2024, 6, 1, 22, 0, 0),
                WakeUpTime = new DateTime(2024, 6, 2, 6, 0, 0),
            };

            var hoursSlept = sleepLog.HoursSlept;

            Assert.Equal(8, hoursSlept);
        }

        [Fact]
        public void HoursSleptTestRounding()
        {
            var sleepLog = new SleepLogResponse
            {
                Bedtime = new DateTime(2024, 6, 1, 22, 30, 0),
                WakeUpTime = new DateTime(2024, 6, 2, 6, 15, 0),
            };
            var hoursSlept = sleepLog.HoursSlept;
            Assert.Equal(7.8, hoursSlept);
        }
    }
}
