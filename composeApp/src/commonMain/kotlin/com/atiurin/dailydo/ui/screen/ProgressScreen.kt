package com.atiurin.dailydo.ui.screen

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.atiurin.dailydo.model.Task
import com.atiurin.dailydo.model.TaskList
import com.atiurin.dailydo.ui.component.TaskItem

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProgressScreen(
    taskList: TaskList,
    completionPercentage: Int,
    completedCount: Int,
    onBack: () -> Unit,
    onToggleTask: (taskId: String) -> Unit,
    onEditTask: (taskId: String, newName: String) -> Unit
) {
    var editingTask by remember { mutableStateOf<Task?>(null) }
    var editText by remember { mutableStateOf("") }

    val pendingTasks = taskList.tasks.filter { !it.done }
    val completedTasks = taskList.tasks.filter { it.done }
    val hasCompletedTasks = completedTasks.isNotEmpty()

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Spacer(modifier = Modifier.weight(1f))
                        Text(
                            text = "$completedCount/${taskList.tasks.size} done",
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        IconButton(onClick = {}) {
                            Icon(
                                Icons.Filled.Edit,
                                contentDescription = "Edit list",
                                tint = MaterialTheme.colorScheme.primary
                            )
                        }
                    }
                },
                navigationIcon = {
                    TextButton(onClick = onBack) {
                        Icon(
                            Icons.Filled.ArrowBack,
                            contentDescription = "Back",
                            tint = MaterialTheme.colorScheme.primary
                        )
                        Text("Back", color = MaterialTheme.colorScheme.primary)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.background
                )
            )
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(horizontal = 16.dp)
                .semantics { testTag = "progress_column" },
            verticalArrangement = Arrangement.spacedBy(0.dp)
        ) {
            item {
                Spacer(Modifier.height(8.dp))
                Text(
                    text = taskList.name,
                    modifier = Modifier.semantics { testTag = "progress_list_title" },
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = taskList.date,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(Modifier.height(16.dp))
                // Progress card
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(MaterialTheme.shapes.large)
                        .background(MaterialTheme.colorScheme.surfaceContainerLow)
                        .padding(16.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text(
                                text = "CURRENT VELOCITY",
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Text(
                                text = "$completionPercentage% Complete",
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.primary
                            )
                        }
                    }
                    Spacer(Modifier.height(8.dp))
                    LinearProgressIndicator(
                        progress = { completionPercentage / 100f },
                        modifier = Modifier.fillMaxWidth().height(6.dp).clip(MaterialTheme.shapes.small),
                        color = MaterialTheme.colorScheme.secondary,
                        trackColor = MaterialTheme.colorScheme.surfaceContainerHighest,
                        strokeCap = StrokeCap.Round
                    )
                }
                Spacer(Modifier.height(20.dp))
            }

            // Pending section
            item {
                Text(
                    text = "Pending ${pendingTasks.size}",
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Spacer(Modifier.height(4.dp))
            }
            items(pendingTasks, key = { it.id }) { task ->
                TaskItem(
                    task = task,
                    onToggle = { onToggleTask(task.id) },
                    onEdit = {
                        editingTask = task
                        editText = task.name
                    }
                )
            }

            if (completedTasks.isNotEmpty()) {
                item {
                    Spacer(Modifier.height(16.dp))
                    Text(
                        text = "Completed ${completedTasks.size}",
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Spacer(Modifier.height(4.dp))
                }
                items(completedTasks, key = { it.id }) { task ->
                    TaskItem(
                        task = task,
                        onToggle = { onToggleTask(task.id) },
                        onEdit = {
                            editingTask = task
                            editText = task.name
                        }
                    )
                }
            }

            // Motivational banner
            item {
                AnimatedVisibility(
                    visible = hasCompletedTasks,
                    enter = fadeIn(),
                    exit = fadeOut()
                ) {
                    Spacer(Modifier.height(20.dp))
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(MaterialTheme.shapes.extraLarge)
                            .background(MaterialTheme.colorScheme.primary)
                            .padding(20.dp)
                    ) {
                        Column {
                            Text(
                                text = "Keep the momentum!",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onPrimary
                            )
                            Spacer(Modifier.height(4.dp))
                            Text(
                                text = "You've completed $completedCount task${if (completedCount > 1) "s" else ""}. Take a 5-minute breather.",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onPrimary.copy(alpha = 0.85f)
                            )
                        }
                    }
                }
                Spacer(Modifier.height(24.dp))
            }
        }
    }

    // Edit task dialog
    if (editingTask != null) {
        AlertDialog(
            onDismissRequest = { editingTask = null },
            title = { Text("Edit Task") },
            text = {
                OutlinedTextField(
                    value = editText,
                    onValueChange = { editText = it },
                    singleLine = true
                )
            },
            confirmButton = {
                TextButton(onClick = {
                    val task = editingTask
                    if (task != null && editText.isNotBlank()) {
                        onEditTask(task.id, editText.trim())
                    }
                    editingTask = null
                }) { Text("Save") }
            },
            dismissButton = {
                TextButton(onClick = { editingTask = null }) { Text("Cancel") }
            }
        )
    }
}
