package ui.screens

import androidx.compose.ui.test.hasContentDescription
import androidx.compose.ui.test.hasTestTag
import androidx.compose.ui.test.hasText
import com.atiurin.ultron.extensions.assertDoesNotExist
import com.atiurin.ultron.extensions.assertIsDisplayed
import com.atiurin.ultron.extensions.assertTextEquals
import com.atiurin.ultron.extensions.click
import com.atiurin.ultron.page.Screen

object ProgressScreen : Screen<ProgressScreen>() {
    // <assertum-generated>
    val back = hasContentDescription("Back")
    val progressListTitle = hasTestTag("progress_list_title")
    val firstTaskName = hasTestTag("task_item_name")

    fun assertProgressShowsListHeaderAndFirstTask(listName: String, firstTaskText: String) {
        progressListTitle.assertTextEquals(listName)
        firstTaskName.assertTextEquals(firstTaskText)
    }

    fun clickBack() {
        back.click()
    }

    fun assertBackVisible() {
        back.assertIsDisplayed()
    }

    fun assertDoneCounter(done: Int, total: Int) {
        hasText("$done/$total done").assertIsDisplayed()
    }

    fun assertPendingSectionCount(expectedCount: Int) {
        hasText("Pending $expectedCount").assertIsDisplayed()
    }

    fun assertCompletedSectionCount(expectedCount: Int) {
        hasText("Completed $expectedCount").assertIsDisplayed()
    }

    fun assertNoCompletedSectionWithSingleTask() {
        hasText("Completed 1").assertDoesNotExist()
    }

    fun assertTaskTitleVisible(taskTitle: String) {
        hasTestTag("task_item_name").and(hasText(taskTitle)).assertIsDisplayed()
    }

    fun toggleTaskCheckbox(taskTitle: String) {
        hasTestTag("task_checkbox").and(hasContentDescription(taskTitle)).click()
    }
    // </assertum-generated>
}
