package com.atiurin.dailydo

interface Platform {
    val name: String
}

expect fun getPlatform(): Platform