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
 * Test scenario:
 * TC-L-01 (docs/user_stories.md): Open My Lists, create new list with name and first task, save, verify day card on main screen, open list, verify Progress View header and task text.
 */
class TcL01CreateListAndProgress {
    @get:Rule
    val composeRule = createUltronComposeRule<MainActivity>()
    
    @Test
    fun tcL01CreateListAndProgress() {
        val listName = TestDataUtils.uniqueListName("TC-L-01")
        val firstTaskText = TestDataUtils.randomFirstTaskText()
        MyListsScreen {
            openCreateList()
        }
        CreateListScreen {
            fillListNameAndFirstTaskAndSave(listName = listName, firstTaskText = firstTaskText)
        }
        MyListsScreen {
            assertTaskCardVisibleForList(listName = listName)
            openTaskCardForList(listName = listName)
        }
        ProgressScreen {
            assertProgressShowsListHeaderAndFirstTask(listName = listName, firstTaskText = firstTaskText)
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