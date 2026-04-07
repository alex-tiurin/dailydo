package com.atiurin.dailydo.repository

import com.atiurin.dailydo.model.Task
import com.atiurin.dailydo.model.TaskList

interface TaskRepository {
    suspend fun getLists(): List<TaskList>
    suspend fun getList(id: String): TaskList
    suspend fun createList(name: String, tasks: List<String>): TaskList
    suspend fun setTaskDone(listId: String, taskId: String, done: Boolean): Task
    suspend fun renameTask(listId: String, taskId: String, name: String): Task
    suspend fun deleteList(id: String)
}
