package com.atiurin.dailydo.network

import com.atiurin.dailydo.model.CreateListRequest
import com.atiurin.dailydo.model.Task
import com.atiurin.dailydo.model.TaskList
import com.atiurin.dailydo.model.UpdateTaskRequest
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.delete
import io.ktor.client.request.get
import io.ktor.client.request.patch
import io.ktor.client.request.post
import io.ktor.client.request.put
import io.ktor.client.request.setBody
import io.ktor.client.statement.HttpResponse
import io.ktor.http.ContentType
import io.ktor.http.contentType
import io.ktor.http.isSuccess

class ApiException(message: String, val statusCode: Int) : Exception(message)

private fun HttpResponse.requireSuccess() {
    if (!status.isSuccess()) throw ApiException("HTTP error: ${status.value}", status.value)
}

expect fun defaultBaseUrl(): String

class DailyDoApiClient(
    private val httpClient: HttpClient,
    private val baseUrl: String = defaultBaseUrl()
) {
    suspend fun getLists(): List<TaskList> {
        val response = httpClient.get("$baseUrl/api/lists")
        response.requireSuccess()
        return response.body()
    }

    suspend fun getList(id: String): TaskList {
        val response = httpClient.get("$baseUrl/api/lists/$id")
        response.requireSuccess()
        return response.body()
    }

    suspend fun createList(request: CreateListRequest): TaskList =
        httpClient.post("$baseUrl/api/lists") {
            contentType(ContentType.Application.Json)
            setBody(request)
        }.body()

    suspend fun updateTask(listId: String, taskId: String, request: UpdateTaskRequest): Task =
        httpClient.patch("$baseUrl/api/lists/$listId/tasks/$taskId") {
            contentType(ContentType.Application.Json)
            setBody(request)
        }.body()

    suspend fun deleteList(id: String) {
        httpClient.delete("$baseUrl/api/lists/$id")
    }

    suspend fun updateList(id: String, name: String): TaskList =
        httpClient.put("$baseUrl/api/lists/$id") {
            contentType(ContentType.Application.Json)
            setBody(mapOf("name" to name))
        }.body()
}
