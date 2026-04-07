package com.atiurin.dailydo.model

import kotlinx.serialization.Serializable

@Serializable
data class CreateListRequest(
    val name: String,
    val tasks: List<TaskName>
)

@Serializable
data class TaskName(
    val name: String
)

@Serializable
data class UpdateTaskRequest(
    val done: Boolean? = null,
    val name: String? = null
)
