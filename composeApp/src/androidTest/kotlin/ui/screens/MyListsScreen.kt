package ui.screens

import androidx.compose.ui.test.SemanticsMatcher
import androidx.compose.ui.test.hasContentDescription
import androidx.compose.ui.test.hasTestTag
import androidx.compose.ui.test.hasText
import com.atiurin.ultron.core.compose.list.UltronComposeListItem
import com.atiurin.ultron.core.compose.list.composeList
import com.atiurin.ultron.extensions.assertIsDisplayed
import com.atiurin.ultron.extensions.click
import com.atiurin.ultron.page.Screen

object MyListsScreen : Screen<MyListsScreen>() {
    // <assertum-generated>
    val myListsColumn = composeList(hasTestTag("my_lists_column"))
    val myLists = hasText("My Lists")
    val newList = hasContentDescription("New List")
    val createFirstList = hasText("Create First List")

    /**
     * Opens Create New List. Uses the toolbar "New List" control so the flow works
     * with an empty app state and when lists already exist (TC-L-01 step 2).
     */
    fun openCreateList() {
        newList.click()
    }

    fun openCreateListFromEmptyState() {
        createFirstList.click()
    }

    fun assertMyListsScreenVisible() {
        myLists.assertIsDisplayed()
    }

    val taskCard = hasTestTag("task_card")

    private fun taskCardForList(listName: String): SemanticsMatcher =
        hasTestTag("task_card").and(hasContentDescription(listName))

    fun assertTaskCardVisibleForList(listName: String) {
        getMyListsColumnItem(taskCardForList(listName)).assertIsDisplayed()
    }

    fun openTaskCardForList(listName: String) {
        getMyListsColumnItem(taskCardForList(listName)).click()
    }

    fun openTaskCard() {
        taskCard.click()
    }

    class MyListsColumnItem : UltronComposeListItem() {
        val collapse by child { hasContentDescription("Collapse") }
        val taskCardDate by child { hasTestTag("task_card_date") }
        val taskCardName by child { hasTestTag("task_card_name") }
        val taskCardItemsCount by child { hasTestTag("task_card_items_count") }
        val taskCardCompletionPercentage by child { hasTestTag("task_card_completion_percentage") }
    }

    fun getMyListsColumnItem(matcher: SemanticsMatcher): MyListsColumnItem {
        return myListsColumn.getItem(matcher)
    }
    // </assertum-generated>
}
