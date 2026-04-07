package tests

import com.atiurin.dailydo.MainActivity
import com.atiurin.ultron.core.compose.config.UltronComposeConfig
import com.atiurin.ultron.core.compose.createUltronComposeRule
import org.junit.BeforeClass
import org.junit.Rule
import org.junit.Test
import ui.screens.CreateListScreen
import ui.screens.MyListsScreen

/**
 * TC-L-02 ([docs/user_stories.md](docs/user_stories.md)): empty list name shows validation; user stays on create flow.
 */
class TcL02EmptyListNameValidation {
    @get:Rule
    val composeRule = createUltronComposeRule<MainActivity>()

    @Test
    fun tcL02EmptyListNameValidation() {
        MyListsScreen {
            openCreateList()
        }
        CreateListScreen {
            tapSaveList()
            assertListNameRequiredErrorVisible()
            assertCreateListScreenVisible()
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
