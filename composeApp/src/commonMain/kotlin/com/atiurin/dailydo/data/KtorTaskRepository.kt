package com.atiurin.dailydo.data

import com.atiurin.dailydo.model.Task
import com.atiurin.dailydo.model.TaskList
import com.atiurin.dailydo.model.TaskName
import com.atiurin.dailydo.model.CreateListRequest
import com.atiurin.dailydo.model.UpdateTaskRequest
import com.atiurin.dailydo.network.DailyDoApiClient
import com.atiurin.dailydo.repository.TaskRepository

class KtorTaskRepository(private val apiClient: DailyDoApiClient) : TaskRepository {

    override suspend fun getLists(): List<TaskList> = apiClient.getLists()

    override suspend fun getList(id: String): TaskList = apiClient.getList(id)

    override suspend fun createList(name: String, tasks: List<String>): TaskList =
        apiClient.createList(CreateListRequest(name, tasks.map { TaskName(it) }))

    override suspend fun setTaskDone(listId: String, taskId: String, done: Boolean): Task =
        apiClient.updateTask(listId, taskId, UpdateTaskRequest(done = done))

    override suspend fun renameTask(listId: String, taskId: String, name: String): Task =
        apiClient.updateTask(listId, taskId, UpdateTaskRequest(name = name))

    override suspend fun deleteList(id: String) = apiClient.deleteList(id)
}
