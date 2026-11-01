using System.Net;               // HttpStatusCode
using System.Net.Http.Json;     // PostAsJsonAsync, ReadFromJsonAsync
using Lights_Off.Models.DTOs;   // SleepLogRequest, SleepLogResponse
using Microsoft.AspNetCore.Mvc.Testing;


namespace lo_backend.Tests
{
    public class SleepLogApiTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;
        public SleepLogApiTests(WebApplicationFactory<Program> factory)
        {
            _client = factory.CreateClient();
        }
        [Fact]
        public async Task GetSleepLogs_ReturnsOk()
        {
            // Arrange
            var request = new HttpRequestMessage(HttpMethod.Get, "/api/SleepLogs");
            request.Headers.Add("Authorization", "Bearer your_valid_token_here"); // Replace with a valid token
            // Act
            var response = await _client.SendAsync(request);
            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }
    }
}
