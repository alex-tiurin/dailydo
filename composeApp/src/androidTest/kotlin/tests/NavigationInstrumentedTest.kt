package tests

import com.atiurin.dailydo.MainActivity
import com.atiurin.ultron.core.compose.config.UltronComposeConfig
import com.atiurin.ultron.core.compose.createUltronComposeRule
import com.atiurin.ultron.extensions.assertTextEquals
import org.junit.BeforeClass
import org.junit.Rule
import org.junit.Test
import ui.screens.CreateListScreen
import ui.screens.MyListsScreen
import ui.screens.ProgressScreen

/**
 * TC-N-01 … TC-N-04 from [docs/user_stories.md](docs/user_stories.md).
 * After save, the app opens My Lists (not Progress); steps are adapted accordingly.
 */
class NavigationInstrumentedTest {
    @get:Rule
    val composeRule = createUltronComposeRule<MainActivity>()

    @Test
    fun tcN01_newListOpensCreateScreen() {
        MyListsScreen {
            openCreateList()
        }
        CreateListScreen {
            assertCreateListScreenVisible()
        }
    }

    @Test
    fun tcN02_openProgressFromDayCard() {
        val listName = TestDataUtils.uniqueListName("TC-N-02")
        val taskText = TestDataUtils.randomTaskText("TC-N-02-t")
        MyListsScreen {
            openCreateList()
        }
        CreateListScreen {
            fillListNameAndFirstTaskAndSave(listName, taskText)
        }
        MyListsScreen {
            assertTaskCardVisibleForList(listName)
            openTaskCardForList(listName)
        }
        ProgressScreen {
            progressListTitle.assertTextEquals(listName)
            assertBackVisible()
        }
    }

    @Test
    fun tcN03_backFromProgressReturnsToMyLists() {
        val listName = TestDataUtils.uniqueListName("TC-N-03")
        val taskText = TestDataUtils.randomTaskText("TC-N-03-t")
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
            clickBack()
        }
        MyListsScreen {
            assertMyListsScreenVisible()
        }
    }

    @Test
    fun tcN04_fullNavigationCycle() {
        val listName = TestDataUtils.uniqueListName("TC-N-04")
        val taskText = TestDataUtils.randomTaskText("TC-N-04-t")
        MyListsScreen {
            assertMyListsScreenVisible()
            openCreateList()
        }
        CreateListScreen {
            fillListNameAndFirstTaskAndSave(listName, taskText)
        }
        MyListsScreen {
            assertTaskCardVisibleForList(listName)
            openTaskCardForList(listName)
        }
        ProgressScreen {
            assertPendingSectionCount(1)
            assertTaskTitleVisible(taskText)
            clickBack()
        }
        MyListsScreen {
            assertMyListsScreenVisible()
            openTaskCardForList(listName)
        }
        ProgressScreen {
            assertPendingSectionCount(1)
            clickBack()
        }
        MyListsScreen {
            assertMyListsScreenVisible()
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
