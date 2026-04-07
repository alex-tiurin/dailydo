package com.atiurin.dailydo.ui.component

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.testTag
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import com.atiurin.dailydo.model.Task

@Composable
fun TaskItem(
    task: Task,
    onToggle: () -> Unit,
    onEdit: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Checkbox(
            checked = task.done,
            onCheckedChange = { onToggle() },
            modifier = Modifier.semantics {
                testTag = "task_checkbox"
                contentDescription = task.name
            },
            colors = CheckboxDefaults.colors(
                checkedColor = MaterialTheme.colorScheme.secondary,
                uncheckedColor = MaterialTheme.colorScheme.outline
            )
        )
        Spacer(Modifier.width(8.dp))
        Text(
            text = task.name,
            modifier = Modifier
                .weight(1f)
                .semantics { testTag = "task_item_name" },
            style = MaterialTheme.typography.bodyLarge,
            color = if (task.done)
                MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.7f)
            else
                MaterialTheme.colorScheme.onSurface,
            textDecoration = if (task.done) TextDecoration.LineThrough else TextDecoration.None
        )
        IconButton(onClick = onEdit) {
            Icon(
                imageVector = Icons.Filled.Edit,
                contentDescription = "Edit task",
                tint = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}
