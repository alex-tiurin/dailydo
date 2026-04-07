package com.atiurin.dailydo.ui.component

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.testTag
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.atiurin.dailydo.model.TaskList

@Composable
fun TaskCard(
    taskList: TaskList,
    completionPercentage: Int,
    completedCount: Int,
    onClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(MaterialTheme.shapes.large)
            .background(MaterialTheme.colorScheme.surfaceContainerLowest)
            .semantics {
                testTag = "task_card"
                contentDescription = taskList.name
            }
            .clickable(onClick = onClick)
            .padding(horizontal = 20.dp, vertical = 16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Box(modifier = Modifier.semantics(mergeDescendants = true) { testTag = "task_card_date" }) {
                    Text(
                        text = taskList.date,
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                Spacer(Modifier.height(4.dp))
                Box(modifier = Modifier.semantics(mergeDescendants = true) { testTag = "task_card_name" }) {
                    Text(
                        text = taskList.name,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                }
                Spacer(Modifier.height(2.dp))
                Box(modifier = Modifier.semantics(mergeDescendants = true) { testTag = "task_card_items_count" }) {
                    Text(
                        text = "${taskList.tasks.size} items",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
            Spacer(Modifier.width(12.dp))
            Box(modifier = Modifier.semantics(mergeDescendants = true) { testTag = "task_card_completion_percentage" }) {
                Text(
                    text = "$completionPercentage%",
                    style = MaterialTheme.typography.labelLarge,
                    color = if (completionPercentage == 100)
                        MaterialTheme.colorScheme.secondary
                    else
                        MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
        Spacer(Modifier.height(10.dp))
        LinearProgressIndicator(
            progress = { completionPercentage / 100f },
            modifier = Modifier.fillMaxWidth().height(4.dp).clip(MaterialTheme.shapes.small),
            color = MaterialTheme.colorScheme.secondary,
            trackColor = MaterialTheme.colorScheme.surfaceContainerHighest,
            strokeCap = StrokeCap.Round
        )
    }
}
