package com.atiurin.dailydo

import com.atiurin.dailydo.model.Task
import com.atiurin.dailydo.model.TaskList
import com.atiurin.dailydo.repository.TaskRepository

class FakeTaskRepository(
    initialLists: List<TaskList> = emptyList(),
    var shouldThrow: Boolean = false
) : TaskRepository {

    private val lists = initialLists.toMutableList()

    override suspend fun getLists(): List<TaskList> {
        if (shouldThrow) throw Exception("network error")
        return lists.toList()
    }

    override suspend fun getList(id: String): TaskList {
        if (shouldThrow) throw Exception("network error")
        return lists.first { it.id == id }
    }

    override suspend fun createList(name: String, tasks: List<String>): TaskList {
        if (shouldThrow) throw Exception("network error")
        val newList = TaskList(
            id = (lists.size + 1).toString(),
            name = name,
            date = "2026-04-10",
            tasks = tasks.mapIndexed { i, t -> Task(id = "t${i + 1}", name = t, done = false) }
        )
        lists.add(0, newList)
        return newList
    }

    override suspend fun setTaskDone(listId: String, taskId: String, done: Boolean): Task {
        if (shouldThrow) throw Exception("network error")
        val list = lists.first { it.id == listId }
        val task = list.tasks.first { it.id == taskId }
        val updated = task.copy(done = done)
        val updatedList = list.copy(tasks = list.tasks.map { if (it.id == taskId) updated else it })
        lists[lists.indexOf(list)] = updatedList
        return updated
    }

    override suspend fun renameTask(listId: String, taskId: String, name: String): Task {
        if (shouldThrow) throw Exception("network error")
        val list = lists.first { it.id == listId }
        val task = list.tasks.first { it.id == taskId }
        val updated = task.copy(name = name)
        val updatedList = list.copy(tasks = list.tasks.map { if (it.id == taskId) updated else it })
        lists[lists.indexOf(list)] = updatedList
        return updated
    }

    override suspend fun deleteList(id: String) {
        if (shouldThrow) throw Exception("network error")
        lists.removeAll { it.id == id }
    }
}
