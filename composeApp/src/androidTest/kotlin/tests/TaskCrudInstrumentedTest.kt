package tests

import com.atiurin.dailydo.MainActivity
import com.atiurin.ultron.core.compose.config.UltronComposeConfig
import com.atiurin.ultron.core.compose.createUltronComposeRule
import org.junit.BeforeClass
import org.junit.Rule
import org.junit.Test
import ui.screens.CreateListScreen
import ui.screens.MyListsScreen
import ui.screens.ProgressScreen

/**
 * TC-T-01 … TC-T-03 from [docs/user_stories.md](docs/user_stories.md).
 */
class TaskCrudInstrumentedTest {
    @get:Rule
    val composeRule = createUltronComposeRule<MainActivity>()

    @Test
    fun tcT01_twoTasksVisibleInPending() {
        val listName = TestDataUtils.uniqueListName("TC-T-01")
        val (firstTask, secondTask) = TestDataUtils.twoRandomTaskTexts()
        MyListsScreen {
            openCreateList()
        }
        CreateListScreen {
            fillListNameAndTwoTasksAndSave(listName, firstTask, secondTask)
        }
        MyListsScreen {
            openTaskCardForList(listName)
        }
        ProgressScreen {
            assertPendingSectionCount(2)
            assertTaskTitleVisible(firstTask)
            assertTaskTitleVisible(secondTask)
        }
    }

    @Test
    fun tcT02_moveTaskFromPendingToCompleted() {
        val listName = TestDataUtils.uniqueListName("TC-T-02")
        val taskText = TestDataUtils.randomTaskText("TC-T-02-toggle")
        MyListsScreen {
            openCreateList()
        }
        CreateListScreen {
            fillListNameAndFirstTaskAndSave(listName, taskText)
        }
        MyListsScreen {
            openTaskCardForList(listName)
        }
        ProgressScreen {
            assertPendingSectionCount(1)
            toggleTaskCheckbox(taskText)
            assertPendingSectionCount(0)
            assertCompletedSectionCount(1)
            assertDoneCounter(1, 1)
            assertTaskTitleVisible(taskText)
        }
    }

    @Test
    fun tcT03_moveTaskBackToPending() {
        val listName = TestDataUtils.uniqueListName("TC-T-03")
        val taskText = TestDataUtils.randomTaskText("TC-T-03-toggle")
        MyListsScreen {
            openCreateList()
        }
        CreateListScreen {
            fillListNameAndFirstTaskAndSave(listName, taskText)
        }
        MyListsScreen {
            openTaskCardForList(listName)
        }
        ProgressScreen {
            assertPendingSectionCount(1)
            toggleTaskCheckbox(taskText)
            assertCompletedSectionCount(1)
            toggleTaskCheckbox(taskText)
            assertPendingSectionCount(1)
            assertNoCompletedSectionWithSingleTask()
            assertDoneCounter(0, 1)
            assertTaskTitleVisible(taskText)
        }
    }

    companion object {
        @JvmStatic
        @BeforeClass
        fun configUltron() {
            UltronComposeConfig.applyRecommended()
        }
    }
}
