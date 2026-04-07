package com.atiurin.dailydo

import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.lifecycle.viewmodel.compose.viewModel
import com.atiurin.dailydo.data.KtorTaskRepository
import com.atiurin.dailydo.di.createHttpClient
import com.atiurin.dailydo.network.DailyDoApiClient
import com.atiurin.dailydo.ui.screen.CreateListScreen
import com.atiurin.dailydo.ui.screen.MyListsScreen
import com.atiurin.dailydo.ui.screen.ProgressScreen
import com.atiurin.dailydo.ui.theme.DailyDoTheme
import com.atiurin.dailydo.viewmodel.Screen
import com.atiurin.dailydo.viewmodel.TaskListViewModel
import androidx.lifecycle.ViewModelProvider

@Composable
fun App() {
    val httpClient = createHttpClient()
    val apiClient = DailyDoApiClient(httpClient)
    val repository = KtorTaskRepository(apiClient)
    val viewModel: TaskListViewModel = viewModel(
        factory = object : ViewModelProvider.Factory {
            @Suppress("UNCHECKED_CAST")
            override fun <T : androidx.lifecycle.ViewModel> create(modelClass: kotlin.reflect.KClass<T>, extras: androidx.lifecycle.viewmodel.CreationExtras): T {
                return TaskListViewModel(repository) as T
            }
        }
    )
    val uiState by viewModel.uiState.collectAsState()

    DailyDoTheme {
        when (val screen = uiState.currentScreen) {
            is Screen.MyLists -> {
                MyListsScreen(
                    taskLists = uiState.taskLists,
                    isLoading = uiState.isLoading,
                    error = uiState.error,
                    completionPercentage = { list -> viewModel.completionPercentage(list) },
                    completedCount = { list -> viewModel.completedCount(list) },
                    onNewListClick = { viewModel.navigateToCreate() },
                    onListClick = { listId -> viewModel.navigateToProgress(listId) },
                    onErrorDismiss = { viewModel.clearError() }
                )
            }
            is Screen.CreateList -> {
                CreateListScreen(
                    onSave = { name, tasks -> viewModel.createTaskList(name, tasks) },
                    onBack = { viewModel.navigateBack() }
                )
            }
            is Screen.ProgressView -> {
                val list = uiState.taskLists.find { it.id == screen.listId }
                if (list != null) {
                    ProgressScreen(
                        taskList = list,
                        completionPercentage = viewModel.completionPercentage(list),
                        completedCount = viewModel.completedCount(list),
                        onBack = { viewModel.navigateBack() },
                        onToggleTask = { taskId -> viewModel.toggleTask(list.id, taskId) },
                        onEditTask = { taskId, newName -> viewModel.editTask(list.id, taskId, newName) }
                    )
                } else {
                    viewModel.navigateBack()
                }
            }
        }
    }
}
