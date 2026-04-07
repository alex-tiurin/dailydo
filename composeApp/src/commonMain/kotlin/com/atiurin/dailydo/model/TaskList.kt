package com.atiurin.dailydo.model

import kotlinx.serialization.Serializable

@Serializable
data class TaskList(
    val id: String,
    val name: String,
    val date: String,
    val tasks: List<Task> = emptyList()
)
