package com.atiurin.dailydo.model

import kotlinx.serialization.Serializable

@Serializable
data class Task(
    val id: String,
    val name: String,
    val done: Boolean = false
)
