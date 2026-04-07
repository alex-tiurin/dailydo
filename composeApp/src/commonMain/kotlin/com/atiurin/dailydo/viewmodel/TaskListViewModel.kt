package com.atiurin.dailydo.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.atiurin.dailydo.model.TaskList
import com.atiurin.dailydo.repository.TaskRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed class Screen {
    data object MyLists : Screen()
    data object CreateList : Screen()
    data class ProgressView(val listId: String) : Screen()
}

data class TaskListUiState(
    val taskLists: List<TaskList> = emptyList(),
    val currentScreen: Screen = Screen.MyLists,
    val isLoading: Boolean = false,
    val error: String? = null
)

class TaskListViewModel(
    private val repository: TaskRepository,
    private val externalScope: CoroutineScope? = null
) : ViewModel() {

    private val scope: CoroutineScope get() = externalScope ?: viewModelScope

    private val _uiState = MutableStateFlow(TaskListUiState())
    val uiState: StateFlow<TaskListUiState> = _uiState.asStateFlow()

    init {
        loadLists()
    }

    fun loadLists() {
        scope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            try {
                val lists = repository.getLists()
                _uiState.value = _uiState.value.copy(taskLists = lists, isLoading = false)
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message ?: "Failed to load lists"
                )
            }
        }
    }

    fun createTaskList(name: String, taskNames: List<String>) {
        scope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            try {
                val newList = repository.createList(name, taskNames)
                _uiState.value = _uiState.value.copy(
                    taskLists = listOf(newList) + _uiState.value.taskLists,
                    isLoading = false,
                    currentScreen = Screen.MyLists
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message ?: "Failed to create list"
                )
            }
        }
    }

    fun toggleTask(listId: String, taskId: String) {
        scope.launch {
            val task = _uiState.value.taskLists
                .find { it.id == listId }?.tasks
                ?.find { it.id == taskId } ?: return@launch
            try {
                val updated = repository.setTaskDone(listId, taskId, !task.done)
                updateTaskInState(listId, updated.id) { updated }
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(error = e.message ?: "Failed to update task")
            }
        }
    }

    fun editTask(listId: String, taskId: String, newName: String) {
        scope.launch {
            try {
                val updated = repository.renameTask(listId, taskId, newName)
                updateTaskInState(listId, updated.id) { updated }
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(error = e.message ?: "Failed to edit task")
            }
        }
    }

    fun deleteTaskList(listId: String) {
        scope.launch {
            try {
                repository.deleteList(listId)
                _uiState.value = _uiState.value.copy(
                    taskLists = _uiState.value.taskLists.filter { it.id != listId }
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(error = e.message ?: "Failed to delete list")
            }
        }
    }

    fun navigateToCreate() {
        _uiState.value = _uiState.value.copy(currentScreen = Screen.CreateList)
    }

    fun navigateToProgress(listId: String) {
        _uiState.value = _uiState.value.copy(currentScreen = Screen.ProgressView(listId))
    }

    fun navigateBack() {
        _uiState.value = _uiState.value.copy(currentScreen = Screen.MyLists)
    }

    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }

    fun completedCount(list: TaskList): Int = list.tasks.count { it.done }

    fun totalCount(list: TaskList): Int = list.tasks.size

    fun completionPercentage(list: TaskList): Int {
        if (list.tasks.isEmpty()) return 0
        return (completedCount(list) * 100) / list.tasks.size
    }

    private fun updateTaskInState(
        listId: String,
        taskId: String,
        transform: (com.atiurin.dailydo.model.Task) -> com.atiurin.dailydo.model.Task
    ) {
        _uiState.value = _uiState.value.copy(
            taskLists = _uiState.value.taskLists.map { list ->
                if (list.id == listId) {
                    list.copy(tasks = list.tasks.map { task ->
                        if (task.id == taskId) transform(task) else task
                    })
                } else list
            }
        )
    }
}
