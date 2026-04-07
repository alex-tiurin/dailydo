package com.atiurin.dailydo

import com.atiurin.dailydo.model.CreateListRequest
import com.atiurin.dailydo.model.TaskName
import com.atiurin.dailydo.model.UpdateTaskRequest
import com.atiurin.dailydo.network.DailyDoApiClient
import io.ktor.client.HttpClient
import io.ktor.client.engine.mock.MockEngine
import io.ktor.client.engine.mock.respond
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.HttpRequestData
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import io.ktor.http.headersOf
import io.ktor.serialization.kotlinx.json.json
import io.ktor.utils.io.ByteReadChannel
import kotlinx.coroutines.test.runTest
import kotlinx.serialization.json.Json
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertTrue

class DailyDoApiClientTest {

    private val testListsJson = """
        [
            {"id":"1","name":"Morning Routine","date":"2026-04-09","tasks":[
                {"id":"t1","name":"Exercise","done":false},
                {"id":"t2","name":"Breakfast","done":true}
            ]},
            {"id":"2","name":"Work Tasks","date":"2026-04-08","tasks":[]}
        ]
    """.trimIndent()

    private val testListJson = """
        {"id":"1","name":"Morning Routine","date":"2026-04-09","tasks":[
            {"id":"t1","name":"Exercise","done":false}
        ]}
    """.trimIndent()

    private fun buildClient(onRequest: (HttpRequestData) -> Pair<HttpStatusCode, String>): DailyDoApiClient {
        val mockEngine = MockEngine { request ->
            val (status, body) = onRequest(request)
            respond(
                content = body,
                status = status,
                headers = headersOf(HttpHeaders.ContentType, ContentType.Application.Json.toString())
            )
        }
        val client = HttpClient(mockEngine) {
            install(ContentNegotiation) { json(Json { ignoreUnknownKeys = true }) }
        }
        return DailyDoApiClient(client, "http://localhost:3001")
    }

    private fun simpleClient(statusCode: HttpStatusCode, body: String) =
        buildClient { HttpStatusCode.OK to body }.let {
            buildClient { _ -> statusCode to body }
        }

    @Test
    fun `getLists returns parsed data`() = runTest {
        val apiClient = buildClient { _ -> HttpStatusCode.OK to testListsJson }
        val lists = apiClient.getLists()
        assertEquals(2, lists.size)
        assertEquals("Morning Routine", lists[0].name)
        assertEquals("2026-04-09", lists[0].date)
        assertEquals(2, lists[0].tasks.size)
    }

    @Test
    fun `getLists returns empty list`() = runTest {
        val apiClient = buildClient { _ -> HttpStatusCode.OK to "[]" }
        val lists = apiClient.getLists()
        assertTrue(lists.isEmpty())
    }

    @Test
    fun `createList sends POST and returns created list`() = runTest {
        var capturedMethod = ""
        var capturedUrl = ""
        val apiClient = buildClient { request ->
            capturedMethod = request.method.value
            capturedUrl = request.url.toString()
            HttpStatusCode.Created to testListJson
        }
        val request = CreateListRequest("Morning Routine", listOf(TaskName("Exercise")))
        val result = apiClient.createList(request)
        assertEquals("POST", capturedMethod)
        assertTrue(capturedUrl.contains("/api/lists"))
        assertEquals("Morning Routine", result.name)
    }

    @Test
    fun `updateTask sends PATCH to correct URL`() = runTest {
        var capturedMethod = ""
        var capturedUrl = ""
        val apiClient = buildClient { request ->
            capturedMethod = request.method.value
            capturedUrl = request.url.toString()
            HttpStatusCode.OK to """{"id":"t1","name":"Exercise","done":true}"""
        }
        val task = apiClient.updateTask("1", "t1", UpdateTaskRequest(done = true))
        assertEquals("PATCH", capturedMethod)
        assertTrue(capturedUrl.contains("/api/lists/1/tasks/t1"))
        assertEquals(true, task.done)
    }

    @Test
    fun `updateTask with name returns updated task`() = runTest {
        val apiClient = buildClient { _ ->
            HttpStatusCode.OK to """{"id":"t1","name":"Updated task","done":false}"""
        }
        val task = apiClient.updateTask("1", "t1", UpdateTaskRequest(name = "Updated task"))
        assertEquals("Updated task", task.name)
    }

    @Test
    fun `deleteList sends DELETE to correct URL`() = runTest {
        var capturedMethod = ""
        var capturedUrl = ""
        val apiClient = buildClient { request ->
            capturedMethod = request.method.value
            capturedUrl = request.url.toString()
            HttpStatusCode.NoContent to ""
        }
        apiClient.deleteList("1")
        assertEquals("DELETE", capturedMethod)
        assertTrue(capturedUrl.contains("/api/lists/1"))
    }

    @Test
    fun `getList throws on 404`() = runTest {
        val apiClient = buildClient { _ ->
            HttpStatusCode.NotFound to """{"error":"Not found"}"""
        }
        assertFailsWith<Exception> {
            apiClient.getList("nonexistent")
        }
    }

    @Test
    fun `getList returns single list`() = runTest {
        val apiClient = buildClient { _ -> HttpStatusCode.OK to testListJson }
        val list = apiClient.getList("1")
        assertEquals("1", list.id)
        assertEquals("Morning Routine", list.name)
    }
}
