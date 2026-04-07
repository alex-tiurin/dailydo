package ui.screens

import androidx.compose.ui.test.hasContentDescription
import androidx.compose.ui.test.hasTestTag
import androidx.compose.ui.test.hasText
import com.atiurin.ultron.core.compose.list.composeList
import com.atiurin.ultron.extensions.assertIsDisplayed
import com.atiurin.ultron.extensions.click
import com.atiurin.ultron.extensions.inputText
import com.atiurin.ultron.page.Screen

object CreateListScreen : Screen<CreateListScreen>() {
    // <assertum-generated>
    val createListColumn = composeList(hasTestTag("create_list_column"))
    val saveList = hasText("Save List")
    val back = hasContentDescription("Back")
    val createNewList = hasText("Create New List")
    val addANameAndTasksForToday = hasText("Add a name and tasks for today")
    val listNameField = hasTestTag("list_name_field")
    val listNameError = hasTestTag("list_name_error")
    val taskInput0 = hasTestTag("task_input_0")
    val addTaskButton = hasTestTag("add_task_button")

    fun fillListNameAndFirstTaskAndSave(listName: String, firstTaskText: String) {
        listNameField.inputText(listName)
        taskInput0.inputText(firstTaskText)
        saveList.click()
    }

    fun tapSaveList() {
        saveList.click()
    }

    fun assertListNameRequiredErrorVisible() {
        listNameError.assertIsDisplayed()
    }

    fun assertCreateListScreenVisible() {
        createNewList.assertIsDisplayed()
    }

    fun fillListNameAndTwoTasksAndSave(listName: String, firstTaskText: String, secondTaskText: String) {
        listNameField.inputText(listName)
        taskInput0.inputText(firstTaskText)
        addTaskButton.click()
        hasTestTag("task_input_1").inputText(secondTaskText)
        saveList.click()
    }
    // </assertum-generated>
}
