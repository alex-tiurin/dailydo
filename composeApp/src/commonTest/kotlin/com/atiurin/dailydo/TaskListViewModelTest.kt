package com.atiurin.dailydo

import com.atiurin.dailydo.model.Task
import com.atiurin.dailydo.model.TaskList
import com.atiurin.dailydo.viewmodel.Screen
import com.atiurin.dailydo.viewmodel.TaskListViewModel
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.TestScope
import kotlinx.coroutines.test.advanceUntilIdle
import kotlinx.coroutines.test.runTest
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull
import kotlin.test.assertTrue

@OptIn(ExperimentalCoroutinesApi::class)
class TaskListViewModelTest {

    private val task1 = Task(id = "t1", name = "Exercise", done = false)
    private val task2 = Task(id = "t2", name = "Breakfast", done = true)
    private val task3 = Task(id = "t3", name = "Meditation", done = false)
    private val task4 = Task(id = "t4", name = "Reading", done = true)

    private val list1 = TaskList(
        id = "1", name = "Morning Routine", date = "2026-04-09",
        tasks = listOf(task1, task2, task3, task4)
    )
    private val list2 = TaskList(id = "2", name = "Work Tasks", date = "2026-04-08", tasks = emptyList())

    private fun TestScope.buildViewModel(
        fake: FakeTaskRepository = FakeTaskRepository(listOf(list1, list2))
    ): TaskListViewModel = TaskListViewModel(fake, this)

    @Test
    fun `ViewModel loads lists on init`() = runTest {
        val viewModel = buildViewModel()
        advanceUntilIdle()
        val state = viewModel.uiState.value
        assertEquals(2, state.taskLists.size)
        assertEquals(false, state.isLoading)
        assertNull(state.error)
    }

    @Test
    fun `ViewModel handles load error`() = runTest {
        val viewModel = buildViewModel(FakeTaskRepository(shouldThrow = true))
        advanceUntilIdle()
        val state = viewModel.uiState.value
        assertTrue(state.taskLists.isEmpty())
        assertNotNull(state.error)
        assertEquals(false, state.isLoading)
    }

    @Test
    fun `toggleTask updates state - done=false to true`() = runTest {
        val viewModel = buildViewModel()
        advanceUntilIdle()
        viewModel.toggleTask("1", "t1")
        advanceUntilIdle()

        val task = viewModel.uiState.value.taskLists.find { it.id == "1" }!!
            .tasks.find { it.id == "t1" }!!
        assertEquals(true, task.done)
    }

    @Test
    fun `toggleTask updates state - done=true to false`() = runTest {
        val viewModel = buildViewModel()
        advanceUntilIdle()
        viewModel.toggleTask("1", "t2")
        advanceUntilIdle()

        val task = viewModel.uiState.value.taskLists.find { it.id == "1" }!!
            .tasks.find { it.id == "t2" }!!
        assertEquals(false, task.done)
    }

    @Test
    fun `completionPercentage - partial completion`() = runTest {
        val viewModel = buildViewModel()
        advanceUntilIdle()
        val list = viewModel.uiState.value.taskLists.find { it.id == "1" }!!
        // 4 tasks, 2 done → 50%
        assertEquals(50, viewModel.completionPercentage(list))
    }

    @Test
    fun `completionPercentage - empty list`() = runTest {
        val viewModel = buildViewModel()
        advanceUntilIdle()
        val emptyList = viewModel.uiState.value.taskLists.find { it.id == "2" }!!
        assertEquals(0, viewModel.completionPercentage(emptyList))
    }

    @Test
    fun `completionPercentage - all completed`() = runTest {
        val allDone = TaskList(
            id = "1", name = "Test", date = "2026-04-09",
            tasks = listOf(Task("t1", "A", true), Task("t2", "B", true))
        )
        val viewModel = buildViewModel(FakeTaskRepository(listOf(allDone)))
        advanceUntilIdle()
        val list = viewModel.uiState.value.taskLists[0]
        assertEquals(100, viewModel.completionPercentage(list))
    }

    @Test
    fun `createTaskList adds to state`() = runTest {
        val viewModel = buildViewModel()
        advanceUntilIdle()
        viewModel.createTaskList("Evening", listOf("Walk"))
        advanceUntilIdle()

        assertEquals(3, viewModel.uiState.value.taskLists.size)
        assertEquals("Evening", viewModel.uiState.value.taskLists[0].name)
    }

    @Test
    fun `deleteTaskList removes from state`() = runTest {
        val viewModel = buildViewModel()
        advanceUntilIdle()
        viewModel.deleteTaskList("1")
        advanceUntilIdle()

        assertEquals(1, viewModel.uiState.value.taskLists.size)
        assertTrue(viewModel.uiState.value.taskLists.none { it.id == "1" })
    }

    @Test
    fun `navigation - navigate to create screen`() = runTest {
        val viewModel = buildViewModel(FakeTaskRepository())
        viewModel.navigateToCreate()
        assertEquals(Screen.CreateList, viewModel.uiState.value.currentScreen)
    }

    @Test
    fun `navigation - navigate to progress and back`() = runTest {
        val viewModel = buildViewModel(FakeTaskRepository())
        viewModel.navigateToProgress("1")
        assertEquals(Screen.ProgressView("1"), viewModel.uiState.value.currentScreen)
        viewModel.navigateBack()
        assertEquals(Screen.MyLists, viewModel.uiState.value.currentScreen)
    }
}
